import { GoogleGenAI, Type } from "@google/genai";
import { EarthquakeFeature, AnalysisResult } from '../types.js';
import { redis } from '../redis.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const CACHE_KEY = 'bd_quake_analysis_cache';

export const analyzeEarthquakeData = async (quakes: EarthquakeFeature[]): Promise<AnalysisResult> => {
    if (!apiKey) {
        return {
            summary: "API Key not configured. Cannot generate AI analysis.",
            riskLevel: 'Low',
            advice: "Please monitor official local news channels.",
            hotspots: [],
            depthTrend: "N/A",
            seasonalContext: "N/A"
        };
    }

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

    const latestQuake = quakes[0];
    // Create a signature based on ID and Updated time. 
    // If the USGS updates the details of the event, 'updated' will change.
    const currentSignature = `${latestQuake.id}-${latestQuake.properties.updated}`;

    // Check Cache
    if (redis) {
        try {
            const cached = await redis.get(CACHE_KEY);
            if (cached) {
                const { signature, analysis } = JSON.parse(cached);
                // Compare signatures instead of just IDs
                if (signature === currentSignature) {
                    console.log("Serving Gemini Analysis from Redis Cache");
                    return analysis as AnalysisResult;
                }
            }
        } catch (err) {
            console.error("Redis get error:", err);
        }
    }

    console.log("New earthquake data or update detected. Calling Gemini API...");

    const simplifiedData = quakes.slice(0, 15).map(q => ({
        mag: q.properties.mag,
        place: q.properties.place,
        time: new Date(q.properties.time).toISOString(),
        depth: q.geometry.coordinates[2]
    }));

    const prompt = `
    Analyze the following recent earthquake data for Bangladesh and surrounding regions (India, Myanmar border).
    Data: ${JSON.stringify(simplifiedData)}
    
    Provide a comprehensive situation report for a public dashboard.
    1. Determine the overall risk level.
    2. Identify specific regions/cities that are 'hotspots' based on this data.
    3. Analyze the depth of the quakes (Shallow < 70km vs Deep) and what it implies.
    4. Provide historical/seasonal context if possible (is this normal frequency?).
    5. One sentence of actionable advice.
  `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING, description: "2-3 sentence summary of recent activity." },
                        riskLevel: { type: Type.STRING, enum: ['Low', 'Moderate', 'High', 'Critical'] },
                        advice: { type: Type.STRING, description: "One concise sentence of safety advice." },
                        hotspots: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "List of 1-3 specific regions or cities most affected recently."
                        },
                        depthTrend: { type: Type.STRING, description: "Analysis of depth patterns (e.g., 'Mostly shallow events implying felt tremors')." },
                        seasonalContext: { type: Type.STRING, description: "Context regarding frequency compared to typical norms." }
                    },
                    required: ['summary', 'riskLevel', 'advice', 'hotspots', 'depthTrend', 'seasonalContext']
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from Gemini");

        const result = JSON.parse(text) as AnalysisResult;

        // Cache Result with Signature and TTL (1 hour)
        if (redis) {
            try {
                await redis.set(CACHE_KEY, JSON.stringify({
                    signature: currentSignature,
                    analysis: result
                }), 'EX', 3600);
            } catch (err) {
                console.error("Redis set error:", err);
            }
        }

        return result;
    } catch (error) {
        console.error("Gemini analysis failed:", error);

        // Fallback to cache if API fails
        if (redis) {
            try {
                const cached = await redis.get(CACHE_KEY);
                if (cached) {
                    return JSON.parse(cached).analysis;
                }
            } catch (err) {
                console.error("Redis fallback error:", err);
            }
        }

        return {
            summary: "AI Analysis currently unavailable.",
            riskLevel: 'Low',
            advice: "Stay alert and follow local guidelines.",
            hotspots: [],
            depthTrend: "Unavailable",
            seasonalContext: "Unavailable"
        };
    }
};
