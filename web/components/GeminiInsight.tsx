
import React from 'react';
import { Sparkles, ShieldCheck, ShieldAlert, Map, Activity, History } from 'lucide-react';
import { AnalysisResult } from '../types';

interface GeminiInsightProps {
  analysis: AnalysisResult | null;
  loading: boolean;
}

export const GeminiInsight: React.FC<GeminiInsightProps> = ({ analysis, loading }) => {
  if (loading && !analysis) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-6 animate-pulse shadow-sm">
        <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-6"></div>
        <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-20 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const isHighRisk = analysis.riskLevel === 'High' || analysis.riskLevel === 'Critical';

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl p-0 shadow-lg dark:shadow-2xl overflow-hidden transition-colors">
      {/* Header Section */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-900">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            <h2 className="text-base font-bold text-slate-800 dark:text-white tracking-wide">AI Situation Report</h2>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full border ${
            isHighRisk 
              ? 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/30' 
              : 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/30'
          } font-mono font-bold tracking-wider shadow-sm`}>
            {analysis.riskLevel.toUpperCase()} RISK
          </span>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
        {/* Hotspots */}
        <div className="p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                <Map className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                Active Regions
            </div>
            {analysis.hotspots.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {analysis.hotspots.map((spot, i) => (
                        <span key={i} className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-200 px-2 py-1 rounded border border-blue-200 dark:border-blue-500/20">
                            {spot}
                        </span>
                    ))}
                </div>
            ) : (
                <span className="text-xs text-slate-500">No specific clustering detected.</span>
            )}
        </div>

        {/* Depth Trend */}
        <div className="p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                <Activity className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                Depth Analysis
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {analysis.depthTrend}
            </p>
        </div>

        {/* Context */}
        <div className="p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2">
                <History className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                Context
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {analysis.seasonalContext}
            </p>
        </div>
      </div>

      {/* Footer Advisory */}
      <div className={`p-4 ${
          isHighRisk 
          ? 'bg-red-50 dark:bg-red-950/20' 
          : 'bg-emerald-50 dark:bg-emerald-950/20'
        } border-t border-slate-200 dark:border-slate-800 transition-colors`}>
        <div className="flex items-start gap-3">
          {isHighRisk 
            ? <ShieldAlert className="w-5 h-5 text-red-500 dark:text-red-400 shrink-0" /> 
            : <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
          }
          <div>
            <h3 className={`text-xs font-bold uppercase mb-1 ${isHighRisk ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>Strategic Advice</h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs italic">
              "{analysis.advice}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
