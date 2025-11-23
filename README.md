# BD Quake Monitor

BD Quake Monitor is a comprehensive earthquake monitoring application focused on Bangladesh. It provides real-time earthquake data, AI-powered analysis, and alert subscriptions.

## Features

-   **Real-time Monitoring**: Fetches latest earthquake data from USGS.
-   **AI Analysis**: Uses Google Gemini AI to analyze earthquake data and assess risks for Bangladesh.
-   **Interactive Map**: Visualizes earthquake locations on an interactive map.
-   **Alert System**: Allows users to subscribe to alerts via SMS, Email, or Discord.
-   **Dockerized**: Easy deployment with Docker.

## Tech Stack

-   **Backend**: Hono.js, Node.js, TypeScript, Prisma, PostgreSQL, Redis.
-   **Frontend**: React, Vite, TypeScript, Leaflet, Recharts, TailwindCSS.
-   **AI**: Google Gemini API.
-   **Infrastructure**: Docker.

## Prerequisites

-   Node.js (v20+)
-   Docker & Docker Compose (optional, for containerized run)
-   PostgreSQL
-   Redis

## Getting Started

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/BD_QuakeMonitor.git
    cd BD_QuakeMonitor
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    cp .env.example .env # Configure your env vars
    npx prisma generate
    npm run dev
    ```

3.  **Frontend Setup:**
    ```bash
    cd web
    npm install
    cp .env.example .env.local # Configure your env vars
    npm run dev
    ```

### Running with Docker

You can run the application using Docker.

1.  **Build and Run Backend:**
    ```bash
    docker build -t quake-backend ./backend
    docker run -p 3000:3000 --env-file ./backend/.env quake-backend
    ```

2.  **Build and Run Web App:**
    ```bash
    docker build -t quake-web ./web
    docker run -p 8080:80 quake-web
    ```

## Environment Variables

### Backend (.env)
-   `DATABASE_URL`: PostgreSQL connection string.
-   `REDIS_URL`: Redis connection string.
-   `GEMINI_API_KEY`: Google Gemini API key.

### Web (.env.local)
-   `VITE_BACKEND_URL`: URL of the backend API (e.g., `http://localhost:3000`).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
