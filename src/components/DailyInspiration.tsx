import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

interface Hadith {
  id: number;
  english: string;
  arabic: string;
  reference?: any;
}

export function DailyInspiration() {
  const [hadith, setHadith] = useState<Hadith | null>(null);

  useEffect(() => {
    fetch('/data/nawawi.json')
      .then(res => res.json())
      .then(data => {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        
        const index = dayOfYear % data.length;
        setHadith(data[index]);
      })
      .catch(err => console.error('Failed to load Daily Inspiration', err));
  }, []);

  if (!hadith) return null;

  return (
    <section className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-teal-50/50 to-emerald-50/50 dark:from-teal-900/10 dark:to-emerald-900/10 rounded-3xl p-8 shadow-sm border border-teal-100/50 dark:border-teal-800/30 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity transform group-hover:scale-110 duration-500 pointer-events-none">
        <Quote className="w-32 h-32 text-primary" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6 flex items-center gap-2">
          Hadith of the Day
        </h2>
        
        <p className="text-lg md:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-6 line-clamp-3">
          "{hadith.english.replace(/<\/?[^>]+(>|$)/g, "")}"
        </p>
        
        <div className="text-right text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-6 line-clamp-2" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
          {hadith.arabic}
        </div>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          — An-Nawawi's 40 Hadith (Hadith {hadith.id})
        </p>
      </div>
    </section>
  );
}
