# BD Quake Monitor - Web Application

A real-time earthquake monitoring dashboard for Bangladesh, featuring interactive maps, AI-powered analysis, and customizable alert notifications.

## Features

- 🗺️ **Interactive Map**: Real-time visualization of earthquakes in and around Bangladesh using Leaflet
- 📊 **Data Visualization**: Charts and statistics powered by Recharts
- 🤖 **AI Analysis**: Earthquake risk analysis powered by Google's Gemini AI (via backend)
- 🔔 **Alert System**: Customizable notifications via SMS, Email, and Discord webhooks
- 🌓 **Dark Mode**: Beautiful dark/light theme support
- ⚡ **Real-time Updates**: Live earthquake data from USGS

## Prerequisites

- **Node.js** (v16 or higher)
- **Backend Server**: The Hono.js backend must be running (see `../backend/README.md`)

## Environment Setup

Create a `.env.local` file in the web directory with the following variables:

```env
BACKEND_URL=http://localhost:3000
```

> **Note**: The `BACKEND_URL` should point to your running backend server. If deploying to production, update this to your production backend URL.

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables (see above)

3. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
web/
├── components/          # React components
│   ├── AlertSystem.tsx  # Alert configuration UI
│   ├── Map.tsx         # Leaflet map component
│   └── ...
├── services/           # API service layers
│   ├── geminiService.ts   # AI analysis API calls
│   └── usgsService.ts     # Earthquake data API calls
├── App.tsx            # Main application component
├── types.ts           # TypeScript type definitions
└── vite.config.ts     # Vite configuration
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Leaflet** - Interactive maps
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Tailwind CSS** - Styling (via CDN)

## API Integration

The web app communicates with the backend server for:

- **Earthquake Data**: Fetches earthquake data from USGS (cached via backend)
- **AI Analysis**: Gets risk analysis from Gemini AI (via backend)
- **Alert Preferences**: Saves user notification preferences to PostgreSQL

All API calls use the `BACKEND_URL` environment variable for flexibility across different deployment environments.

## Development Notes

- The app uses Vite's environment variable system (`process.env.*`)
- All backend URLs are configurable via `.env.local`
- The app includes fallback values for development (`http://localhost:3000`)

## License

MIT
