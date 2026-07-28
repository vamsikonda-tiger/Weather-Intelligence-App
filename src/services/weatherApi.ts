import { GeoLocationResult, WeatherData, DailyForecastItem, HourlyForecastItem } from '../types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<GeoLocationResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=5&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      return [];
    }
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      country: item.country,
      admin1: item.admin1,
      country_code: item.country_code,
    }));
  } catch (error: any) {
    console.error('Error fetching city coordinates:', error);
    throw new Error(error.message || 'Failed to connect to geocoding service.');
  }
}

export async function fetchWeather(
  lat: number,
  lon: number,
  cityName: string,
  country?: string,
  admin1?: string
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,apparent_temperature,surface_pressure,uv_index',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,uv_index_max,sunrise,sunset',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    timezone: 'auto',
  });

  const url = `${FORECAST_API_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Forecast service error (${response.status})`);
    }
    const data = await response.json();

    if (!data.current || !data.daily) {
      throw new Error('Invalid or incomplete weather data received.');
    }

    // Process daily forecast
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daily: DailyForecastItem[] = [];

    if (data.daily.time && Array.isArray(data.daily.time)) {
      for (let i = 0; i < Math.min(7, data.daily.time.length); i++) {
        const dateStr = data.daily.time[i];
        const dateObj = new Date(dateStr + 'T00:00:00');
        const dayName = i === 0 ? 'Today' : dayNames[dateObj.getDay()];

        daily.push({
          date: dateStr,
          dayName,
          weatherCode: data.daily.weather_code?.[i] ?? 0,
          tempMax: data.daily.temperature_2m_max?.[i] ?? 0,
          tempMin: data.daily.temperature_2m_min?.[i] ?? 0,
          precipitationProbability: data.daily.precipitation_probability_max?.[i] ?? 0,
          windSpeedMax: data.daily.wind_speed_10m_max?.[i],
          uvIndexMax: data.daily.uv_index_max?.[i],
          sunrise: data.daily.sunrise?.[i],
          sunset: data.daily.sunset?.[i],
        });
      }
    }

    // Process hourly forecast (first 24 hours)
    const hourly: HourlyForecastItem[] = [];
    if (data.hourly && data.hourly.time && Array.isArray(data.hourly.time)) {
      const currentHourIndex = new Date().getHours();
      const startIndex = Math.max(0, currentHourIndex);
      const endIndex = Math.min(data.hourly.time.length, startIndex + 24);

      for (let i = startIndex; i < endIndex; i++) {
        const rawTime = data.hourly.time[i];
        const timeObj = new Date(rawTime);
        const hourLabel = timeObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        hourly.push({
          time: rawTime,
          hourLabel,
          temp: data.hourly.temperature_2m?.[i] ?? 0,
          precipitationProbability: data.hourly.precipitation_probability?.[i] ?? 0,
          weatherCode: data.hourly.weather_code?.[i] ?? 0,
        });
      }
    }

    return {
      city: cityName,
      country,
      admin1,
      latitude: lat,
      longitude: lon,
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        weatherCode: data.current.weather_code,
        apparentTemperature: data.current.apparent_temperature,
        surfacePressure: data.current.surface_pressure,
        uvIndex: data.current.uv_index,
        time: data.current.time,
      },
      daily,
      hourly,
      timezone: data.timezone || 'UTC',
    };
  } catch (error: any) {
    console.error('Error fetching weather data:', error);
    throw new Error(error.message || 'Failed to load weather forecast.');
  }
}
