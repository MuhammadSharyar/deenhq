import { useState, useEffect } from 'react';

export interface Dua {
  id: number;
  category: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
}

export function useDuas() {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/duas.json')
      .then(res => res.json())
      .then(data => {
        setDuas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load duas", err);
        setLoading(false);
      });
  }, []);

  return { duas, loading };
}
