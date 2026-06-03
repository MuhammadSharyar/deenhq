import { useState, useRef, useEffect } from 'react';
import { useQuran } from '../hooks/useQuran';
import { useSeoHead } from '../hooks/useSeoHead';
import { BookmarkCheck, ChevronLeft, Search, Languages, Download, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import { useQuranAudio } from '../hooks/useQuranAudio';

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
      <SurahReader 
        surah={surah} 
        onBack={() => setSelectedSurah(null)} 
        bookmark={bookmark} 
        saveBookmark={saveBookmark} 
      />
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

function SurahReader({ surah, onBack, bookmark, saveBookmark }: any) {
  const [showTranslation, setShowTranslation] = useState(false);
  const ayahRefs = useRef<{ [key: string]: HTMLSpanElement | null }>({});
  
  const { audioUrl, isDownloaded, isDownloading, error, downloadAudio, deleteAudio } = useQuranAudio(surah.number);

  useEffect(() => {
    if (bookmark?.surah === surah.number) {
      setTimeout(() => {
        const el = ayahRefs.current[`${surah.number}-${bookmark.ayah}`];
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [surah.number, bookmark]);

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Surahs
        </button>
        
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            showTranslation 
              ? 'bg-primary text-white' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <Languages className="w-4 h-4" />
          {showTranslation ? 'Hide Translation' : 'Show Translation'}
        </button>
      </div>

      <header className="text-center mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-bold font-[Amiri_Quran] text-primary mb-4" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
          {surah.name}
        </h1>
        <h2 className="text-xl text-slate-700 dark:text-slate-300 font-medium">
          {surah.englishName}
        </h2>
        <p className="text-slate-500 text-sm mt-2 mb-8">
          {surah.englishNameTranslation} • {surah.revelationType} • {surah.ayahs.length} Ayahs
        </p>
        
        <div className="max-w-sm mx-auto bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl flex flex-col gap-3 border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between w-full px-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Audio Recitation</span>
            <div className="flex items-center gap-2">
              {isDownloaded ? (
                <>
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-emerald-500">
                    <CheckCircle2 className="w-3 h-3" /> Offline
                  </span>
                  <button onClick={deleteAudio} className="text-slate-400 hover:text-red-500 transition-colors" title="Delete offline audio">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              ) : isDownloading ? (
                <span className="flex items-center gap-1 text-[10px] font-bold uppercase text-teal-500">
                  <Loader2 className="w-3 h-3 animate-spin" /> Downloading...
                </span>
              ) : (
                <button onClick={downloadAudio} className="flex items-center gap-1 text-[10px] font-bold uppercase text-primary hover:text-teal-600 transition-colors">
                  <Download className="w-3 h-3" /> Save Offline
                </button>
              )}
            </div>
          </div>
          
          {error && <div className="text-xs text-red-500">{error}</div>}
          
          <audio 
            key={audioUrl} // Force reload when URL changes
            controls 
            className="w-full h-10" 
            src={audioUrl || ''}
            preload="metadata"
          >
            Your browser does not support the audio element.
          </audio>
        </div>
      </header>

      {/* Bismillah for all surahs except Tawbah (9) and Fatiha (where it's verse 1) */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-16 mt-8" style={{ fontFamily: '"Amiri Quran", serif' }} dir="rtl">
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </div>
      )}

      <article 
        className={
          showTranslation 
            ? "flex flex-col gap-8 md:gap-12 pb-24"
            : "text-right leading-[3.5] md:leading-[4] text-2xl md:text-[2rem] text-slate-900 dark:text-slate-100 pb-24"
        }
        style={!showTranslation ? { fontFamily: '"Amiri Quran", serif' } : {}}
        dir={!showTranslation ? "rtl" : "ltr"}
      >
        {surah.ayahs.map((ayah: any) => {
          const isBookmarked = bookmark?.surah === surah.number && bookmark?.ayah === ayah.numberInSurah;
          let text = ayah.text;
          
          if (surah.number !== 1 && ayah.numberInSurah === 1 && text.startsWith('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ')) {
            text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ ', '');
          }

          if (showTranslation) {
            return (
              <div 
                key={ayah.numberInSurah}
                ref={(el) => { ayahRefs.current[`${surah.number}-${ayah.numberInSurah}`] = el; }}
                className={`flex flex-col gap-4 p-4 md:p-6 rounded-2xl transition-colors duration-300 ${isBookmarked ? 'bg-teal-50 dark:bg-teal-900/20 ring-1 ring-teal-500/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
              >
                <div className="flex items-start justify-between gap-6" dir="rtl">
                  <div 
                    className="text-right leading-[2.5] md:leading-[3] text-2xl md:text-[2rem] text-slate-900 dark:text-slate-100 flex-1 cursor-pointer hover:text-primary transition-colors" 
                    style={{ fontFamily: '"Amiri Quran", serif' }}
                    onClick={() => saveBookmark(surah.number, ayah.numberInSurah)}
                  >
                    {text}
                  </div>
                  <span 
                    className="flex-shrink-0 inline-flex items-center justify-center w-10 h-10 text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-colors" 
                    onClick={() => saveBookmark(surah.number, ayah.numberInSurah)}
                  >
                    {ayah.numberInSurah}
                  </span>
                </div>
                
                {ayah.translation && (
                  <div className="text-left text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4" dir="ltr">
                    {ayah.translation}
                  </div>
                )}
              </div>
            );
          }

          return (
            <span 
              key={ayah.numberInSurah}
              ref={(el) => { ayahRefs.current[`${surah.number}-${ayah.numberInSurah}`] = el; }}
              className={`inline relative group select-none transition-colors duration-300 ${isBookmarked ? 'bg-teal-50 dark:bg-teal-900/30 shadow-[0_0_10px_rgba(0,112,242,0.1)] rounded-md px-1' : ''}`}
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
