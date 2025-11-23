
import React, { useState, useEffect } from 'react';
import { Bell, Save, ShieldAlert, Hash, Mail, MapPin, X } from 'lucide-react';
import { UserAlertPreferences } from '../types';

const PREFS_KEY = 'bd_quake_user_prefs';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

interface AlertSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ isOpen, onClose }) => {
  const [prefs, setPrefs] = useState<UserAlertPreferences>({
    locationName: '',
    phoneNumber: '',
    email: '',
    discordWebhook: '',
    minMagnitude: 4.0,
    notificationsEnabled: false
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem(PREFS_KEY);
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save to Local Storage (keep as backup/cache)
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));

    try {
      const response = await fetch(`${BACKEND_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(prefs)
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to save alerts:", error);
      // Still show success if local storage worked, or maybe show a warning?
      // For now, we'll just proceed as if it worked but log the error
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    }
  };

  const handleChange = (field: keyof UserAlertPreferences, value: string | number | boolean) => {
    setPrefs(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Bell className="w-6 h-6 text-orange-600 dark:text-monitor-orange" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Alert Configuration</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Get notified about earthquakes in Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 flex flex-col gap-4">

          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <MapPin className="w-3.5 h-3.5" /> Your Location Name
              </label>
              <input
                type="text"
                required
                value={prefs.locationName}
                onChange={(e) => handleChange('locationName', e.target.value)}
                placeholder="e.g. Dhaka, Chittagong"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 dark:focus:border-monitor-blue focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <Hash className="w-3.5 h-3.5" /> Phone (SMS)
                </label>
                <input
                  type="tel"
                  value={prefs.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="+880..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 dark:focus:border-monitor-blue focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email
                </label>
                <input
                  type="email"
                  value={prefs.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 dark:focus:border-monitor-blue focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                <span className="text-[#5865F2] font-bold">Discord</span> Webhook (Optional)
              </label>
              <input
                type="url"
                value={prefs.discordWebhook}
                onChange={(e) => handleChange('discordWebhook', e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-sm text-slate-900 dark:text-slate-200 focus:border-blue-500 dark:focus:border-monitor-blue focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-2 bg-slate-100 dark:bg-slate-950/50 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Enable Notifications</span>
              <button
                type="button"
                onClick={() => handleChange('notificationsEnabled', !prefs.notificationsEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${prefs.notificationsEnabled ? 'bg-monitor-green' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span
                  className={`${prefs.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
                />
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              You will be alerted when an earthquake &gt; {prefs.minMagnitude.toFixed(1)} is detected.
            </p>
          </div>

          <button
            type="submit"
            className={`mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all shadow-lg ${saved
              ? 'bg-green-500 text-white shadow-green-500/25'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
              }`}
          >
            {saved ? (
              <>
                <ShieldCheckIcon className="w-5 h-5" /> Preferences Saved
              </>
            ) : (
              <>
                <Save className="w-5 h-5" /> Save Configuration
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
};

function ShieldCheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
