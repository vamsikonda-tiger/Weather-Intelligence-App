import React from 'react';
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
  Droplets,
  Gauge,
  SunMedium,
  Thermometer,
  MapPin,
  Calendar,
} from 'lucide-react';
import { WeatherData, TemperatureUnit } from '../types';
import {
  formatTemp,
  convertWindSpeed,
  getWeatherCondition,
} from '../utils/weatherUtils';

interface CurrentWeatherCardProps {
  data: WeatherData;
  unit: TemperatureUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ data, unit }) => {
  const { current, city, country, admin1, daily } = data;
  const condition = getWeatherCondition(current.weatherCode);
  const windInfo = convertWindSpeed(current.windSpeed, unit);
  const todayForecast = daily[0];

  const renderWeatherIcon = (iconName: string) => {
    const iconClass = 'w-16 h-16 text-amber-300 drop-shadow-lg';
    switch (iconName) {
      case 'Sun':
        return <Sun className={iconClass} />;
      case 'CloudSun':
        return <CloudSun className="w-16 h-16 text-sky-200 drop-shadow-lg" />;
      case 'Cloud':
        return <Cloud className="w-16 h-16 text-slate-300 drop-shadow-lg" />;
      case 'CloudRain':
        return <CloudRain className="w-16 h-16 text-sky-300 drop-shadow-lg" />;
      case 'CloudDrizzle':
        return <CloudDrizzle className="w-16 h-16 text-cyan-200 drop-shadow-lg" />;
      case 'CloudSnow':
        return <CloudSnow className="w-16 h-16 text-sky-100 drop-shadow-lg" />;
      case 'CloudLightning':
        return <CloudLightning className="w-16 h-16 text-purple-300 drop-shadow-lg" />;
      case 'CloudFog':
        return <CloudFog className="w-16 h-16 text-slate-200 drop-shadow-lg" />;
      default:
        return <CloudSun className={iconClass} />;
    }
  };

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
      {/* Primary Bento Hero Card: Temperature & Location (Spans 7 cols on LG) */}
      <div className="lg:col-span-7 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 p-7 sm:p-9 text-white border border-indigo-500/30 shadow-2xl shadow-indigo-950/50 flex flex-col justify-between min-h-[320px]">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 text-white shadow-inner">
              <MapPin className="w-6 h-6 text-indigo-200" />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white">{city}</h2>
              <p className="text-xs font-semibold text-indigo-200/90 mt-0.5">
                {[admin1, country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/15 text-xs font-semibold text-indigo-100 shadow-inner shrink-0">
            <Calendar className="w-3.5 h-3.5 text-indigo-300" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Main Temperature display */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 items-center gap-6 my-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/15 shrink-0 shadow-lg">
              {renderWeatherIcon(condition.iconName)}
            </div>
            <div>
              <div className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                {formatTemp(current.temperature, unit)}
              </div>
              <div className="text-lg font-bold text-indigo-100 mt-1">{condition.label}</div>
              <p className="text-xs text-indigo-200/80 font-medium">{condition.description}</p>
            </div>
          </div>

          {/* Feels like & Today High/Low */}
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 space-y-3">
            {current.apparentTemperature !== undefined && (
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-indigo-200 flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-rose-300" /> Feels Like
                </span>
                <span className="font-extrabold text-white text-sm">
                  {formatTemp(current.apparentTemperature, unit)}
                </span>
              </div>
            )}

            {todayForecast && (
              <div className="flex items-center justify-between text-xs border-t border-white/10 pt-2.5">
                <span className="font-semibold text-indigo-200">Today Range</span>
                <span className="font-extrabold text-white text-sm">
                  <span className="text-rose-300">{formatTemp(todayForecast.tempMax, unit)}</span>
                  <span className="text-indigo-300/60 mx-1.5">/</span>
                  <span className="text-sky-300">{formatTemp(todayForecast.tempMin, unit)}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Bento Metric Cards (Spans 5 cols on LG) */}
      <div className="lg:col-span-5 grid grid-cols-2 gap-4">
        {/* Humidity Bento Card */}
        <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Humidity</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 flex items-center justify-center text-sky-400">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">{current.humidity}%</div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {current.humidity > 70 ? 'High Moisture' : current.humidity < 30 ? 'Dry Air' : 'Optimal Balance'}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-sky-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, current.humidity))}%` }}
            />
          </div>
        </div>

        {/* Wind Speed Bento Card */}
        <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Wind Speed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-400">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">
              {windInfo.value}{' '}
              <span className="text-xs font-semibold text-slate-400">{windInfo.unitLabel}</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {current.windSpeed < 15 ? 'Gentle Breeze' : current.windSpeed < 30 ? 'Moderate Gusts' : 'Gale Wind'}
            </p>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-full w-max border border-teal-500/20">
            Direct Vector
          </div>
        </div>

        {/* Pressure Bento Card */}
        <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pressure</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 flex items-center justify-center text-indigo-400">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">
              {current.surfacePressure ? Math.round(current.surfacePressure) : '--'}
              <span className="text-xs font-semibold text-slate-400"> hPa</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1">
              {current.surfacePressure && current.surfacePressure > 1013 ? 'High Barometric' : 'Standard Air'}
            </p>
          </div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full w-max border border-indigo-500/20">
            Stable
          </div>
        </div>

        {/* UV Index Bento Card */}
        <div className="p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-lg flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">UV Index</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400">
              <SunMedium className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-black text-white">
              {current.uvIndex !== undefined ? current.uvIndex.toFixed(1) : '--'}
            </div>
            <p className="text-[11px] font-semibold mt-1">
              {current.uvIndex === undefined ? (
                <span className="text-slate-400">No Data</span>
              ) : current.uvIndex < 3 ? (
                <span className="text-emerald-400">Low Exposure</span>
              ) : current.uvIndex < 6 ? (
                <span className="text-amber-400">Moderate Exposure</span>
              ) : (
                <span className="text-rose-400">High Risk Protection</span>
              )}
            </p>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (current.uvIndex || 0) < 3 ? 'bg-emerald-400' : (current.uvIndex || 0) < 6 ? 'bg-amber-400' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, ((current.uvIndex || 0) / 11) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
