
import React from 'react';
import { Activity, Sun, Moon, Bell } from 'lucide-react';

interface HeaderProps {
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
  onOpenAlerts: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  lastUpdated, 
  refreshing, 
  onRefresh, 
  darkMode, 
  toggleTheme,
  onOpenAlerts
}) => {
  return (
    <header className="sticky top-0 z-[2000] bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Logo Area */}
        <div className="flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg border border-red-200 dark:border-red-500/30 transition-colors">
            <Activity className="w-6 h-6 text-red-600 dark:text-red-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors">
              BD Quake<span className="text-red-600 dark:text-red-500">Monitor</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest font-semibold hidden sm:block">
              Live Surveillance
            </p>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex items-center gap-4">
            {/* Status Pill */}
            <div className="hidden md:flex flex-col items-end mr-2">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${refreshing ? 'bg-blue-400' : 'bg-green-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${refreshing ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                    </span>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-300">
                    {refreshing ? 'SYNCING...' : 'OPERATIONAL'}
                    </span>
                </div>
                <button 
                    onClick={onRefresh}
                    disabled={refreshing}
                    className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                    Updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : '--:--:--'}
                </button>
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>

            {/* Alert Button */}
            <button
                onClick={onOpenAlerts}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative group"
                title="Configure Alerts"
            >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-monitor-orange rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>

            {/* Theme Toggle */}
            <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </header>
  );
};
