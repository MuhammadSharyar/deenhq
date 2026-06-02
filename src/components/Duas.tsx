import { useState } from 'react';
import { useSeoHead } from '../hooks/useSeoHead';
import { useDuas } from '../hooks/useDuas';
import { Search, Loader2 } from 'lucide-react';

export function Duas() {
  useSeoHead({
    title: 'Daily Duas | DeenHQ',
    description: 'A curated collection of authentic daily supplications (Hisnul Muslim).',
  });

  const { duas, loading } = useDuas();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(duas.map(d => d.category)));

  const filteredDuas = duas.filter(dua => {
    const matchesSearch = 
      dua.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dua.translation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory ? dua.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Hisnul Muslim
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Authentic supplications for daily life.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by title or translation..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
            selectedCategory === null 
              ? 'bg-primary text-white' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              selectedCategory === category 
                ? 'bg-primary text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            No duas found matching your search.
          </div>
        ) : (
          filteredDuas.map(dua => (
            <article key={dua.id} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs font-bold text-primary tracking-wider uppercase mb-2 block">
                    {dua.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {dua.title}
                  </h3>
                </div>
              </div>
              
              <p className="text-3xl md:text-4xl text-right leading-[2.5] font-['Amiri_Quran'] text-slate-900 dark:text-white" dir="rtl">
                {dua.arabic}
              </p>
              
              <div className="space-y-2 pt-6 border-t border-slate-100 dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-300 italic">
                  {dua.transliteration}
                </p>
                <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                  "{dua.translation}"
                </p>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
