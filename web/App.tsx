import React, { useEffect, useState, useCallback } from 'react';
import { fetchBangladeshEarthquakes } from './services/usgsService';
import { analyzeEarthquakeData } from './services/geminiService';
import { EarthquakeFeature, AnalysisResult } from './types';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import { QuakeList } from './components/QuakeList';
import { GeminiInsight } from './components/GeminiInsight';
import { Visualizer } from './components/Visualizer';
import { Map } from './components/Map';
import { AlertSystem } from './components/AlertSystem';
import { LatestQuakeBanner } from './components/LatestQuakeBanner';
import { Footer } from './components/Footer';
import { List } from 'lucide-react';

const App: React.FC = () => {
  const [quakes, setQuakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState<boolean>(false);

  // UI State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // Default to dark
  });
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // Apply theme class to HTML element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchData = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await fetchBangladeshEarthquakes();
      setQuakes(data.features);
      setLastUpdated(new Date());

      // Trigger AI analysis if we have data
      setAnalysisLoading(true);
      analyzeEarthquakeData(data.features)
        .then(res => setAnalysis(res))
        .finally(() => setAnalysisLoading(false));

    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();

    // Poll every 60 seconds
    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200`}>
      <Header
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={fetchData}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
        onOpenAlerts={() => setIsAlertOpen(true)}
      />

      {/* Live Banner for Latest Earthquake */}
      <LatestQuakeBanner latestQuake={quakes.length > 0 ? quakes[0] : undefined} />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Top Section: Key Stats */}
        <StatsPanel quakes={quakes} />

        {/* Main Interactive Section: Map & Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-auto lg:h-[500px]">

          {/* Map - Takes 2/3 on Desktop */}
          <div className="lg:col-span-2 h-[400px] lg:h-full rounded-xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <Map quakes={quakes} isDarkMode={darkMode} />
          </div>

          {/* Recent Feed - Takes 1/3 on Desktop */}
          <div className="lg:col-span-1 flex flex-col h-[400px] lg:h-full">
            <div className="flex items-center gap-2 mb-3 px-1">
              <List className="w-4 h-4 text-monitor-green" />
              <h2 className="text-sm font-bold text-slate-700 dark:text-white uppercase tracking-wider">Live Feed</h2>
              <span className="ml-auto text-[10px] bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 shadow-sm">
                Latest {quakes.length}
              </span>
            </div>

            <div className="flex-1 min-h-0 bg-white/50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-800 p-3 backdrop-blur-sm shadow-sm">
              {loading ? (
                <div className="space-y-3 mt-2">
                  {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800/50 rounded-lg animate-pulse"></div>)}
                </div>
              ) : (
                <QuakeList quakes={quakes} className="h-full pr-1" />
              )}
            </div>
          </div>
        </div>

        {/* Middle Section: Advanced AI Analytics */}
        <div className="mb-8">
          <GeminiInsight analysis={analysis} loading={analysisLoading} />
        </div>

        {/* Bottom Section: Charts & Monitoring Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Visualizer quakes={quakes} />
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 h-full flex flex-col justify-center shadow-lg dark:shadow-none">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">System Parameters</h4>
              <ul className="text-xs text-slate-600 dark:text-slate-500 space-y-3 font-mono">
                <li className="flex justify-between items-center">
                  <span>Target Region</span>
                  <span className="text-slate-800 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Bangladesh</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Boundaries</span>
                  <span className="text-slate-500 dark:text-slate-400">20-27N, 88-93E</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Min Magnitude</span>
                  <span className="text-monitor-orange dark:text-monitor-yellow font-bold">2.5+</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Data Source</span>
                  <span className="text-blue-600 dark:text-blue-400">USGS FDSN Event API</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>AI Model</span>
                  <span className="text-purple-600 dark:text-purple-400">Gemini 2.5 Flash</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Update Rate</span>
                  <span className="text-green-600 dark:text-green-400">60s Poll (Cached)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Alert System Modal */}
      <AlertSystem isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} />

      <Footer />
    </div>
  );
};

export default App;