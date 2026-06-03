import { Link } from 'react-router-dom';
import { useSeoHead } from '../hooks/useSeoHead';
import { BookMarked, ChevronRight } from 'lucide-react';
import { SUPPORTED_BOOKS } from '../services/hadithApi';

export function HadithLibrary() {
  useSeoHead({
    title: 'Hadith Collections | DeenHQ',
    description: 'Read and search major Hadith collections including Sahih al-Bukhari, Sahih Muslim, and more in English and Arabic.',
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto pb-32">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-3 flex items-center justify-center md:justify-start gap-3">
          <BookMarked className="w-8 h-8 text-primary" />
          Hadith Library
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Explore the major collections of sayings, actions, and approvals of the Prophet Muhammad (ﷺ).
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {SUPPORTED_BOOKS.map((book) => (
          <Link
            key={book.id}
            to={`/collections/${book.id}`}
            className="group flex flex-col justify-between p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-primary/30 transition-all text-left"
          >
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                {book.name}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                {book.author}
              </p>
            </div>
            
            <div className="flex justify-end mt-4">
              <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
