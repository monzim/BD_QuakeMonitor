import React, { useEffect, useRef } from 'react';
import * as L from 'leaflet';
import { EarthquakeFeature } from '../types';

interface MapProps {
  quakes: EarthquakeFeature[];
  isDarkMode: boolean;
}

export const Map: React.FC<MapProps> = ({ quakes, isDarkMode }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.FeatureGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([23.8, 90.4], 6);
      
      mapRef.current = map;

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Create layer group for markers
      layerGroupRef.current = L.featureGroup().addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Handle Theme Changes for Tile Layer
  useEffect(() => {
    if (!mapRef.current) return;

    // Remove existing tile layer if present
    if (tileLayerRef.current) {
      mapRef.current.removeLayer(tileLayerRef.current);
    }

    // Select Tile URL based on mode
    const tileUrl = isDarkMode 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    tileLayerRef.current = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(mapRef.current);

    // Ensure markers stay on top of new tiles
    if (layerGroupRef.current) {
      layerGroupRef.current.bringToFront();
    }

  }, [isDarkMode]);

  // Handle Markers
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    quakes.forEach((quake) => {
      const { coordinates } = quake.geometry;
      const { mag, place, time, url } = quake.properties;
      const [lon, lat] = coordinates;

      let color = '#10b981'; 
      if (mag >= 4) color = '#fbbf24'; 
      if (mag >= 5) color = '#f97316'; 
      if (mag >= 6) color = '#ef4444'; 

      const marker = L.circleMarker([lat, lon], {
        radius: Math.max(mag * 3, 6),
        fillColor: color,
        color: isDarkMode ? '#ffffff' : '#334155', // White border in dark mode, slate in light
        weight: 1,
        opacity: isDarkMode ? 0.8 : 0.6,
        fillOpacity: 0.7
      });

      const dateStr = new Date(time).toLocaleString('en-US', {
        month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
      });

      // Popup styling is handled via CSS in index.html based on .dark class
      const popupContent = `
        <div class="min-w-[200px] font-sans">
          <h3 class="font-bold text-sm border-b pb-1 mb-2 ${isDarkMode ? 'text-white border-slate-700' : 'text-slate-900 border-slate-200'}">${place}</h3>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="${isDarkMode ? 'text-slate-400' : 'text-slate-500'}">Magnitude</div>
            <div class="font-mono font-bold" style="color: ${color}">${mag.toFixed(1)}</div>
            
            <div class="${isDarkMode ? 'text-slate-400' : 'text-slate-500'}">Time</div>
            <div class="${isDarkMode ? 'text-slate-200' : 'text-slate-700'}">${dateStr}</div>
            
            <div class="${isDarkMode ? 'text-slate-400' : 'text-slate-500'}">Depth</div>
            <div class="${isDarkMode ? 'text-slate-200' : 'text-slate-700'}">${coordinates[2]} km</div>
          </div>
          <a href="${url}" target="_blank" class="block mt-3 text-center py-1.5 rounded text-xs font-medium transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-blue-400' : 'bg-slate-100 hover:bg-slate-200 text-blue-600'}">
            View USGS Report
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      layerGroupRef.current?.addLayer(marker);
    });

  }, [quakes, isDarkMode]);

  return (
    <div className="relative w-full h-[400px] md:h-[500px] bg-slate-100 dark:bg-slate-900/50 overflow-hidden transition-colors z-0 group">
      <div className={`absolute top-4 left-4 z-[400] px-3 py-1 rounded-lg text-xs font-bold border pointer-events-none backdrop-blur-md ${isDarkMode ? 'bg-slate-900/80 text-slate-300 border-slate-700' : 'bg-white/80 text-slate-600 border-slate-300'}`}>
        LIVE MAP
      </div>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};