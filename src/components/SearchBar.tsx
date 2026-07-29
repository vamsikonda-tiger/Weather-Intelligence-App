import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Locate, X, Loader2 } from 'lucide-react';
import { GeoLocationResult } from '../types';
import { searchCities } from '../services/weatherApi';

interface SearchBarProps {
  onSelectCity: (city: GeoLocationResult) => void;
  onUseLocation: () => void;
  isLocating?: boolean;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6895, lon: 139.6917 },
  { name: 'New York', country: 'USA', lat: 40.7128, lon: -74.006 },
  { name: 'London', country: 'UK', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'Mumbai', country: 'India', lat: 19.076, lon: 72.8777 },
];

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectCity,
  onUseLocation,
  isLocating = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeoLocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced autocomplete search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setSearchError(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setSearchError(null);
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(true);
        if (results.length === 0) {
          setSearchError('No matching city found.');
        }
      } catch (err: any) {
        setSearchError('Unable to search city right now.');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      onSelectCity(suggestions[0]);
      setIsOpen(false);
      setQuery('');
    } else if (query.trim()) {
      setIsLoading(true);
      searchCities(query)
        .then((results) => {
          if (results.length > 0) {
            onSelectCity(results[0]);
            setQuery('');
            setIsOpen(false);
          } else {
            setSearchError('City not found. Try checking spelling.');
          }
        })
        .catch(() => setSearchError('Search failed.'))
        .finally(() => setIsLoading(false));
    }
  };

  const handleSelectSuggestion = (city: GeoLocationResult) => {
    onSelectCity(city);
    setQuery('');
    setIsOpen(false);
  };

  const handlePopularCityClick = (city: typeof POPULAR_CITIES[0]) => {
    onSelectCity({
      id: Math.floor(Math.random() * 100000),
      name: city.name,
      latitude: city.lat,
      longitude: city.lon,
      country: city.country,
    });
  };

  return (
    <div className="w-full mb-6" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5 text-slate-400" />
          </div>

          <input
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            placeholder="Search city (e.g. San Francisco, Tokyo, London)..."
            className="w-full pl-12 pr-10 py-3 bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-full text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-md transition-all"
          />

          {query && (
            <button
              type="button"
              id="clear-search-input-btn"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                setIsOpen(false);
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Submit Button */}
        <button
          id="search-city-submit-btn"
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-full shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* Use Location Button */}
        <button
          id="use-my-location-btn"
          type="button"
          onClick={onUseLocation}
          disabled={isLocating}
          title="Detect Current Location"
          className="p-3 bg-white/80 dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-full shadow-md transition-all flex items-center justify-center shrink-0 disabled:opacity-50 cursor-pointer hover:border-indigo-500/40"
        >
          {isLocating ? (
            <Loader2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400 animate-spin" />
          ) : (
            <Locate className="w-5 h-5 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Suggestions Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 max-h-64 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500 dark:text-indigo-400" /> Locating cities...
              </div>
            )}

            {!isLoading && searchError && (
              <div className="p-4 text-center text-xs text-slate-500 dark:text-slate-400">{searchError}</div>
            )}

            {!isLoading &&
              suggestions.map((city) => (
                <button
                  key={`${city.id}-${city.latitude}`}
                  type="button"
                  onClick={() => handleSelectSuggestion(city)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {city.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                    {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                  </div>
                </button>
              ))}
          </div>
        )}
      </form>

      {/* Quick Pick Popular Cities */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-widest shrink-0">
          Quick Pick:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              id={`quick-city-${city.name.toLowerCase().replace(/\s+/g, '-')}`}
              type="button"
              onClick={() => handlePopularCityClick(city)}
              className="px-3 py-1 text-xs font-semibold bg-white/80 dark:bg-slate-900/80 hover:bg-indigo-50 dark:hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-700 dark:text-slate-300 hover:text-indigo-900 dark:hover:text-white rounded-full border border-slate-200 dark:border-slate-800 transition-all cursor-pointer"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
