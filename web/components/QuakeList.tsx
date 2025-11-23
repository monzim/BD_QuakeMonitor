
import React from 'react';
import { EarthquakeFeature } from '../types';
import { MapPin, Clock, ArrowUpRight, Ruler } from 'lucide-react';

interface QuakeListProps {
  quakes: EarthquakeFeature[];
  className?: string;
}

export const QuakeList: React.FC<QuakeListProps> = ({ quakes, className = "" }) => {
  if (quakes.length === 0) {
    return (
      <div className={`flex items-center justify-center h-full text-slate-500 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 border-dashed ${className}`}>
        <p>No recent activity</p>
      </div>
    );
  }

  const getMagColor = (mag: number) => {
    if (mag >= 6) return "bg-monitor-red text-white shadow-md shadow-monitor-red/30";
    if (mag >= 5) return "bg-monitor-orange text-white shadow-md shadow-monitor-orange/30";
    if (mag >= 4) return "bg-monitor-yellow text-slate-900 shadow-md shadow-monitor-yellow/30";
    return "bg-monitor-green text-slate-900";
  };

  const formatTime = (time: number) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  const formatDate = (time: number) => {
    const date = new Date(time);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`space-y-2 overflow-y-auto custom-scrollbar ${className}`}>
      {quakes.map((quake) => (
        <div 
          key={quake.id} 
          className="bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800 rounded-lg p-3 flex items-start gap-3 group relative overflow-hidden shadow-sm dark:shadow-none"
        >
          {/* Magnitude Indicator */}
          <div className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${getMagColor(quake.properties.mag)}`}>
            {quake.properties.mag.toFixed(1)}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
              <h3 className="text-slate-700 dark:text-slate-200 font-medium text-xs leading-tight truncate pr-2" title={quake.properties.place}>
                {quake.properties.place.replace("Earthquake", "").trim()}
              </h3>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">{formatDate(quake.properties.time)}</span>
            </div>
            
            <div className="flex items-center gap-3 mt-1.5">
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>{formatTime(quake.properties.time)}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Ruler className="w-3 h-3" />
                <span>{quake.geometry.coordinates[2].toFixed(0)}km</span>
              </div>
            </div>
          </div>

          {/* Hover Link */}
          <a 
            href={quake.properties.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-blue-500 dark:text-slate-600 dark:hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      ))}
    </div>
  );
};
