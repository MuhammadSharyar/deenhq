import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useSeoHead } from '../hooks/useSeoHead';
import { Moon, MapPin, Clock } from 'lucide-react';

export function Dashboard() {
  useSeoHead({
    title: 'DeenHQ - Privacy-First Islamic Utility',
    description: 'Your beautiful, fast, offline-first Islamic companion for prayer times and habits.',
  });

  const { times, nextPrayer, countdown, locationName } = usePrayerTimes();

  const prayers = times ? [
    { name: 'Fajr', time: times.fajr },
    { name: 'Sunrise', time: times.sunrise },
    { name: 'Dhuhr', time: times.dhuhr },
    { name: 'Asr', time: times.asr },
    { name: 'Maghrib', time: times.maghrib },
    { name: 'Isha', time: times.isha },
  ] : [];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <main className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Next Prayer Card */}
        <section className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-slate-500 dark:text-slate-400 font-medium">Next Prayer</h2>
            <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-sm bg-slate-50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4" />
              {locationName}
            </div>
          </div>
          
          <div className="mb-2">
            <div className="text-5xl font-bold capitalize text-slate-900 dark:text-white mb-4">
              {nextPrayer !== 'none' && nextPrayer ? nextPrayer : 'Loading...'}
            </div>
            <div className="flex items-center gap-2 text-primary font-mono text-2xl bg-blue-50 dark:bg-blue-900/20 w-fit px-5 py-2.5 rounded-2xl">
              <Clock className="w-6 h-6" />
              {countdown || '00:00:00'}
            </div>
          </div>
        </section>

        {/* Welcome Card */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-primary rounded-full flex items-center justify-center mb-6">
            <Moon className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold mb-2">Welcome to DeenHQ</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Your privacy-first Islamic companion. All data is stored locally.
          </p>
        </section>

        {/* Daily Schedule */}
        <section className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 mt-2">
          <h2 className="text-lg font-bold mb-6">Today's Schedule</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {prayers.map((prayer) => {
              const isActive = nextPrayer?.toLowerCase() === prayer.name.toLowerCase();
              return (
                <div 
                  key={prayer.name} 
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl transition-colors ${
                    isActive 
                      ? 'bg-primary text-white shadow-md scale-105 transform transition-transform' 
                      : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-sm mb-2 ${isActive ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {prayer.name}
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {prayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
