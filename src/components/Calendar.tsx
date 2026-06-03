import { useState } from 'react';
import { useSeoHead } from '../hooks/useSeoHead';
import { useFasting, type FastingType } from '../hooks/useFasting';
import { getHijriDateParts, isWhiteDay, isSunnahFastingDay } from '../utils/hijri';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Moon, CheckCircle2, X } from 'lucide-react';

export function Calendar() {
  useSeoHead({
    title: 'Fasting Tracker | DeenHQ',
    description: 'Track your fasting days with the integrated Hijri calendar.',
  });

  const { fasts, toggleFast, getFast } = useFasting();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToday = () => setCurrentDate(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); 
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  const paddingDays = firstDayOfMonth; 
  
  const handleDayClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
  };

  const handleSetFast = (type: FastingType) => {
    if (selectedDateStr) {
      if (type === 'none') {
        const currentType = getFast(selectedDateStr);
        if (currentType !== 'none') toggleFast(selectedDateStr, currentType); // Toggles off
      } else {
        const currentType = getFast(selectedDateStr);
        if (currentType !== type) toggleFast(selectedDateStr, type); // Toggles to new type
      }
      setSelectedDateStr(null);
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Pre-calculate total fasts this month
  let monthlyFasts = 0;
  Object.keys(fasts).forEach(dateStr => {
    const d = new Date(dateStr);
    if (d.getFullYear() === year && d.getMonth() === month) {
      monthlyFasts++;
    }
  });

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-5xl mx-auto min-h-screen pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-primary" />
            Fasting Tracker
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Track your sunnah and mandatory fasts beautifully.</p>
        </div>
        
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-primary px-4 py-2 rounded-2xl flex items-center gap-3 font-medium border border-emerald-100 dark:border-emerald-800/50">
          <Moon className="w-5 h-5" />
          {monthlyFasts} Fasts this month
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <button onClick={goToday} className="text-xs font-bold text-primary uppercase tracking-wider hover:bg-emerald-50 dark:hover:bg-emerald-900/20 px-3 py-1 rounded-full transition-colors">
              Today
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={nextMonth} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-7 gap-2 md:gap-4 mb-4">
            {weekdays.map(day => (
              <div key={day} className="text-center text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
            {Array.from({ length: paddingDays }).map((_, i) => (
              <div key={`padding-${i}`} className="aspect-square opacity-0"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const date = new Date(year, month, day);
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              
              const hijri = getHijriDateParts(date);
              const isWhite = isWhiteDay(hijri.day);
              const isSunnah = isSunnahFastingDay(date);
              const fastType = getFast(dateStr);
              
              const isToday = new Date().toDateString() === date.toDateString();

              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(dateStr)}
                  className={`
                    relative aspect-square flex flex-col items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden
                    ${isToday ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900' : ''}
                    ${fastType !== 'none' 
                      ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]' 
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 hover:border-primary border border-transparent'
                    }
                  `}
                >
                  {/* Gregorian Day */}
                  <span className={`text-lg md:text-2xl font-bold ${fastType !== 'none' ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                    {day}
                  </span>
                  
                  {/* Hijri Day */}
                  <span className={`text-[10px] md:text-xs font-medium ${fastType !== 'none' ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {hijri.day} {hijri.monthName.substring(0, 3)}
                  </span>

                  {/* Badges for Sunnah/White Days */}
                  {fastType === 'none' && (isWhite || isSunnah) && (
                    <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-400" title="Sunnah Fasting Day" />
                  )}

                  {/* Fasting Checkmark */}
                  {fastType !== 'none' && (
                    <div className="absolute top-1.5 right-1.5 text-white">
                      <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 md:px-6 flex items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            Sunnah / White Days
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary flex items-center justify-center text-white"><CheckCircle2 className="w-2 h-2" /></div>
            Fasted
          </div>
        </div>
      </div>

      {/* Fasting Modal */}
      {selectedDateStr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Log Fast</h3>
              <button onClick={() => setSelectedDateStr(null)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
                Date: {new Date(selectedDateStr).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleSetFast('sunnah')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${getFast(selectedDateStr) === 'sunnah' ? 'border-primary bg-emerald-50 dark:bg-emerald-900/20 text-primary' : 'border-slate-100 dark:border-slate-800 hover:border-primary text-slate-700 dark:text-slate-300'}`}
                >
                  <span className="font-bold">Sunnah Fast</span>
                  {getFast(selectedDateStr) === 'sunnah' && <CheckCircle2 className="w-5 h-5" />}
                </button>
                
                <button 
                  onClick={() => handleSetFast('fardh')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${getFast(selectedDateStr) === 'fardh' ? 'border-primary bg-emerald-50 dark:bg-emerald-900/20 text-primary' : 'border-slate-100 dark:border-slate-800 hover:border-primary text-slate-700 dark:text-slate-300'}`}
                >
                  <span className="font-bold">Fardh (Ramadan)</span>
                  {getFast(selectedDateStr) === 'fardh' && <CheckCircle2 className="w-5 h-5" />}
                </button>

                <button 
                  onClick={() => handleSetFast('qada')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-colors ${getFast(selectedDateStr) === 'qada' ? 'border-primary bg-emerald-50 dark:bg-emerald-900/20 text-primary' : 'border-slate-100 dark:border-slate-800 hover:border-primary text-slate-700 dark:text-slate-300'}`}
                >
                  <span className="font-bold">Qada (Make-up)</span>
                  {getFast(selectedDateStr) === 'qada' && <CheckCircle2 className="w-5 h-5" />}
                </button>

                {getFast(selectedDateStr) !== 'none' && (
                  <button 
                    onClick={() => handleSetFast('none')}
                    className="w-full py-4 text-slate-500 hover:text-red-500 font-medium transition-colors mt-4"
                  >
                    Remove Fast Log
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
