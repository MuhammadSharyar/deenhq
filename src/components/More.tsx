import { Link } from 'react-router-dom';
import { useSeoHead } from '../hooks/useSeoHead';
import { Quote, Sparkles, ScrollText, Calculator, Settings, Info, HelpCircle } from 'lucide-react';

export function More() {
  useSeoHead({
    title: 'More Features | DeenHQ',
    description: 'Access all DeenHQ features including Qibla, Duas, Hadith, Zakat, and Settings.',
  });

  const menuItems = [
    { to: '/duas', icon: Quote, label: 'Hisnul Muslim', desc: 'Daily prayers and supplications' },
    { to: '/names', icon: Sparkles, label: '99 Names', desc: 'Asma ul Husna with meanings' },
    { to: '/hadith', icon: ScrollText, label: '40 Hadith', desc: 'Nawawi collection' },
    { to: '/zakat', icon: Calculator, label: 'Zakat Calculator', desc: 'Calculate your obligations' },
  ];

  const appItems = [
    { to: '/settings', icon: Settings, label: 'Settings', desc: 'Location and calculation methods' },
    { to: '/about', icon: Info, label: 'About DeenHQ', desc: 'Privacy-first Islamic app' },
    { to: '/faq', icon: HelpCircle, label: 'FAQ', desc: 'Frequently asked questions' },
  ];

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">More Features</h1>
        <p className="text-slate-500 dark:text-slate-400">Explore all tools and utilities.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2">Islamic Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {menuItems.map(item => (
            <Link key={item.to} to={item.to} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all group">
              <div className="w-12 h-12 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{item.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2">App & Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {appItems.map(item => (
            <Link key={item.to} to={item.to} className="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:border-slate-300 transition-all group">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl group-hover:bg-slate-200 dark:group-hover:bg-slate-700 transition-colors">
                <item.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{item.label}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
