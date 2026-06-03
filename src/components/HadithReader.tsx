import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSeoHead } from '../hooks/useSeoHead';
import { fetchHadithSection, SUPPORTED_BOOKS } from '../services/hadithApi';
import type { HadithItem } from '../services/hadithApi';
import { Loader2, ArrowLeft, BookOpen } from 'lucide-react';

interface MergedHadith {
  hadithnumber: number;
  arabicnumber: number;
  arabicText: string;
  englishText: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

export function HadithReader() {
  const { bookId, sectionId } = useParams<{ bookId: string; sectionId: string }>();
  const navigate = useNavigate();
  const bookMeta = SUPPORTED_BOOKS.find(b => b.id === bookId);

  const [hadiths, setHadiths] = useState<MergedHadith[]>([]);
  const [sectionTitle, setSectionTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useSeoHead({
    title: sectionTitle ? `${sectionTitle} - ${bookMeta?.name} | DeenHQ` : 'Hadith Reader | DeenHQ',
    description: `Read hadiths from ${sectionTitle} in ${bookMeta?.name}. Arabic and English translation provided.`,
  });

  useEffect(() => {
    if (!bookId || !sectionId || !bookMeta) {
      navigate('/collections');
      return;
    }

    const loadHadiths = async () => {
      try {
        setIsLoading(true);
        // Fetch Arabic and English simultaneously
        const [arabicRes, englishRes] = await Promise.all([
          fetchHadithSection(`ara-${bookId}`, sectionId).catch(() => null),
          fetchHadithSection(`eng-${bookId}`, sectionId).catch(() => null)
        ]);

        if (!arabicRes && !englishRes) {
          throw new Error('Failed to load both Arabic and English text.');
        }

        // Set the section title from whichever response succeeded
        const metaSource = englishRes || arabicRes;
        if (metaSource) {
          setSectionTitle(metaSource.metadata.section[sectionId] || `Chapter ${sectionId}`);
        }

        const merged: MergedHadith[] = [];
        const baseArray = arabicRes?.hadiths || englishRes?.hadiths || [];

        baseArray.forEach((baseItem: HadithItem) => {
          const araItem = arabicRes?.hadiths.find((h: HadithItem) => h.hadithnumber === baseItem.hadithnumber);
          const engItem = englishRes?.hadiths.find((h: HadithItem) => h.hadithnumber === baseItem.hadithnumber);
          
          merged.push({
            hadithnumber: baseItem.hadithnumber,
            arabicnumber: baseItem.arabicnumber,
            arabicText: araItem?.text || '',
            englishText: engItem?.text || '',
            grades: engItem?.grades || araItem?.grades,
            reference: baseItem.reference
          });
        });

        setHadiths(merged);
      } catch (err) {
        console.error(err);
        setError('Failed to load hadiths. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadHadiths();
  }, [bookId, sectionId, bookMeta, navigate]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-slate-500">Loading hadiths...</p>
      </div>
    );
  }

  if (error || hadiths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
          <BookOpen className="w-8 h-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Error Loading Chapter</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">{error || 'No hadiths found in this chapter.'}</p>
        <button onClick={() => navigate(`/collections/${bookId}`)} className="px-6 py-2 mt-4 bg-primary text-white rounded-xl font-medium">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto pb-32">
      <Link to={`/collections/${bookId}`} className="inline-flex items-center gap-2 text-primary hover:text-teal-700 font-medium mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to {bookMeta?.name}
      </Link>
      
      <header className="mb-10 text-center border-b border-slate-200 dark:border-slate-800 pb-8">
        <h2 className="text-teal-600 dark:text-teal-400 font-bold tracking-wider uppercase text-sm mb-3">
          Chapter {sectionId}
        </h2>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
          {sectionTitle}
        </h1>
        <p className="text-slate-500 mt-4">
          {hadiths.length} Hadiths
        </p>
      </header>

      <div className="space-y-12">
        {hadiths.map((hadith) => (
          <article key={hadith.hadithnumber} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 font-bold">
                {hadith.hadithnumber}
              </span>
              {hadith.grades && hadith.grades.length > 0 && (
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  hadith.grades[0].grade.toLowerCase().includes('sahih') 
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                    : hadith.grades[0].grade.toLowerCase().includes('hasan')
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                }`}>
                  {hadith.grades[0].grade}
                </span>
              )}
            </div>

            {hadith.arabicText && (
              <div className="mb-8">
                <p 
                  className="text-2xl md:text-3xl leading-loose md:leading-loose text-right text-slate-900 dark:text-white"
                  style={{ fontFamily: "'Uthmani', 'Amiri', serif" }}
                  dir="rtl"
                >
                  {hadith.arabicText}
                </p>
              </div>
            )}

            {hadith.englishText && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                  {hadith.englishText}
                </p>
              </div>
            )}
            
            {hadith.reference && (
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm text-slate-400">
                Reference: Book {hadith.reference.book}, Hadith {hadith.reference.hadith}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
