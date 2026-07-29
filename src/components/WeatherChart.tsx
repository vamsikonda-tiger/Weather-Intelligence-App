import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { TrendingUp, Droplets, Clock } from 'lucide-react';
import { DailyForecastItem, HourlyForecastItem, TemperatureUnit } from '../types';
import { convertTemp } from '../utils/weatherUtils';

interface WeatherChartProps {
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  unit: TemperatureUnit;
}

type ChartMode = 'daily-temp' | 'daily-rain' | 'hourly-temp';

export const WeatherChart: React.FC<WeatherChartProps> = ({
  daily,
  hourly,
  unit,
}) => {
  const [activeTab, setActiveTab] = useState<ChartMode>('daily-temp');

  const unitLabel = unit === 'celsius' ? '°C' : '°F';

  const dailyChartData = daily.map((item) => ({
    day: item.dayName,
    date: item.date,
    tempMax: convertTemp(item.tempMax, unit),
    tempMin: convertTemp(item.tempMin, unit),
    rainProb: item.precipitationProbability,
    weatherCode: item.weatherCode,
  }));

  const hourlyChartData = hourly.map((item) => ({
    time: item.hourLabel,
    temp: convertTemp(item.temp, unit),
    rainProb: item.precipitationProbability,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-white p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl backdrop-blur-xl text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200 mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5 font-semibold" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-black">
                {entry.value}
                {entry.unit || (activeTab === 'daily-rain' ? '%' : unitLabel)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="p-6 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-xl mb-8">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white rounded-2xl shadow-md shadow-indigo-500/20">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              Atmospheric Trend Analytics
              <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-300 bg-indigo-500/10 dark:bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/20 dark:border-indigo-500/30">
                Visual Telemetry
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Interactive temperature progression and precipitation curves
            </p>
          </div>
        </div>

        {/* Chart View Selector Tabs */}
        <div className="flex items-center p-1 bg-slate-100/80 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 self-start sm:self-auto overflow-x-auto">
          <button
            id="chart-tab-daily-temp"
            type="button"
            onClick={() => setActiveTab('daily-temp')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'daily-temp'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Temp Trend</span>
          </button>

          <button
            id="chart-tab-daily-rain"
            type="button"
            onClick={() => setActiveTab('daily-rain')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'daily-rain'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>Rain Chance</span>
          </button>

          <button
            id="chart-tab-hourly-temp"
            type="button"
            onClick={() => setActiveTab('hourly-temp')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'hourly-temp'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>24H Curve</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'daily-temp' ? (
            /* 7-Day Temperature Trend Chart */
            <ComposedChart data={dailyChartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} />
              <YAxis
                stroke="#64748b"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                unit={unitLabel}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
              <Area type="monotone" dataKey="tempMax" stroke="#818cf8" fillOpacity={1} fill="url(#colorMax)" />
              <Area type="monotone" dataKey="tempMin" stroke="#38bdf8" fillOpacity={1} fill="url(#colorMin)" />
              <Line
                type="monotone"
                dataKey="tempMax"
                name="Max Temp"
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ r: 5, fill: '#818cf8', strokeWidth: 2, stroke: '#020617' }}
                activeDot={{ r: 7 }}
              />
              <Line
                type="monotone"
                dataKey="tempMin"
                name="Min Temp"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 5, fill: '#38bdf8', strokeWidth: 2, stroke: '#020617' }}
                activeDot={{ r: 7 }}
              />
            </ComposedChart>
          ) : activeTab === 'daily-rain' ? (
            /* 7-Day Rain Probability Chart */
            <ComposedChart data={dailyChartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
              <Bar
                dataKey="rainProb"
                name="Precipitation Probability"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
                barSize={28}
              />
            </ComposedChart>
          ) : (
            /* 24-Hour Temperature Curve Chart */
            <ComposedChart data={hourlyChartData} margin={{ top: 15, right: 15, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorHourly" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} interval={2} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} tickLine={false} unit={unitLabel} domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ color: '#cbd5e1' }} />
              <Area type="monotone" dataKey="temp" stroke="#818cf8" fillOpacity={1} fill="url(#colorHourly)" />
              <Line
                type="monotone"
                dataKey="temp"
                name="Hourly Temp"
                stroke="#818cf8"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  );
};
