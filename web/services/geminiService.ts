import { EarthquakeFeature, AnalysisResult } from '../types';

const BACKEND_URL = `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/analyze`;

export const analyzeEarthquakeData = async (quakes: EarthquakeFeature[]): Promise<AnalysisResult> => {
  if (quakes.length === 0) {
    return {
      summary: "No significant seismic activity detected in the region recently.",
      riskLevel: 'Low',
      advice: "Standard preparedness applies.",
      hotspots: ["None"],
      depthTrend: "No recent data to analyze.",
      seasonalContext: "Activity is below average."
    };
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ quakes })
    });

    if (!response.ok) {
      throw new Error(`Backend API Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result as AnalysisResult;
  } catch (error) {
    console.error("Backend analysis failed:", error);

    return {
      summary: "AI Analysis currently unavailable (Backend Error).",
      riskLevel: 'Low',
      advice: "Stay alert and follow local guidelines.",
      hotspots: [],
      depthTrend: "Unavailable",
      seasonalContext: "Unavailable"
    };
  }
};
