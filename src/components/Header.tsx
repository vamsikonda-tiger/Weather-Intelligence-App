import React, { useState, useEffect } from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';
import { TemperatureUnit } from '../types';

interface HeaderProps {
  unit: TemperatureUnit;
  onToggleUnit: (unit: TemperatureUnit) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onRefresh,
  isRefreshing = false,
}) => {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) +
          ' • ' +
          now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] shadow-xl mb-6">
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
          <CloudSun className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Skywise Intelligence
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Bento AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Precision Weather Analytics</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Live Date / Time Readout */}
        <div className="hidden md:block text-right pr-2">
          <p className="text-xs font-semibold text-slate-300">{timeStr}</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Live Sync</p>
        </div>

        {/* Refresh Button */}
        <button
          id="refresh-weather-btn"
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Weather Data"
          className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-700/60 disabled:opacity-50 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        {/* Temperature Unit Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            id="unit-celsius-btn"
            onClick={() => onToggleUnit('celsius')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              unit === 'celsius'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °C
          </button>
          <button
            id="unit-fahrenheit-btn"
            onClick={() => onToggleUnit('fahrenheit')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              unit === 'fahrenheit'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};

