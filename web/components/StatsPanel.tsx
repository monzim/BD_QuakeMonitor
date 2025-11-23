
import React from 'react';
import { TrendingUp, Layers, AlertTriangle } from 'lucide-react';
import { EarthquakeFeature } from '../types';

interface StatsPanelProps {
  quakes: EarthquakeFeature[];
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ quakes }) => {
  const total = quakes.length;
  const maxMag = quakes.length > 0 ? Math.max(...quakes.map(q => q.properties.mag)) : 0;
  
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentSignificant = quakes.filter(q => q.properties.time > oneDayAgo && q.properties.mag >= 4.0).length;

  const getMagColor = (mag: number) => {
    if (mag >= 6) return "text-monitor-red";
    if (mag >= 5) return "text-monitor-orange";
    if (mag >= 4) return "text-monitor-yellow";
    return "text-monitor-green";
  };

  const cardClass = "bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-sm dark:shadow-none transition-colors";
  const labelClass = "flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-1 text-xs font-bold uppercase tracking-wider";
  const valueClass = "text-2xl md:text-3xl font-mono font-bold text-slate-800 dark:text-white";
  const subClass = "text-[10px] text-slate-400 dark:text-slate-500";

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <div className={cardClass}>
        <div className={labelClass}>
          <Layers className="w-4 h-4" />
          <span>Events</span>
        </div>
        <span className={valueClass}>{total}</span>
        <span className={subClass}>Last 30 days</span>
      </div>

      <div className={cardClass}>
        <div className={labelClass}>
          <TrendingUp className="w-4 h-4" />
          <span>Max Mag</span>
        </div>
        <span className={`text-2xl md:text-3xl font-mono font-bold ${getMagColor(maxMag)}`}>
          {maxMag.toFixed(1)}
        </span>
        <span className={subClass}>Highest Recorded</span>
      </div>

      <div className={cardClass}>
        <div className={labelClass}>
          <AlertTriangle className="w-4 h-4" />
          <span>Alerts</span>
        </div>
        <span className={`text-2xl md:text-3xl font-mono font-bold ${recentSignificant > 0 ? 'text-monitor-orange' : 'text-slate-300 dark:text-slate-500'}`}>
          {recentSignificant}
        </span>
        <span className={subClass}>High Impact (24h)</span>
      </div>
    </div>
  );
};
