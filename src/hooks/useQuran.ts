import { useState, useEffect } from 'react';

export interface Ayah {
  numberInSurah: number;
  text: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  ayahs: Ayah[];
}

export function useQuran() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Read bookmark: { surah: number, ayah: number }
  const [bookmark, setBookmark] = useState<{ surah: number; ayah: number } | null>(null);

  useEffect(() => {
    // Load bookmark
    const saved = localStorage.getItem('deenhq_quran_bookmark');
    if (saved) {
      try {
        setBookmark(JSON.parse(saved));
      } catch (e) {
        console.error('Invalid bookmark data');
      }
    }

    // Load static JSON data
    fetch('/data/quran.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load Quran data');
        return res.json();
      })
      .then(data => {
        setSurahs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Unable to load the Quran data. Please ensure you are connected to the internet for the first load or check your PWA cache.');
        setLoading(false);
      });
  }, []);

  const saveBookmark = (surahNumber: number, ayahNumber: number) => {
    const newBookmark = { surah: surahNumber, ayah: ayahNumber };
    setBookmark(newBookmark);
    localStorage.setItem('deenhq_quran_bookmark', JSON.stringify(newBookmark));
    if ('vibrate' in navigator) navigator.vibrate([30]);
  };

  const removeBookmark = () => {
    setBookmark(null);
    localStorage.removeItem('deenhq_quran_bookmark');
  };

  return {
    surahs,
    loading,
    error,
    bookmark,
    saveBookmark,
    removeBookmark
  };
}
