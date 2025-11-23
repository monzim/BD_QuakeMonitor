import React from 'react';
import { EarthquakeFeature } from '../types';
import { Activity, Clock, MapPin, ArrowRight } from 'lucide-react';

interface LatestQuakeBannerProps {
  latestQuake?: EarthquakeFeature;
}

export const LatestQuakeBanner: React.FC<LatestQuakeBannerProps> = ({ latestQuake }) => {
  if (!latestQuake) return null;

  const { mag, place, time, url } = latestQuake.properties;
  
  // Colors based on magnitude
  const getSeverityColor = (m: number) => {
    if (m >= 6) return 'red';
    if (m >= 5) return 'orange';
    if (m >= 4) return 'amber';
    return 'emerald';
  };
  
  const color = getSeverityColor(mag);
  
  // Tailwind classes map
  const containerClasses: Record<string, string> = {
    red: "bg-red-600 text-white shadow-red-900/20",
    orange: "bg-orange-500 text-white shadow-orange-900/20",
    amber: "bg-amber-500 text-slate-900 shadow-amber-900/20",
    emerald: "bg-monitor-green text-white shadow-emerald-900/20"
  };

  const timeAgo = (timestamp: number) => {
      const seconds = Math.floor((Date.now() - timestamp) / 1000);
      if (seconds < 60) return 'Just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={`${containerClasses[color]} w-full shadow-lg transition-colors duration-500 relative overflow-hidden`}>
       {/* Background Pattern */}
       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
       
       <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          
          {/* Left: Status & Mag */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-start">
             <span className="relative flex h-3 w-3 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
             </span>
             <div className="font-bold uppercase tracking-wider text-xs opacity-90 whitespace-nowrap">
                Latest Update
             </div>
             <div className="h-4 w-px bg-current opacity-30 hidden sm:block"></div>
             <div className="flex items-center gap-2 font-mono font-bold text-lg leading-none">
                <Activity className="w-5 h-5" />
                {mag.toFixed(1)}
             </div>
          </div>

          {/* Center: Location */}
          <div className="flex-1 text-center sm:text-left w-full sm:w-auto min-w-0 px-2">
             <div className="flex items-center justify-center sm:justify-start gap-1.5 text-sm font-bold truncate">
                <MapPin className="w-4 h-4 shrink-0 opacity-80" />
                <span className="truncate">{place}</span>
             </div>
          </div>

          {/* Right: Time & Link */}
          <div className="flex items-center gap-4 text-xs font-medium w-full sm:w-auto justify-between sm:justify-end">
             <div className="flex items-center gap-1.5 opacity-90">
                <Clock className="w-3.5 h-3.5" />
                {timeAgo(time)}
             </div>
             <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:underline decoration-2 underline-offset-2 bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition-all">
                Details <ArrowRight className="w-3 h-3" />
             </a>
          </div>

       </div>
    </div>
  );
};
