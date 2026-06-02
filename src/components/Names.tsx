import { useSeoHead } from '../hooks/useSeoHead';
import { useNames } from '../hooks/useNames';
import { Loader2 } from 'lucide-react';

export function Names() {
  useSeoHead({
    title: '99 Names of Allah | DeenHQ',
    description: 'Explore the 99 Names of Allah (Asma ul Husna) with their meanings and transliterations.',
  });

  const { names, loading } = useNames();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto space-y-8 pb-32">
      <header className="text-center space-y-4 max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          Asma ul Husna
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          The 99 Beautiful Names of Allah
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {names.map(name => (
          <article 
            key={name.id} 
            className="group bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md hover:border-primary/30 transition-all duration-300 flex flex-col items-center text-center space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-5 left-5 text-sm font-bold text-slate-200 dark:text-slate-800">
              {name.id.toString().padStart(2, '0')}
            </div>
            
            <p className="text-4xl md:text-5xl font-['Amiri_Quran'] text-primary pt-4 group-hover:scale-110 transition-transform duration-500" dir="rtl">
              {name.arabic}
            </p>
            
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {name.transliteration}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                {name.meaning}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
