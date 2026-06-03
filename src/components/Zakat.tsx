import { useState } from 'react';
import { useSeoHead } from '../hooks/useSeoHead';
import { Calculator, DollarSign, Info } from 'lucide-react';

export function Zakat() {
  useSeoHead({
    title: 'Zakat Calculator | DeenHQ',
    description: 'A privacy-first, completely offline Zakat calculator to determine your obligations accurately.',
  });

  const [cash, setCash] = useState<number | ''>('');
  const [gold, setGold] = useState<number | ''>('');
  const [investments, setInvestments] = useState<number | ''>('');
  const [business, setBusiness] = useState<number | ''>('');
  const [debts, setDebts] = useState<number | ''>('');
  const [nisab, setNisab] = useState<number | ''>('');

  const totalAssets = (Number(cash) || 0) + (Number(gold) || 0) + (Number(investments) || 0) + (Number(business) || 0);
  const totalLiabilities = Number(debts) || 0;
  const netAssets = totalAssets - totalLiabilities;
  const nisabThreshold = Number(nisab) || 0;
  
  const isEligible = nisabThreshold > 0 && netAssets >= nisabThreshold;
  const zakatOwed = isEligible ? netAssets * 0.025 : 0;

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-8 pb-32">
      <header className="space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          <Calculator className="w-8 h-8 text-primary" />
          Zakat Calculator
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Calculate your 2.5% obligation. Your financial data never leaves your device.
        </p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Assets Section */}
          <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Assets (Zakatable Wealth)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cash (at home & bank)</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" value={cash} onChange={e => setCash(e.target.valueAsNumber || '')} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Value of Gold & Silver</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" value={gold} onChange={e => setGold(e.target.valueAsNumber || '')} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Investments & Shares</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" value={investments} onChange={e => setInvestments(e.target.valueAsNumber || '')} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Business Inventory & Cash</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="number" min="0" value={business} onChange={e => setBusiness(e.target.valueAsNumber || '')} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
                </div>
              </div>
            </div>
          </section>

          {/* Liabilities Section */}
          <section className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Your Liabilities (Deductibles)</h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Short-term Debts & Bills Due</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="number" min="0" value={debts} onChange={e => setDebts(e.target.valueAsNumber || '')} className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary text-slate-900 dark:text-white" />
              </div>
            </div>
          </section>
        </div>

        {/* Calculation Summary Panel */}
        <div className="space-y-6">
          <section className="bg-primary text-white p-6 md:p-8 rounded-3xl shadow-lg relative overflow-hidden sticky top-8">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            
            <h2 className="text-xl font-bold mb-6">Calculation</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-teal-100 text-sm">
                <span>Total Assets</span>
                <span>{totalAssets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-teal-100 text-sm">
                <span>Total Liabilities</span>
                <span>- {totalLiabilities.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-4 border-t border-teal-400/30">
                <span>Net Zakatable</span>
                <span>{netAssets.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2 mb-8">
              <label className="block text-sm font-medium text-teal-100">Current Nisab Value</label>
              <div className="relative text-slate-900">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="number" min="0" placeholder="e.g. 5000" value={nisab} onChange={e => setNisab(e.target.valueAsNumber || '')} className="w-full pl-9 pr-3 py-2 rounded-lg bg-white border-none focus:ring-2 focus:ring-white text-slate-900" />
              </div>
              <p className="text-xs text-teal-200 mt-1 flex items-start gap-1">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                Check current local gold/silver prices to determine the Nisab threshold.
              </p>
            </div>

            <div className="pt-6 border-t border-teal-400/30">
              <span className="block text-sm font-medium text-teal-100 mb-1">Total Zakat Owed</span>
              {nisabThreshold === 0 ? (
                <div className="text-xl font-bold">Enter Nisab</div>
              ) : isEligible ? (
                <div className="text-4xl font-bold tabular-nums">
                  <span className="text-2xl mr-1 opacity-70">$</span>
                  {zakatOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              ) : (
                <div className="text-xl font-bold text-emerald-300">Below Nisab</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
