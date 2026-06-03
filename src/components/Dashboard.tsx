import { usePrayerTimes } from '../hooks/usePrayerTimes';
import { useSeoHead } from '../hooks/useSeoHead';
import { Moon, MapPin, Clock, CalendarHeart } from 'lucide-react';
import { DailyInspiration } from './DailyInspiration';
import { getUpcomingIslamicEvent } from '../utils/islamicEvents';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

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

  const upcomingEvent = getUpcomingIslamicEvent();

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {/* Next Prayer Card */}
        <motion.section variants={itemVariants} className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800">
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
            <div className="flex items-center gap-2 text-primary font-mono text-2xl bg-teal-50 dark:bg-teal-900/20 w-fit px-5 py-2.5 rounded-2xl">
              <Clock className="w-6 h-6" />
              {countdown || '00:00:00'}
            </div>
          </div>
        </motion.section>

        {/* Date Card */}
        <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-primary rounded-full flex items-center justify-center mb-6">
            <Moon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">
            {new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {day: 'numeric', month: 'long', year : 'numeric'}).format(new Date())}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {upcomingEvent && (
            <div className="mt-auto pt-6 w-full">
              <div className="flex items-center justify-between bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-teal-100/50 dark:border-teal-800/30">
                <div className="text-left flex items-start gap-3">
                  <div className="bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm">
                    <CalendarHeart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 leading-tight mb-1">{upcomingEvent.event.name}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">{upcomingEvent.event.description}</div>
                  </div>
                </div>
                <div className="text-right pl-4 border-l border-teal-100 dark:border-teal-800/50">
                  <div className="text-xl font-bold text-primary leading-none mb-1">
                    {upcomingEvent.daysUntil === 0 ? 'Today' : upcomingEvent.daysUntil === 1 ? 'Tmrw' : upcomingEvent.daysUntil}
                  </div>
                  {upcomingEvent.daysUntil > 1 && (
                    <div className="text-[10px] uppercase tracking-wider font-bold text-primary/70">Days</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.section>

        <motion.div variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3">
          <DailyInspiration />
        </motion.div>

        {/* Daily Schedule */}
        <motion.section variants={itemVariants} className="col-span-1 md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 mt-2">
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
                  <span className={`text-sm mb-2 ${isActive ? 'text-teal-100' : 'text-slate-500 dark:text-slate-400'}`}>
                    {prayer.name}
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {prayer.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
}
