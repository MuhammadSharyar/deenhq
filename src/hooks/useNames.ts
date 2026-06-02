import { useState, useEffect } from 'react';

export interface NameOfAllah {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
}

export function useNames() {
  const [names, setNames] = useState<NameOfAllah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/names.json')
      .then(res => res.json())
      .then(data => {
        setNames(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load names", err);
        setLoading(false);
      });
  }, []);

  return { names, loading };
}
