import { useState } from 'react';
import { useSeoHead } from '../hooks/useSeoHead';
import { useHadith } from '../hooks/useHadith';
import { Search, Loader2 } from 'lucide-react';

export function Hadith() {
  useSeoHead({
    title: "Nawawi's 40 Hadith | DeenHQ",
    description: "Read Imam Nawawi's collection of 40 foundational Ahadith, available completely offline.",
  });

  const { hadiths, loading } = useHadith();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHadiths = hadiths.filter(h => 
    h.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.id.toString() === searchQuery
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 pb-32">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Nawawi's 40 Hadith
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          A foundational collection of authentic sayings of the Prophet ﷺ.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search hadiths..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="space-y-6">
        {filteredHadiths.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No hadiths found matching your search.
          </div>
        ) : (
          filteredHadiths.map(hadith => (
            <article key={hadith.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <span className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 text-primary font-bold rounded-xl">
                  {hadith.id}
                </span>
              </div>
              
              <p className="text-2xl md:text-3xl text-right leading-[2.5] font-['Amiri_Quran'] text-slate-900 dark:text-white" dir="rtl">
                {hadith.arabic}
              </p>
              
              <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {hadith.english}
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
