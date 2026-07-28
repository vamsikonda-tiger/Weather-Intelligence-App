import React from 'react';
import {
  Calendar,
  CloudRain,
  Sun,
  Cloud,
  CloudSun,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from 'lucide-react';
import { DailyForecastItem, TemperatureUnit } from '../types';
import { formatTemp, getWeatherCondition } from '../utils/weatherUtils';

interface ForecastGridProps {
  daily: DailyForecastItem[];
  unit: TemperatureUnit;
  selectedDayIndex?: number;
  onSelectDay?: (index: number) => void;
}

export const ForecastGrid: React.FC<ForecastGridProps> = ({
  daily,
  unit,
  selectedDayIndex = 0,
  onSelectDay,
}) => {
  const renderWeatherIcon = (iconName: string) => {
    const cls = 'w-7 h-7';
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${cls} text-amber-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${cls} text-sky-400`} />;
      case 'Cloud':
        return <Cloud className={`${cls} text-slate-300`} />;
      case 'CloudRain':
        return <CloudRain className={`${cls} text-indigo-400`} />;
      case 'CloudDrizzle':
        return <CloudDrizzle className={`${cls} text-cyan-300`} />;
      case 'CloudSnow':
        return <CloudSnow className={`${cls} text-sky-200`} />;
      case 'CloudLightning':
        return <CloudLightning className={`${cls} text-purple-400`} />;
      case 'CloudFog':
        return <CloudFog className={`${cls} text-slate-400`} />;
      default:
        return <CloudSun className={`${cls} text-indigo-400`} />;
    }
  };

  const overallMin = Math.min(...daily.map((d) => d.tempMin));
  const overallMax = Math.max(...daily.map((d) => d.tempMax));
  const tempRange = overallMax - overallMin || 1;

  return (
    <section className="mb-8 p-6 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              7-Day Forecast Matrix
              <span className="text-[10px] uppercase font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Weekly Outlook
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Click any day block to inspect specific daily advisory
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3.5">
        {daily.map((item, index) => {
          const condition = getWeatherCondition(item.weatherCode);
          const isSelected = selectedDayIndex === index;

          const leftPercent = ((item.tempMin - overallMin) / tempRange) * 100;
          const widthPercent = Math.max(15, ((item.tempMax - item.tempMin) / tempRange) * 100);

          return (
            <div
              key={item.date}
              onClick={() => onSelectDay?.(index)}
              className={`p-4 rounded-[1.5rem] border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 ring-2 ring-indigo-500/40 shadow-xl shadow-indigo-950/50'
                  : 'bg-slate-950/80 hover:bg-slate-900 border-slate-800/80 shadow-md hover:border-indigo-500/40'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between sm:flex-col sm:items-start gap-1">
                <span className="text-sm font-black text-white">
                  {item.dayName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {new Date(item.date + 'T00:00:00').toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>

              {/* Icon & Condition */}
              <div className="my-3 flex items-center justify-between sm:justify-center sm:flex-col gap-2">
                <div className="p-2.5 bg-slate-900 rounded-2xl border border-slate-800">
                  {renderWeatherIcon(condition.iconName)}
                </div>
                <span className="text-xs font-bold text-slate-300 text-center truncate max-w-[120px]">
                  {condition.label}
                </span>
              </div>

              {/* Rain Probability Badge */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="flex items-center gap-1 text-sky-400 font-semibold">
                    <CloudRain className="w-3 h-3" /> Rain
                  </span>
                  <span className="font-extrabold text-white">
                    {item.precipitationProbability}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-400 h-full rounded-full"
                    style={{ width: `${item.precipitationProbability}%` }}
                  />
                </div>
              </div>

              {/* Temperature Bar */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-xs font-black mb-1">
                  <span className="text-rose-400">{formatTemp(item.tempMax, unit)}</span>
                  <span className="text-sky-400">{formatTemp(item.tempMin, unit)}</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full relative overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-sky-400 to-rose-400 rounded-full"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
