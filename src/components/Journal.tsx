import { useState } from 'react';
import { useJournal, type JournalEntry } from '../hooks/useJournal';
import { useSeoHead } from '../hooks/useSeoHead';
import { BookHeart, Plus, ChevronLeft, Trash2, Calendar, Save } from 'lucide-react';

export function Journal() {
  useSeoHead({
    title: 'Private Journal | DeenHQ',
    description: 'A private space for your Islamic reflections and gratitude.',
  });

  const { entries, addEntry, updateEntry, deleteEntry } = useJournal();
  
  const [activeEntry, setActiveEntry] = useState<JournalEntry | 'new' | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const handleOpenNew = () => {
    setEditTitle('');
    setEditContent('');
    setActiveEntry('new');
  };

  const handleOpenEntry = (entry: JournalEntry) => {
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setActiveEntry(entry);
  };

  const handleSave = () => {
    if (!editTitle.trim() && !editContent.trim()) return;
    
    if (activeEntry === 'new') {
      addEntry(editTitle || 'Untitled Reflection', editContent);
    } else if (activeEntry) {
      updateEntry(activeEntry.id, editTitle || 'Untitled Reflection', editContent);
    }
    setActiveEntry(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this reflection?')) {
      deleteEntry(id);
      setActiveEntry(null);
    }
  };

  // Editor View
  if (activeEntry) {
    return (
      <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveEntry(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          
          <div className="flex items-center gap-4">
            {activeEntry !== 'new' && (
              <button 
                onClick={() => handleDelete(activeEntry.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                title="Delete Entry"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col gap-6">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title of your reflection..."
            className="text-3xl md:text-4xl font-bold bg-transparent border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none"
          />
          
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            {activeEntry === 'new' ? 'Today' : new Date(activeEntry.updatedAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Write your thoughts, gratitude, or duas here..."
            className="flex-1 w-full bg-transparent border-none focus:ring-0 p-0 text-lg text-slate-700 dark:text-slate-300 resize-none leading-relaxed placeholder:text-slate-300 dark:placeholder:text-slate-600 min-h-[300px] outline-none"
          />
        </main>
      </div>
    );
  }

  // List View
  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 min-h-screen">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <BookHeart className="w-8 h-8 text-primary" />
            Private Journal
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Your personal space for reflections. Stored securely on this device.</p>
        </div>
        
        <button 
          onClick={handleOpenNew}
          className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary shadow-lg shadow-primary/20"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </header>

      {entries.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <BookHeart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">It's empty here</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Start writing your daily reflections, things you are grateful for, or personal duas.
          </p>
          <button 
            onClick={handleOpenNew}
            className="text-primary font-medium hover:text-emerald-600 transition-colors"
          >
            Write your first entry →
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map(entry => (
            <button
              key={entry.id}
              onClick={() => handleOpenEntry(entry)}
              className="text-left bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-primary hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary group flex flex-col h-48"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                {entry.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-auto">
                {entry.content || 'No content...'}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
