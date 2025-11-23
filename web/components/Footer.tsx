import React from 'react';
import { Github, Heart, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
    return (
        <footer className="w-full py-6 mt-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">

                <div className="flex items-center gap-1">
                    <span>Made with</span>
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                    <span>by</span>
                    <a
                        href="https://monzim.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-slate-900 dark:text-slate-200 hover:text-monitor-green transition-colors flex items-center gap-1"
                    >
                        Azraf Al Monzim
                        <ExternalLink className="w-3 h-3" />
                    </a>
                </div>

                <div className="flex items-center gap-6">
                    <a
                        href="https://github.com/monzim/BD_QuakeMonitor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                        <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span>Open Source</span>
                    </a>

                    <span className="text-slate-300 dark:text-slate-700">|</span>

                    <span className="text-xs">
                        &copy; {new Date().getFullYear()} monzim.com
                    </span>
                </div>

            </div>
        </footer>
    );
};
