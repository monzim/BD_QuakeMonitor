
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { EarthquakeFeature } from '../types';

interface VisualizerProps {
  quakes: EarthquakeFeature[];
}

export const Visualizer: React.FC<VisualizerProps> = ({ quakes }) => {
  // Process data for chart: sort by time ascending, take last 20
  const data = [...quakes]
    .sort((a, b) => a.properties.time - b.properties.time)
    .slice(-20)
    .map(q => ({
      name: new Date(q.properties.time).toLocaleDateString(undefined, {day: 'numeric', month: 'short'}),
      mag: q.properties.mag,
      place: q.properties.place,
      time: new Date(q.properties.time).toLocaleTimeString(),
    }));

  const getColor = (mag: number) => {
    if (mag >= 5) return '#ef4444';
    if (mag >= 4) return '#f97316';
    if (mag >= 3) return '#fbbf24';
    return '#10b981';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-800 dark:text-slate-200 font-bold text-sm">{label}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{payload[0].payload.time}</p>
          <p className="text-slate-900 dark:text-white font-mono text-sm">
            Mag: <span style={{ color: payload[0].payload.fill }}>{payload[0].value}</span>
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-[150px] truncate">
            {payload[0].payload.place}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm dark:shadow-none transition-colors">
      <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Magnitude Trend</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 10 }} 
            axisLine={false}
            tickLine={false}
            interval={4} 
          />
          <YAxis 
            hide 
            domain={[0, 8]}
          />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} 
            wrapperStyle={{ outline: 'none' }}
          />
          <Bar dataKey="mag" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.mag)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
