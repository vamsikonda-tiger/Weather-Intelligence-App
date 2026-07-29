import React from 'react';
import {
  Clock,
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Droplets,
} from 'lucide-react';
import { HourlyForecastItem, TemperatureUnit } from '../types';
import { formatTemp, getWeatherCondition } from '../utils/weatherUtils';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly, unit }) => {
  const renderWeatherIcon = (iconName: string) => {
    const cls = 'w-5 h-5';
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${cls} text-amber-500 dark:text-amber-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${cls} text-sky-500 dark:text-sky-400`} />;
      case 'Cloud':
        return <Cloud className={`${cls} text-slate-400 dark:text-slate-300`} />;
      case 'CloudRain':
        return <CloudRain className={`${cls} text-indigo-500 dark:text-indigo-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${cls} text-cyan-500 dark:text-cyan-300`} />;
      case 'CloudSnow':
        return <CloudSnow className={`${cls} text-sky-400 dark:text-sky-200`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${cls} text-purple-500 dark:text-purple-400`} />;
      case 'CloudFog':
        return <CloudFog className={`${cls} text-slate-400`} />;
      default:
        return <CloudSun className={`${cls} text-indigo-500 dark:text-indigo-400`} />;
    }
  };

  if (!hourly || hourly.length === 0) return null;

  return (
    <section className="mb-8 p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            24-Hour Timeline
            <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
              Hourly Dynamics
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Sub-daily atmospheric variations and rain probabilities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin">
        {hourly.map((item, idx) => {
          const condition = getWeatherCondition(item.weatherCode);
          return (
            <div
              key={`${item.time}-${idx}`}
              className="p-4 bg-slate-50/80 dark:bg-slate-950/80 rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800/80 flex flex-col items-center justify-between min-w-[95px] shrink-0 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer group"
            >
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {idx === 0 ? 'Now' : item.hourLabel}
              </span>

              <div className="my-2.5 p-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800/80 group-hover:scale-110 transition-transform">
                {renderWeatherIcon(condition.iconName)}
              </div>

              <span className="text-base font-black text-slate-900 dark:text-white">
                {formatTemp(item.temp, unit)}
              </span>

              {item.precipitationProbability > 0 ? (
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                  <Droplets className="w-2.5 h-2.5" />
                  <span>{item.precipitationProbability}%</span>
                </div>
              ) : (
                <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 mt-1">Dry</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
