import { USGSGeoJSONResponse } from '../types.js';
import { redis } from '../redis.js';

const BASE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";
const CACHE_KEY = 'bd_quake_data_cache';
const CACHE_DURATION = 60; // 60 seconds

export const fetchBangladeshEarthquakes = async (): Promise<USGSGeoJSONResponse> => {
    // 1. Check Cache
    if (redis) {
        try {
            const cached = await redis.get(CACHE_KEY);
            if (cached) {
                console.log("Serving USGS data from Redis cache");
                return JSON.parse(cached) as USGSGeoJSONResponse;
            }
        } catch (err) {
            console.error("Redis get error:", err);
        }
    }

    // 2. Fetch fresh data
    const params = new URLSearchParams({
        format: 'geojson',
        minlatitude: '20',
        maxlatitude: '27',
        minlongitude: '88',
        maxlongitude: '93',
        orderby: 'time',
        limit: '50',
        minmagnitude: '2.5'
    });

    try {
        const response = await fetch(`${BASE_URL}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`USGS API Error: ${response.statusText}`);
        }
        const data = await response.json() as USGSGeoJSONResponse;

        // 3. Save to Cache
        if (redis) {
            try {
                await redis.set(CACHE_KEY, JSON.stringify(data), 'EX', CACHE_DURATION);
            } catch (err) {
                console.error("Redis set error:", err);
            }
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch earthquake data:", error);
        throw error;
    }
};
