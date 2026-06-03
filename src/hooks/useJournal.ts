import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('deenhq_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse journal entries');
      }
    }
  }, []);

  const saveEntries = (newEntries: JournalEntry[]) => {
    setEntries(newEntries);
    localStorage.setItem('deenhq_journal', JSON.stringify(newEntries));
  };

  const addEntry = (title: string, content: string) => {
    const now = Date.now();
    const newEntry: JournalEntry = {
      id: crypto.randomUUID(),
      title,
      content,
      createdAt: now,
      updatedAt: now,
    };
    saveEntries([newEntry, ...entries]);
    return newEntry;
  };

  const updateEntry = (id: string, title: string, content: string) => {
    const newEntries = entries.map(entry => 
      entry.id === id 
        ? { ...entry, title, content, updatedAt: Date.now() }
        : entry
    );
    saveEntries(newEntries);
  };

  const deleteEntry = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry
  };
}
