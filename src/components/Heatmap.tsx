import { useMemo } from 'react';

interface HeatmapProps {
  history: Record<string, number>;
}

export function Heatmap({ history }: HeatmapProps) {
  // Generate the last 30 days
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split('T')[0]);
    }
    return arr;
  }, []);

  const getColor = (rate: number | undefined) => {
    if (rate === undefined || rate === 0) return 'bg-slate-100 dark:bg-slate-800';
    if (rate < 0.34) return 'bg-teal-200 dark:bg-teal-900/40';
    if (rate < 0.67) return 'bg-teal-400 dark:bg-teal-700/60';
    if (rate < 1) return 'bg-teal-500 dark:bg-teal-600';
    return 'bg-teal-600 dark:bg-teal-500';
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-6">30-Day Activity Heatmap</h3>
      <div className="flex flex-wrap gap-2 md:gap-3">
        {days.map(day => (
          <div
            key={day}
            title={`${day}: ${Math.round((history[day] || 0) * 100)}% completed`}
            className={`w-6 h-6 md:w-8 md:h-8 rounded-md transition-colors shadow-sm ${getColor(history[day])}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-6 text-sm text-slate-500 dark:text-slate-400 font-medium">
        <span>Less</span>
        <div className="flex gap-1.5">
          <div className="w-4 h-4 rounded-[4px] bg-slate-100 dark:bg-slate-800 shadow-sm" />
          <div className="w-4 h-4 rounded-[4px] bg-teal-200 dark:bg-teal-900/40 shadow-sm" />
          <div className="w-4 h-4 rounded-[4px] bg-teal-400 dark:bg-teal-700/60 shadow-sm" />
          <div className="w-4 h-4 rounded-[4px] bg-teal-500 dark:bg-teal-600 shadow-sm" />
          <div className="w-4 h-4 rounded-[4px] bg-teal-600 dark:bg-teal-500 shadow-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
