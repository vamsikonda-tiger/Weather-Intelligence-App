import { DailyForecastItem, CurrentWeather, SmartRecommendation, TemperatureUnit } from '../types';

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const value = convertTemp(celsius, unit);
  return `${value}°${unit === 'celsius' ? 'C' : 'F'}`;
}

export function convertWindSpeed(kmh: number, unit: TemperatureUnit): { value: number; unitLabel: string } {
  if (unit === 'fahrenheit') {
    // Convert km/h to mph
    return { value: Math.round(kmh * 0.621371), unitLabel: 'mph' };
  }
  return { value: Math.round(kmh), unitLabel: 'km/h' };
}

export interface WeatherConditionInfo {
  label: string;
  description: string;
  iconName: 'Sun' | 'Cloud' | 'CloudSun' | 'CloudRain' | 'CloudDrizzle' | 'CloudSnow' | 'CloudLightning' | 'CloudFog' | 'Wind';
  bgGradient: string;
  themeColor: string;
}

export function getWeatherCondition(code: number): WeatherConditionInfo {
  switch (code) {
    case 0:
      return {
        label: 'Clear Sky',
        description: 'Sunny and clear conditions',
        iconName: 'Sun',
        bgGradient: 'from-amber-400/20 via-sky-400/20 to-blue-500/10',
        themeColor: 'text-amber-500',
      };
    case 1:
    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Scattered clouds with sunshine',
        iconName: 'CloudSun',
        bgGradient: 'from-blue-400/20 via-indigo-300/20 to-sky-500/10',
        themeColor: 'text-sky-500',
      };
    case 3:
      return {
        label: 'Overcast',
        description: 'Cloudy skies throughout',
        iconName: 'Cloud',
        bgGradient: 'from-slate-400/20 via-gray-400/20 to-slate-600/10',
        themeColor: 'text-slate-500',
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        description: 'Reduced visibility due to fog',
        iconName: 'CloudFog',
        bgGradient: 'from-zinc-400/20 via-slate-400/20 to-gray-500/10',
        themeColor: 'text-zinc-500',
      };
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return {
        label: 'Drizzle',
        description: 'Light rain drizzle',
        iconName: 'CloudDrizzle',
        bgGradient: 'from-sky-500/20 via-cyan-400/20 to-blue-600/10',
        themeColor: 'text-cyan-500',
      };
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rainy',
        description: 'Rain showers expected',
        iconName: 'CloudRain',
        bgGradient: 'from-blue-600/20 via-indigo-500/20 to-slate-700/10',
        themeColor: 'text-blue-500',
      };
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return {
        label: 'Snowy',
        description: 'Snowfall and chilly winds',
        iconName: 'CloudSnow',
        bgGradient: 'from-sky-200/30 via-indigo-100/30 to-blue-300/20',
        themeColor: 'text-sky-400',
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        description: 'Stormy with possible lightning and heavy rain',
        iconName: 'CloudLightning',
        bgGradient: 'from-purple-900/30 via-slate-800/30 to-indigo-900/20',
        themeColor: 'text-purple-500',
      };
    default:
      return {
        label: 'Moderate Weather',
        description: 'Fair weather conditions',
        iconName: 'CloudSun',
        bgGradient: 'from-blue-400/20 via-indigo-300/20 to-sky-500/10',
        themeColor: 'text-blue-500',
      };
  }
}

