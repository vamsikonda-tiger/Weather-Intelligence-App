# Weather Intelligence App

A modern, high-precision weather forecast web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Recharts**. The app features a stunning **Bento Grid** design system, live city autocomplete search, GPS geolocation detection, 24-hour timeline analytics, 7-day weather trend visualizers, and context-aware smart lifestyle recommendations.

---

## 🌟 Key Features

- **Bento Grid Visual Architecture**: High-contrast deep slate canvas (`#020617`) with indigo gradients, backdrop blur glassmorphism, and modular rounded Bento cards (`rounded-[2rem]`).
- **Open-Meteo Geocoding & Forecast API**: High-frequency meteorological telemetry providing current temperature, apparent temperature, relative humidity, wind speed & direction, surface pressure, and UV index.
- **Smart Advisory Engine**: Rule-based lifestyle recommendations for outdoor activities, clothing layers, umbrella alerts, and UV skin protection.
- **24-Hour Timeline & 7-Day Matrix**: Interactive sub-daily hourly timeline and weekly forecast grid with relative temperature scale bars.
- **Recharts Data Visualizer**: Dynamic trend analytics enabling switching between Temperature Progression, Rain Probability, and 24-Hour Forecast curves.
- **Geolocation & City Autocomplete**: Instant city search powered by Open-Meteo Geocoding with fallback GPS location auto-detection.
- **Temperature Unit Switcher**: Toggle seamlessly between Celsius (°C) and Fahrenheit (°F) with local storage persistence.

---

## 🚀 How the App Was Generated & Deployed

### 1. Generation in Google AI Studio
This codebase was generated and iteratively styled in **Google AI Studio Build** using Gemini agentic AI coding capabilities:
1. Formulated prompt for a full-featured Weather Intelligence Dashboard using Open-Meteo API.
2. Refined UI layout into an executive **Bento Grid** theme with deep slate cards, indigo gradients, and crisp telemetry iconography.
3. Implemented robust client-side weather API integrations and responsive data visualization using Recharts and Lucide React.

### 2. Connecting to GitHub
To sync and back up your project on GitHub:
1. Open terminal or command line in project root directory.
2. Initialize Git repository (if not initialized):
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Weather Intelligence Bento Grid App"
   ```
3. Connect local repository to GitHub remote:
   ```bash
   git remote add origin https://github.com/<your-username>/weather-intelligence-app.git
   git branch -M main
   git push -u origin main
   ```

### 3. Deploying to Cloudflare Pages
To host this client-side Single Page Application (SPA) on Cloudflare Pages:
1. Log into your **Cloudflare Dashboard** and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Select your GitHub repository (`weather-intelligence-app`).
4. Configure build settings:
   - **Framework preset**: `Vite` or `None`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**. Cloudflare Pages will build the static output from `dist/` and issue an SSL-secured live URL within seconds.

---

## 💻 Local Development Setup

Follow these steps to run the project on your local machine:

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation & Execution

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/weather-intelligence-app.git
   cd weather-intelligence-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start local dev server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000` (or the port indicated in terminal).

4. **Build for production**:
   ```bash
   npm run build
   ```
   The production-ready static bundle will be output to the `dist/` directory.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## 📁 Project Structure

```
.
├── index.html              # Single Page Application entry HTML
├── package.json            # Project dependencies and Vite scripts
├── vite.config.ts          # Vite build configuration (outDir: dist)
├── README.md               # Project documentation
├── metadata.json           # App Studio metadata
└── src/
    ├── main.tsx            # React application mounting point
    ├── App.tsx             # Root dashboard container
    ├── index.css           # Global Tailwind CSS and Bento scrollbars
    ├── types.ts            # TypeScript interfaces for weather telemetry
    ├── components/
    │   ├── Header.tsx                 # Navigation bar & unit toggle
    │   ├── SearchBar.tsx              # Autocomplete city search & GPS
    │   ├── CurrentWeatherCard.tsx     # Hero temperature & metric bento cards
    │   ├── SmartRecommendations.tsx   # Contextual lifestyle advisory cards
    │   ├── HourlyForecast.tsx         # 24-hour horizontal scroll timeline
    │   ├── ForecastGrid.tsx           # 7-day forecast matrix
    │   ├── WeatherChart.tsx           # Recharts temperature & rain trends
    │   └── ErrorMessage.tsx           # Fallback error screen
    ├── services/
    │   └── weatherApi.ts              # Open-Meteo Geocoding & Forecast service
    └── utils/
        └── weatherUtils.ts            # Weather code mapping & temperature conversions
```

---

## 🛡️ License & Credits

- **Data Provider**: Open-Meteo free weather API (No API key required)
- **Icons**: [Lucide React](https://lucide.dev)
- **Charts**: [Recharts](https://recharts.org)
