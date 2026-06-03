import React, { useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useSeoHead } from '../hooks/useSeoHead';
import { Search, MapPin, Loader2, AlertTriangle, Info, HelpCircle, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { schedulePrayerNotifications } from '../utils/scheduleNotifications';

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
}

export function Settings() {
  useSeoHead({
    title: 'Settings | DeenHQ',
    description: 'Configure your prayer calculation methods and location preferences.',
  });

  const { madhab, updateMadhab, method, updateMethod, setLocation, triggerAutoLocation, clearAllData } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [notificationsEnabled, setNotificationsEnabled] = useState(
    ('Notification' in window) && Notification.permission === 'granted' && localStorage.getItem('deenhq_notifications') === 'true'
  );

  const toggleNotifications = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    if (!notificationsEnabled) {
      if (Notification.permission === 'default' || Notification.permission === 'denied') {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setNotificationsEnabled(true);
          localStorage.setItem('deenhq_notifications', 'true');
          schedulePrayerNotifications();
          new Notification('DeenHQ', { body: 'Notifications enabled successfully!' });
        } else {
          alert('Notification permission denied by your browser.');
        }
      } else if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
        localStorage.setItem('deenhq_notifications', 'true');
        schedulePrayerNotifications();
      }
    } else {
      setNotificationsEnabled(false);
      localStorage.setItem('deenhq_notifications', 'false');
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search failed', error);
      alert('Failed to search location. Please check your internet connection.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (result: NominatimResult) => {
    // simplify display name (take first two parts for clean UI)
    const nameParts = result.display_name.split(', ');
    const shortName = nameParts.slice(0, 2).join(', ');
    setLocation(parseFloat(result.lat), parseFloat(result.lon), shortName);
    setSearchResults([]);
    setSearchQuery('');
    alert(`Location set to ${shortName}`);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure your location and calculation preferences.</p>
      </header>

      <div className="grid gap-8">
        {/* Location Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6">Location Settings</h2>

          <button
            onClick={triggerAutoLocation}
            className="flex items-center justify-center gap-2 w-full py-3 bg-teal-50 text-primary dark:bg-teal-900/20 dark:text-teal-400 rounded-xl font-medium hover:bg-teal-100 dark:hover:bg-teal-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <MapPin className="w-5 h-5" />
            Use Automatic Location
          </button>

          {/* <div className="relative flex items-center gap-4 my-6">
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
            <span className="text-sm text-slate-400 font-medium uppercase tracking-wider">or search manually</span>
            <div className="flex-1 border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <form onSubmit={handleSearch} className="relative mb-4">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. London, UK"
              className="w-full pl-4 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
            />
            <button 
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-primary text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-slate-900"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </button>
          </form>

          {searchResults.length > 0 && (
            <ul className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-700 border border-slate-200 dark:border-slate-700">
              {searchResults.map(result => (
                <li key={result.place_id}>
                  <button 
                    onClick={() => handleSelectLocation(result)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:bg-slate-200 dark:focus:bg-slate-700"
                  >
                    {result.display_name}
                  </button>
                </li>
              ))}
            </ul>
          )} */}
        </section>

        {/* Calculation Settings */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6">Calculation Methods</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Prayer Time Convention
              </label>
              <div className="relative">
                <select
                  value={method}
                  onChange={(e) => updateMethod(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="MuslimWorldLeague">Muslim World League (MWL)</option>
                  <option value="ISNA">Islamic Society of North America (ISNA)</option>
                  <option value="Egyptian">Egyptian General Authority</option>
                  <option value="UmmAlQura">Umm Al-Qura, Makkah</option>
                  <option value="Karachi">University of Islamic Sciences, Karachi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Asr Calculation (Madhab)
              </label>
              <div className="relative">
                <select
                  value={madhab}
                  onChange={(e) => updateMadhab(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 dark:text-white appearance-none cursor-pointer"
                >
                  <option value="Standard">Standard (Shafi, Maliki, Hanbali)</option>
                  <option value="Hanafi">Hanafi</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Prayer Notifications
          </h2>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div>
              <h3 className="font-medium text-slate-900 dark:text-white">Enable Adhan Alerts</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get notified when it's time to pray (browser must be open).</p>
            </div>

            <button
              onClick={toggleNotifications}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </section>

        {/* Info & Support */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-6">Information & Support</h2>
          <div className="space-y-3">
            <Link to="/about" className="flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">About DeenHQ</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link to="/faq" className="flex items-center justify-between w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-slate-500" />
                <span className="font-medium text-slate-700 dark:text-slate-300">Frequently Asked Questions</span>
              </div>
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-red-100 dark:border-red-900/30">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Danger Zone</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            This will permanently delete all your local habits, tasbih counts, Quran bookmarks, and location settings.
          </p>

          <button
            onClick={clearAllData}
            className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-xl font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <AlertTriangle className="w-5 h-5" />
            Clear All Data
          </button>
        </section>
      </div>
    </div>
  );
}