export function generateSmartRecommendations(
  current: CurrentWeather,
  todayForecast?: DailyForecastItem
): SmartRecommendation[] {
  const list: SmartRecommendation[] = [];
  const maxRainProb = todayForecast ? todayForecast.precipitationProbability : 0;
  const temp = current.temperature;
  const wind = current.windSpeed;
  const uv = current.uvIndex ?? 0;

  // Rain / Umbrella Recommendation
  if (maxRainProb >= 60 || [61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(current.weatherCode)) {
    list.push({
      id: 'umbrella-high',
      category: 'umbrella',
      title: 'Bring an Umbrella',
      description: `High precipitation chance (${maxRainProb}%). Heavy showers or rain likely today.`,
      severity: 'alert',
    });
  } else if (maxRainProb >= 30) {
    list.push({
      id: 'umbrella-mod',
      category: 'umbrella',
      title: 'Keep Rain Gear Handy',
      description: `Moderate probability of rain (${maxRainProb}%). Consider carrying a compact umbrella.`,
      severity: 'warning',
    });
  } else {
    list.push({
      id: 'umbrella-low',
      category: 'umbrella',
      title: 'No Rain Expected',
      description: `Low precipitation probability (${maxRainProb}%). You can leave the umbrella behind.`,
      severity: 'success',
    });
  }

  // Clothing Recommendation
  if (temp <= 5) {
    list.push({
      id: 'clothing-freezing',
      category: 'clothing',
      title: 'Heavy Winter Wear Needed',
      description: `Freezing temps (${Math.round(temp)}°C). Wear a heavy coat, scarf, gloves, and insulated layers.`,
      severity: 'alert',
    });
  } else if (temp <= 15) {
    list.push({
      id: 'clothing-chilly',
      category: 'clothing',
      title: 'Layer Up',
      description: `Chilly conditions (${Math.round(temp)}°C). A light jacket, sweater, or hoodie is recommended.`,
      severity: 'warning',
    });
  } else if (temp <= 25) {
    list.push({
      id: 'clothing-pleasant',
      category: 'clothing',
      title: 'Comfortable Attire',
      description: `Mild and pleasant temperature (${Math.round(temp)}°C). Standard light clothing is ideal.`,
      severity: 'info',
    });
  } else {
    list.push({
      id: 'clothing-hot',
      category: 'clothing',
      title: 'Breathable Summer Clothes',
      description: `Hot weather (${Math.round(temp)}°C). Wear light, breathable fabrics and drink plenty of water.`,
      severity: 'warning',
    });
  }

  // Outdoor Activity Recommendation
  if (current.weatherCode <= 2 && maxRainProb < 20 && wind < 25) {
    list.push({
      id: 'activity-great',
      category: 'activity',
      title: 'Great Day for Outdoor Activities!',
      description: 'Clear or partly sunny skies with gentle winds. Ideal for a walk, jog, or picnic.',
      severity: 'success',
    });
  } else if (maxRainProb >= 50 || current.weatherCode >= 61) {
    list.push({
      id: 'activity-indoor',
      category: 'activity',
      title: 'Prefer Indoor Activities',
      description: 'Wet weather predicted. Great day for gym workouts, museum visits, or cozy indoor reading.',
      severity: 'info',
    });
  } else {
    list.push({
      id: 'activity-fair',
      category: 'activity',
      title: 'Fair Outdoor Conditions',
      description: 'Acceptable conditions for outdoor tasks, but keep an eye on cloud updates.',
      severity: 'info',
    });
  }

  // UV / Sun Protection
  if (uv >= 6) {
    list.push({
      id: 'uv-high',
      category: 'uv',
      title: 'High UV Radiation',
      description: `UV Index is high (${uv}). Apply SPF 30+ sunscreen and wear protective sunglasses.`,
      severity: 'alert',
    });
  } else if (uv >= 3) {
    list.push({
      id: 'uv-moderate',
      category: 'uv',
      title: 'Moderate UV Index',
      description: `UV Index is moderate (${uv}). Sun protection recommended if outside for over 30 minutes.`,
      severity: 'warning',
    });
  }

  // Wind Advisory
  if (wind >= 30) {
    list.push({
      id: 'wind-breezy',
      category: 'wind',
      title: 'Breezy / Strong Winds',
      description: `Wind speed is ${Math.round(wind)} km/h. Secure loose outdoor objects and watch for wind gusts.`,
      severity: 'warning',
    });
  }

  return list;
}
