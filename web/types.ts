
export interface EarthquakeFeature {
  type: "Feature";
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    tz: number | null;
    url: string;
    detail: string;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    status: string;
    tsunami: number;
    sig: number;
    net: string;
    code: string;
    ids: string;
    sources: string;
    types: string;
    nst: number | null;
    dmin: number | null;
    rms: number | null;
    gap: number | null;
    magType: string;
    type: string;
    title: string;
  };
  geometry: {
    type: "Point";
    coordinates: [number, number, number]; // longitude, latitude, depth
  };
  id: string;
}

export interface USGSGeoJSONResponse {
  type: "FeatureCollection";
  metadata: {
    generated: number;
    url: string;
    title: string;
    status: number;
    api: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface AnalysisResult {
  summary: string;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  advice: string;
  hotspots: string[]; // List of affected regions
  depthTrend: string; // Analysis of depth (shallow vs deep)
  seasonalContext: string; // Comparison to typical activity
}

export interface UserAlertPreferences {
  locationName: string;
  phoneNumber?: string;
  email?: string;
  discordWebhook?: string;
  minMagnitude: number;
  notificationsEnabled: boolean;
}
