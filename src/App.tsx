import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { SmartRecommendations } from './components/SmartRecommendations';
import { ForecastGrid } from './components/ForecastGrid';
import { WeatherChart } from './components/WeatherChart';
import { HourlyForecast } from './components/HourlyForecast';
import { ErrorMessage } from './components/ErrorMessage';
import { GeoLocationResult, WeatherData, TemperatureUnit } from './types';
import { fetchWeather } from './services/weatherApi';
import { generateSmartRecommendations } from './utils/weatherUtils';
import { Loader2, CloudSun, Compass } from 'lucide-react';

const DEFAULT_CITY = {
  name: 'New York',
  latitude: 40.7128,
  longitude: -74.006,
  country: 'United States',
  admin1: 'New York',
};

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('weather_theme');
    if (saved === 'light') return false;
    if (saved === 'dark') return true;
    return true;
  });

  const [unit, setUnit] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('weather_temp_unit');
    return (saved === 'fahrenheit' ? 'fahrenheit' : 'celsius') as TemperatureUnit;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('weather_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);

  const [currentCity, setCurrentCity] = useState<{
    name: string;
    lat: number;
    lon: number;
    country?: string;
    admin1?: string;
  }>(() => {
    const saved = localStorage.getItem('weather_last_city');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback to default city
      }
    }
    return {
      name: DEFAULT_CITY.name,
      lat: DEFAULT_CITY.latitude,
      lon: DEFAULT_CITY.longitude,
      country: DEFAULT_CITY.country,
      admin1: DEFAULT_CITY.admin1,
    };
  });

  const loadWeather = useCallback(async (lat: number, lon: number, cityName: string, country?: string, admin1?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(lat, lon, cityName, country, admin1);
      setWeatherData(data);
      setSelectedDayIndex(0);
      localStorage.setItem(
        'weather_last_city',
        JSON.stringify({ name: cityName, lat, lon, country, admin1 })
      );
    } catch (err: any) {
      setError(err.message || 'Unable to fetch weather forecast. Please check your network or city name.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch weather on city change or initial mount
  useEffect(() => {
    loadWeather(
      currentCity.lat,
      currentCity.lon,
      currentCity.name,
      currentCity.country,
      currentCity.admin1
    );
  }, [currentCity, loadWeather]);

  // Unit toggle handler
  const handleToggleUnit = (newUnit: TemperatureUnit) => {
    setUnit(newUnit);
    localStorage.setItem('weather_temp_unit', newUnit);
  };

  // City selection from search or dropdown
  const handleSelectCity = (city: GeoLocationResult) => {
    setCurrentCity({
      name: city.name,
      lat: city.latitude,
      lon: city.longitude,
      country: city.country,
      admin1: city.admin1,
    });
  };

  // Fallback city selection from error screen
  const handleSelectFallbackCity = (city: { name: string; lat: number; lon: number; country: string }) => {
    setCurrentCity({
      name: city.name,
      lat: city.lat,
      lon: city.lon,
      country: city.country,
    });
  };

  // GPS Geolocation Handler
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentCity({
          name: 'Your Location',
          lat: latitude,
          lon: longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setError(`Location access denied: ${err.message}. Please search for a city manually.`);
      },
      { timeout: 10000 }
    );
  };

  const smartRecommendations = weatherData
    ? generateSmartRecommendations(
        weatherData.current,
        weatherData.daily[selectedDayIndex] || weatherData.daily[0]
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header Navigation */}
        <Header
          unit={unit}
          onToggleUnit={handleToggleUnit}
          theme={isDark ? 'dark' : 'light'}
          onToggleTheme={handleToggleTheme}
          onRefresh={() =>
            loadWeather(
              currentCity.lat,
              currentCity.lon,
              currentCity.name,
              currentCity.country,
              currentCity.admin1
            )
          }
          isRefreshing={isLoading}
        />

        {/* Search & Location Selection */}
        <SearchBar
          onSelectCity={handleSelectCity}
          onUseLocation={handleUseLocation}
          isLocating={isLocating}
        />

        {/* Error Notification */}
        {error && (
          <ErrorMessage
            message={error}
            onRetry={() =>
              loadWeather(
                currentCity.lat,
                currentCity.lon,
                currentCity.name,
                currentCity.country,
                currentCity.admin1
              )
            }
            onSelectFallbackCity={handleSelectFallbackCity}
          />
        )}

        {/* Loading Skeleton */}
        {isLoading && !weatherData && (
          <div className="p-12 text-center bg-slate-900/60 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col items-center justify-center gap-4 my-8 backdrop-blur-xl">
            <div className="p-4 bg-indigo-500/15 text-indigo-400 rounded-2xl animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Synchronizing Weather Intelligence...
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                Establishing direct Open-Meteo telemetry stream
              </p>
            </div>
          </div>
        )}

        {/* Main Dashboard Content */}
        {weatherData && (
          <main className="space-y-6">
            {/* Current Weather Telemetry */}
            <CurrentWeatherCard data={weatherData} unit={unit} />

            {/* Smart Advice & Actionable Insights */}
            <SmartRecommendations recommendations={smartRecommendations} />

            {/* 24-Hour Timeline */}
            <HourlyForecast hourly={weatherData.hourly} unit={unit} />

            {/* 7-Day Forecast Grid */}
            <ForecastGrid
              daily={weatherData.daily}
              unit={unit}
              selectedDayIndex={selectedDayIndex}
              onSelectDay={(idx) => setSelectedDayIndex(idx)}
            />

            {/* Weather Trend Line Chart (Recharts) */}
            <WeatherChart
              daily={weatherData.daily}
              hourly={weatherData.hourly}
              unit={unit}
            />
          </main>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-200">
              Skywise Weather Intelligence
            </span>
            <span>• Powered by Open-Meteo API</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-indigo-400" /> Bento Grid Architecture
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[10px] uppercase font-bold text-slate-300">
              Cloudflare Pages Ready
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
