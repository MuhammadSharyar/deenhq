import { useState } from 'react';
import { useTracker } from '../hooks/useTracker';
import { useSeoHead } from '../hooks/useSeoHead';
import { Plus, Trash2, RotateCcw, CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { Heatmap } from './Heatmap';
import { motion, AnimatePresence } from 'framer-motion';

type SequenceStep = { text: string; arabic: string; count: number };

const adhkarPresets = [
  { id: 'free', name: 'Free Style', sequence: null },
  { 
    id: 'after_salah', 
    name: 'After Salah', 
    sequence: [
      { text: 'Subhanallah', arabic: 'سُبْحَانَ ٱللَّٰهِ', count: 33 },
      { text: 'Alhamdulillah', arabic: 'ٱلْحَمْدُ لِلَّٰهِ', count: 33 },
      { text: 'Allahu Akbar', arabic: 'ٱللَّٰهُ أَكْبَرُ', count: 34 }
    ] as SequenceStep[]
  },
  { 
    id: 'morning_evening', 
    name: 'Morning / Evening', 
    sequence: [
      { text: 'Subhanallah wa bihamdihi', arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', count: 100 }
    ] as SequenceStep[]
  }
];

export function Tracker() {
  useSeoHead({
    title: 'Local Tracker | DeenHQ',
    description: 'Track your daily Islamic habits and digital tasbih offline.',
  });

  const { tasbih, incrementTasbih, resetTasbih, habits, history, toggleHabit, addHabit, deleteHabit } = useTracker();
  const [newHabit, setNewHabit] = useState('');

  // Guided Tasbih State
  const [selectedPresetId, setSelectedPresetId] = useState('free');
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [sequenceCount, setSequenceCount] = useState(0);

  const selectedPreset = adhkarPresets.find(p => p.id === selectedPresetId) || adhkarPresets[0];
  const currentStep = selectedPreset.sequence ? selectedPreset.sequence[sequenceIndex] : null;

  const handleTasbihTap = () => {
    incrementTasbih();

    if (currentStep) {
      if (sequenceCount + 1 >= currentStep.count) {
        // Reached end of current step
        if (sequenceIndex + 1 < selectedPreset.sequence!.length) {
          if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]); // double vibrate for transition
          setSequenceIndex(idx => idx + 1);
          setSequenceCount(0);
        } else {
          if ('vibrate' in navigator) navigator.vibrate([200, 100, 200, 100, 200]); // success vibrate
          setSequenceIndex(0);
          setSequenceCount(0);
        }
      } else {
        if ('vibrate' in navigator) navigator.vibrate(20); // light tap
        setSequenceCount(c => c + 1);
      }
    } else {
      if ('vibrate' in navigator) navigator.vibrate(20); // light tap
    }
  };

  const handleTasbihReset = () => {
    resetTasbih();
    setSequenceIndex(0);
    setSequenceCount(0);
  };

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPresetId(e.target.value);
    setSequenceIndex(0);
    setSequenceCount(0);
  };

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
        <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-full flex justify-between items-center mb-8 z-10">
            <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Digital Tasbih</h2>
            <div className="relative">
              <select 
                value={selectedPresetId}
                onChange={handlePresetChange}
                className="appearance-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 py-2 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                {adhkarPresets.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center w-full z-10">
            <div className="h-24 flex flex-col items-center justify-end mb-6 text-center">
              <AnimatePresence mode="wait">
                {currentStep ? (
                  <motion.div 
                    key={currentStep.text}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col items-center"
                  >
                    <div className="text-2xl font-bold font-['Amiri_Quran'] text-primary mb-2" dir="rtl">{currentStep.arabic}</div>
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">{currentStep.text}</div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="free"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium text-slate-400 uppercase tracking-widest"
                  >
                    Total Count
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={handleTasbihTap}
              className="w-56 h-56 rounded-full bg-gradient-to-br from-primary to-emerald-600 text-white flex flex-col items-center justify-center shadow-xl shadow-primary/20 active:scale-95 active:shadow-md transition-all focus:outline-none focus:ring-4 focus:ring-primary/30 select-none touch-manipulation relative overflow-hidden group"
              aria-label="Increment Tasbih"
            >
              <div className="absolute inset-0 bg-black/10 opacity-0 group-active:opacity-100 transition-opacity"></div>
              
              {currentStep ? (
                <>
                  <span className="text-6xl font-bold tabular-nums leading-none tracking-tight">{sequenceCount}</span>
                  <div className="text-emerald-100/80 text-sm font-bold mt-2 uppercase tracking-widest bg-black/10 px-3 py-1 rounded-full">
                    of {currentStep.count}
                  </div>
                </>
              ) : (
                <span className="text-6xl font-bold tabular-nums leading-none tracking-tight">{tasbih}</span>
              )}
            </button>
            
            <div className="mt-8 flex items-center justify-between w-full px-4">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Daily Total: <span className="text-primary">{tasbih}</span>
              </div>
              <button 
                onClick={handleTasbihReset}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors uppercase tracking-wider"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
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
            <AnimatePresence mode="popLayout">
              {habits.map(habit => (
                <motion.li 
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  key={habit.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl transition-colors cursor-pointer border select-none ${
                  habit.completed 
                    ? 'bg-teal-50/50 border-teal-100 dark:bg-teal-900/10 dark:border-teal-900/30 text-primary' 
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
                </motion.li>
              ))}
            </AnimatePresence>
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
              className="absolute right-2 top-2 bottom-2 aspect-square bg-primary text-white rounded-xl flex items-center justify-center hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
            >
              <Plus className="w-5 h-5" />
            </button>
          </form>
        </section>
      </div>

      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-100 dark:border-slate-800">
        <Heatmap history={history} />
      </section>
    </div>
  );
}
