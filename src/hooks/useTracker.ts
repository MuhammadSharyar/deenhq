import { useState, useEffect } from 'react';

export interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Read Quran', completed: false },
  { id: '2', name: 'Pray Sunnah', completed: false },
  { id: '3', name: 'Morning Adhkar', completed: false },
  { id: '4', name: 'Evening Adhkar', completed: false },
];

export function useTracker() {
  const [tasbih, setTasbih] = useState(0);
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS);

  // Load state on mount
  useEffect(() => {
    const savedTasbih = localStorage.getItem('deenhq_tasbih');
    if (savedTasbih) setTasbih(parseInt(savedTasbih, 10));

    const savedHabits = localStorage.getItem('deenhq_habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }

    // Check for midnight reset
    const lastActive = localStorage.getItem('deenhq_last_active');
    const today = new Date().toDateString();

    if (lastActive !== today) {
      // It's a new day! Reset habits to uncompleted
      setHabits((prev) => {
        const resetHabits = prev.map(h => ({ ...h, completed: false }));
        localStorage.setItem('deenhq_habits', JSON.stringify(resetHabits));
        return resetHabits;
      });
      localStorage.setItem('deenhq_last_active', today);
    }
  }, []);

  // Sync Tasbih
  useEffect(() => {
    localStorage.setItem('deenhq_tasbih', tasbih.toString());
  }, [tasbih]);

  // Sync Habits
  useEffect(() => {
    if (habits !== DEFAULT_HABITS) {
      localStorage.setItem('deenhq_habits', JSON.stringify(habits));
    }
  }, [habits]);

  const incrementTasbih = () => {
    if ('vibrate' in navigator) navigator.vibrate([50]);
    setTasbih((prev) => prev + 1);
  };

  const resetTasbih = () => setTasbih(0);

  const toggleHabit = (id: string) => {
    if ('vibrate' in navigator) navigator.vibrate([30]);
    setHabits((prev) => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const addHabit = (name: string) => {
    const newHabit = { id: Date.now().toString(), name, completed: false };
    setHabits((prev) => [...prev, newHabit]);
  };

  const deleteHabit = (id: string) => {
    setHabits((prev) => prev.filter(h => h.id !== id));
  };

  return {
    tasbih,
    incrementTasbih,
    resetTasbih,
    habits,
    toggleHabit,
    addHabit,
    deleteHabit,
  };
}
