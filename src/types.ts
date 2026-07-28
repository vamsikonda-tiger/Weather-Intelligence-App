export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface GeoLocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
  country_code?: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  apparentTemperature?: number;
  uvIndex?: number;
  surfacePressure?: number;
  time?: string;
}

export interface DailyForecastItem {
  date: string;
  dayName: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  windSpeedMax?: number;
  uvIndexMax?: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecastItem {
  time: string;
  hourLabel: string;
  temp: number;
  precipitationProbability: number;
  weatherCode: number;
}

export interface WeatherData {
  city: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  timezone: string;
}

export interface SmartRecommendation {
  id: string;
  category: 'umbrella' | 'clothing' | 'activity' | 'uv' | 'wind' | 'general';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'alert' | 'success';
}
