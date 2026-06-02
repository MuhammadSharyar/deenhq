import { useState } from 'react';
import { useTracker } from '../hooks/useTracker';
import { useSeoHead } from '../hooks/useSeoHead';
import { Plus, Trash2, RotateCcw, CheckCircle2, Circle } from 'lucide-react';

export function Tracker() {
  useSeoHead({
    title: 'Local Tracker | DeenHQ',
    description: 'Track your daily Islamic habits and digital tasbih offline.',
  });

  const { tasbih, incrementTasbih, resetTasbih, habits, toggleHabit, addHabit, deleteHabit } = useTracker();
  const [newHabit, setNewHabit] = useState('');

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabit.trim()) {
      addHabit(newHabit.trim());
      setNewHabit('');
    }
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = habits.length === 0 ? 0 : (completedCount / habits.length) * 100;

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Local Tracker</h1>
        <p className="text-slate-500 dark:text-slate-400">Your daily habits reset at midnight. Data is stored on this device.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Tasbih Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px]">
          <h2 className="text-xl font-bold mb-8 text-slate-700 dark:text-slate-300">Digital Tasbih</h2>
          
          <button 
            onClick={incrementTasbih}
            className="w-48 h-48 rounded-full bg-primary text-white text-6xl font-bold flex items-center justify-center shadow-lg active:scale-95 active:bg-blue-600 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 select-none touch-manipulation"
            aria-label="Increment Tasbih"
          >
            {tasbih}
          </button>
          
          <button 
            onClick={resetTasbih}
            className="mt-8 flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Counter
          </button>
        </section>

        {/* Habits Section */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col max-h-[600px]">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Daily Habits</h2>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {completedCount} / {habits.length}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 mb-6 overflow-hidden flex-shrink-0">
            <div className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>

          <ul className="flex-1 space-y-3 overflow-y-auto mb-6 pr-2">
            {habits.map(habit => (
              <li 
                key={habit.id} 
                className={`flex items-center justify-between p-4 rounded-2xl transition-colors cursor-pointer border select-none ${
                  habit.completed 
                    ? 'bg-blue-50/50 border-blue-100 dark:bg-blue-900/10 dark:border-blue-900/30 text-primary' 
                    : 'bg-slate-50 border-transparent dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => toggleHabit(habit.id)}
              >
                <div className="flex items-center gap-3 truncate pr-4">
                  {habit.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-400 dark:text-slate-500 flex-shrink-0" />
                  )}
                  <span className={`font-medium truncate ${habit.completed ? 'line-through opacity-80' : ''}`}>
                    {habit.name}
                  </span>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors focus:outline-none flex-shrink-0"
                  aria-label="Delete habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
            {habits.length === 0 && (
              <li className="text-center text-slate-500 dark:text-slate-400 py-8">
                No habits added. Start building your routine!
              </li>
            )}
          </ul>

          <form onSubmit={handleAddHabit} className="relative mt-auto flex-shrink-0">
            <input
              type="text"
              value={newHabit}
              onChange={(e) => setNewHabit(e.target.value)}
              placeholder="Add a new habit..."
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-5 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
            <button 
              type="submit"
              disabled={!newHabit.trim()}
              className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
