import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSeoHead } from '../hooks/useSeoHead';
import { fetchAllBooksInfo, SUPPORTED_BOOKS } from '../services/hadithApi';
import type { HadithInfo } from '../services/hadithApi';
import { Loader2, ArrowLeft, ChevronRight, BookOpen } from 'lucide-react';

export function HadithBook() {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const bookMeta = SUPPORTED_BOOKS.find(b => b.id === bookId);
  
  const [info, setInfo] = useState<HadithInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useSeoHead({
    title: bookMeta ? `${bookMeta.name} | DeenHQ` : 'Hadith Book | DeenHQ',
    description: `Read chapters and sections from ${bookMeta?.name || 'Hadith collections'}.`,
  });

  useEffect(() => {
    if (!bookId || !bookMeta) {
      navigate('/collections');
      return;
    }

    const loadBookInfo = async () => {
      try {
        setIsLoading(true);
        const data = await fetchAllBooksInfo();
        if (data[bookId]) {
          setInfo(data[bookId]);
        } else {
          setError('Book information not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load book chapters. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookInfo();
  }, [bookId, bookMeta, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500">Loading chapters...</p>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Book</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">{error}</p>
        <button onClick={() => navigate('/collections')} className="px-6 py-2 mt-4 bg-primary text-white rounded-xl font-medium">
          Go Back
        </button>
      </div>
    );
  }

  // Filter out empty sections (some books have an empty "0" section)
  const sections = Object.entries(info.metadata.sections)
    .filter(([_, title]) => title && title.trim() !== '')
    .map(([id, title]) => ({
      id,
      title,
      details: info.metadata.section_details[id]
    }))
    .sort((a, b) => parseInt(a.id) - parseInt(b.id));

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto pb-32">
      <Link to="/collections" className="inline-flex items-center gap-2 text-primary hover:text-teal-700 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Library
      </Link>
      
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
          {bookMeta?.name || info.metadata.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          {bookMeta?.author} • {sections.length} Chapters
        </p>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {sections.map((section) => (
          <Link
            key={section.id}
            to={`/collections/${bookId}/${section.id}`}
            className="flex items-center p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
          >
            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center font-bold text-lg mr-4 group-hover:scale-105 transition-transform shrink-0">
              {section.id}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {section.title}
              </h2>
              {section.details && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Hadith {section.details.hadithnumber_first} - {section.details.hadithnumber_last}
                </p>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors ml-4 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
