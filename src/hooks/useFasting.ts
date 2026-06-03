import { useState, useEffect } from 'react';

export type FastingType = 'sunnah' | 'fardh' | 'kaffarah' | 'qada' | 'none';

export interface FastingRecord {
  [dateStr: string]: FastingType; // YYYY-MM-DD format
}

export function useFasting() {
  const [fasts, setFasts] = useState<FastingRecord>({});

  useEffect(() => {
    const saved = localStorage.getItem('deenhq_fasts');
    if (saved) {
      try {
        setFasts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse fasting records');
      }
    }
  }, []);

  const saveFasts = (newFasts: FastingRecord) => {
    setFasts(newFasts);
    localStorage.setItem('deenhq_fasts', JSON.stringify(newFasts));
  };

  const toggleFast = (dateStr: string, type: FastingType = 'sunnah') => {
    const newFasts = { ...fasts };
    
    if (newFasts[dateStr] === type) {
      // If tapping the same type, remove it (toggle off)
      delete newFasts[dateStr];
    } else {
      // Otherwise set the new type
      newFasts[dateStr] = type;
    }
    
    saveFasts(newFasts);
  };

  const getFast = (dateStr: string): FastingType => {
    return fasts[dateStr] || 'none';
  };

  return { fasts, toggleFast, getFast };
}
