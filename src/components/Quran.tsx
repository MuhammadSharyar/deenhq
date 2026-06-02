import { useState, useRef, useEffect } from 'react';
import { useQuran } from '../hooks/useQuran';
import { useSeoHead } from '../hooks/useSeoHead';
import { BookmarkCheck, ChevronLeft, Search } from 'lucide-react';

export function Quran() {
  useSeoHead({
    title: 'Quran Reader | DeenHQ',
    description: 'Read the Holy Quran offline with a clean, distraction-free typography.',
  });

  const { surahs, loading, error, bookmark, saveBookmark } = useQuran();
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to bookmark logic
  const ayahRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  
  useEffect(() => {
    if (selectedSurah && bookmark?.surah === selectedSurah) {
      // Small timeout ensures rendering is complete before scrolling
      setTimeout(() => {
        const el = ayahRefs.current[`${selectedSurah}-${bookmark.ayah}`];
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [selectedSurah, bookmark]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
        Loading Quran...
      </div>
    );
  }

  if (error) {
    return <div className="p-12 text-center text-red-500">{error}</div>;
  }

  // Surah Reading View
  if (selectedSurah !== null) {
    const surah = surahs.find(s => s.number === selectedSurah);
    if (!surah) return null;

    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-5xl mx-auto min-h-screen">
        <button 
          onClick={() => setSelectedSurah(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-8 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Surahs
        </button>

        <header className="text-center mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-[Amiri_Quran] text-primary mb-4" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
            {surah.name}
          </h1>
          <h2 className="text-xl text-slate-700 dark:text-slate-300 font-medium">
            {surah.englishName}
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            {surah.englishNameTranslation} • {surah.revelationType} • {surah.ayahs.length} Ayahs
          </p>
        </header>

        {/* Bismillah for all surahs except Tawbah (9) and Fatiha (where it's verse 1) */}
        {surah.number !== 1 && surah.number !== 9 && (
          <div className="text-center text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 mt-8" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        )}

        <article 
          className="text-right leading-[3.5] md:leading-[4] text-2xl md:text-[2rem] text-slate-900 dark:text-slate-100" 
          style={{ fontFamily: '"Amiri Quran", serif' }}
          dir="rtl"
        >
          {surah.ayahs.map(ayah => {
            const isBookmarked = bookmark?.surah === surah.number && bookmark?.ayah === ayah.numberInSurah;
            let text = ayah.text;
            
            // Remove Bismillah from beginning of text if the API bundled it, except for Al Fatiha
            if (surah.number !== 1 && ayah.numberInSurah === 1 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
              text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
            }

            return (
              <span 
                key={ayah.numberInSurah}
                ref={(el) => { ayahRefs.current[`${surah.number}-${ayah.numberInSurah}`] = el; }}
                className={`inline relative group select-none transition-colors duration-300 ${isBookmarked ? 'bg-blue-50 dark:bg-blue-900/30 shadow-[0_0_10px_rgba(0,112,242,0.1)] rounded-md px-1' : ''}`}
              >
                <span 
                  className="cursor-pointer hover:text-primary transition-colors inline-block" 
                  onClick={() => saveBookmark(surah.number, ayah.numberInSurah)}
                >
                  {text}
                </span>
                <span 
                  className="inline-flex items-center justify-center w-9 h-9 md:w-11 md:h-11 text-sm md:text-base mx-2 md:mx-3 bg-slate-50 dark:bg-slate-800/80 text-slate-500 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors" 
                  onClick={() => saveBookmark(surah.number, ayah.numberInSurah)}
                >
                  {ayah.numberInSurah}
                </span>
              </span>
            );
          })}
        </article>
      </div>
    );
  }

  // Surah List View
  const filteredSurahs = surahs.filter(s => 
    s.englishName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.number.toString() === searchQuery
  );

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Quran Reader</h1>
          <p className="text-slate-500 dark:text-slate-400">Read offline, typography focused.</p>
        </div>
        
        {bookmark && (
          <button 
            onClick={() => setSelectedSurah(bookmark.surah)}
            className="flex items-center gap-3 bg-primary/10 text-primary px-5 py-3 rounded-2xl hover:bg-primary/20 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <BookmarkCheck className="w-6 h-6" />
            <div className="text-sm font-medium text-left leading-tight">
              <div className="text-xs opacity-80 uppercase tracking-wider mb-0.5">Resume reading</div>
              Surah {bookmark.surah}, Ayah {bookmark.ayah}
            </div>
          </button>
        )}
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search by Surah name or number..."
          className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 shadow-sm"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSurahs.map(surah => (
          <button
            key={surah.number}
            onClick={() => setSelectedSurah(surah.number)}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all text-left group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 font-medium group-hover:bg-primary group-hover:text-white transition-colors">
                {surah.number}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">{surah.englishName}</h3>
                <p className="text-xs text-slate-500 truncate max-w-[120px]">{surah.englishNameTranslation}</p>
              </div>
            </div>
            <div className="text-2xl text-primary text-right" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
              {surah.name.replace('سُورَةُ ', '')}
            </div>
          </button>
        ))}
        {filteredSurahs.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500">
            No surahs found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
}
