import { USGSGeoJSONResponse } from '../types';

const BACKEND_URL = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/earthquakes`;

export const fetchBangladeshEarthquakes = async (): Promise<USGSGeoJSONResponse> => {
  try {
    const response = await fetch(BACKEND_URL);
    if (!response.ok) {
      throw new Error(`Backend API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch earthquake data from backend:", error);
    throw error;
  }
};
