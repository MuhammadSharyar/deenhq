import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Home, BookOpen, CheckCircle, Settings as SettingsIcon, Sun, Moon, Compass, Quote, Sparkles, ScrollText, Calculator, LayoutGrid } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('deenhq_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('deenhq_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('deenhq_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const desktopNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/quran', icon: BookOpen, label: 'Quran' },
    { to: '/tracker', icon: CheckCircle, label: 'Tracker' },
    { to: '/qibla', icon: Compass, label: 'Qibla' },
    { to: '/duas', icon: Quote, label: 'Duas' },
    { to: '/names', icon: Sparkles, label: 'Names' },
    { to: '/hadith', icon: ScrollText, label: 'Hadith' },
    { to: '/zakat', icon: Calculator, label: 'Zakat' },
  ];

  const mobileNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/quran', icon: BookOpen, label: 'Quran' },
    { to: '/tracker', icon: CheckCircle, label: 'Tracker' },
    { to: '/qibla', icon: Compass, label: 'Qibla' },
    { to: '/more', icon: LayoutGrid, label: 'More' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-200 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 h-screen sticky top-0 islamic-pattern">
        <div className="p-6 flex items-center justify-between mb-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-b-xl mx-2 mt-2 shadow-sm">
          <div className="flex items-center gap-3">
            <img src="/favicon.svg" alt="DeenHQ Logo" className="w-8 h-8 drop-shadow-sm" />
            <h1 className="text-2xl font-bold tracking-tight text-primary">DeenHQ</h1>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {desktopNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary text-white font-medium shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <NavLink to="/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
            <SettingsIcon className="w-4 h-4" /> Settings
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>About DeenHQ</NavLink>
          <NavLink to="/faq" className={({ isActive }) => `block px-4 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-primary font-medium' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>FAQ</NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <img src="/favicon.svg" alt="DeenHQ Logo" className="w-7 h-7 drop-shadow-sm" />
            <h1 className="text-xl font-bold tracking-tight text-primary">DeenHQ</h1>
          </div>
          <div className="flex items-center gap-1">
            <NavLink to="/settings" className={({ isActive }) => `p-2 rounded-full transition-colors ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-primary' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <SettingsIcon className="w-5 h-5" />
            </NavLink>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav 
        className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
      >
        <div className="flex items-center justify-around p-2">
          {mobileNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 p-2 min-w-[56px] rounded-xl transition-colors ${
                  isActive
                    ? 'text-primary'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
