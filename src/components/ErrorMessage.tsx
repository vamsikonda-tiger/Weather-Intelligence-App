import React from 'react';
import { AlertCircle, RefreshCw, MapPinOff } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onSelectFallbackCity?: (city: { name: string; lat: number; lon: number; country: string }) => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onSelectFallbackCity,
}) => {
  const isCityNotFound = message.toLowerCase().includes('city') || message.toLowerCase().includes('found');

  return (
    <div className="w-full my-8 p-6 bg-rose-950/40 backdrop-blur-xl border border-rose-900/60 rounded-[2rem] shadow-xl text-center flex flex-col items-center justify-center gap-4">
      <div className="p-3 bg-rose-900/60 text-rose-400 rounded-2xl shadow-inner border border-rose-800/50">
        {isCityNotFound ? <MapPinOff className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
      </div>

      <div>
        <h3 className="text-lg font-bold text-rose-200">
          {isCityNotFound ? 'Location Not Found' : 'Telemetry Stream Disrupted'}
        </h3>
        <p className="text-sm text-rose-300 mt-1 max-w-md mx-auto font-medium">
          {message}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        {onRetry && (
          <button
            id="retry-fetch-weather-btn"
            type="button"
            onClick={onRetry}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-full shadow-lg shadow-rose-950/50 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-establish Sync
          </button>
        )}

        {onSelectFallbackCity && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-rose-300 font-semibold">
              Or fallback to:
            </span>
            <button
              id="fallback-city-newyork-btn"
              type="button"
              onClick={() =>
                onSelectFallbackCity({
                  name: 'New York',
                  lat: 40.7128,
                  lon: -74.006,
                  country: 'USA',
                })
              }
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-900/50 text-slate-200 border border-rose-900/60 rounded-full text-xs font-bold cursor-pointer transition-colors"
            >
              New York
            </button>
            <button
              id="fallback-city-london-btn"
              type="button"
              onClick={() =>
                onSelectFallbackCity({
                  name: 'London',
                  lat: 51.5074,
                  lon: -0.1278,
                  country: 'UK',
                })
              }
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-900/50 text-slate-200 border border-rose-900/60 rounded-full text-xs font-bold cursor-pointer transition-colors"
            >
              London
            </button>
            <button
              id="fallback-city-tokyo-btn"
              type="button"
              onClick={() =>
                onSelectFallbackCity({
                  name: 'Tokyo',
                  lat: 35.6895,
                  lon: 139.6917,
                  country: 'Japan',
                })
              }
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-900/50 text-slate-200 border border-rose-900/60 rounded-full text-xs font-bold cursor-pointer transition-colors"
            >
              Tokyo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
