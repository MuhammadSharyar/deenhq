import { useState, useEffect } from 'react';

export interface Hadith {
  id: number;
  arabic: string;
  english: string;
  reference: { book: number; hadith: number };
}

export function useHadith() {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/nawawi.json')
      .then(res => res.json())
      .then(data => {
        setHadiths(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load hadiths", err);
        setLoading(false);
      });
  }, []);

  return { hadiths, loading };
}
