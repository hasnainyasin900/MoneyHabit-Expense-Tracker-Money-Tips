
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction, TransactionType, AppLanguage } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface ReportsProps {
  transactions: Transaction[];
  locale: AppLanguage;
}

const Reports: React.FC<ReportsProps> = ({ transactions, locale }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const expenseData = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc: any[], t) => {
      const existing = acc.find(item => item.name === t.category);
      if (existing) {
        existing.value += t.amount;
      } else {
        const catInfo = CATEGORIES.EXPENSE.find(c => c.name === t.category);
        acc.push({ name: t.category, value: t.amount, color: catInfo?.color || '#8884d8' });
      }
      return acc;
    }, [])
    .sort((a, b) => b.value - a.value);

  const totalExpense = expenseData.reduce((sum, item) => sum + item.value, 0);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 1200);
  };

  const monthlyData = transactions.reduce((acc: any[], t) => {
    const date = new Date(t.date);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const existing = acc.find(item => item.month === month);
    if (existing) {
      if (t.type === TransactionType.INCOME) existing.income += t.amount;
      else existing.expense += t.amount;
    } else {
      acc.push({
        month,
        income: t.type === TransactionType.INCOME ? t.amount : 0,
        expense: t.type === TransactionType.EXPENSE ? t.amount : 0,
      });
    }
    return acc;
  }, []).slice(-6);

  return (
    <div className="space-y-10 animate-in fade-in duration-700 print:p-0">
      <div className="flex justify-between items-center mb-4 no-print px-2">
        <div>
          <h2 className="text-4xl font-black text-gray-800 dark:text-slate-100 tracking-tighter uppercase italic">{strings.reports}</h2>
          <p className="text-emerald-600 font-black text-xs uppercase tracking-[0.3em] mt-1">Wallet Audit</p>
        </div>
        <button 
          onClick={handleExport}
          disabled={isExporting}
          className={`px-8 py-5 rounded-2xl text-sm font-black shadow-2xl flex items-center space-x-3 transition-all active:scale-95 ${
            isExporting ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-950/20 hover:bg-emerald-700'
          }`}
        >
          {isExporting ? (
            <i className="fas fa-spinner animate-spin"></i>
          ) : (
            <i className="fas fa-file-pdf"></i>
          )}
          <span>{isExporting ? 'Generating...' : (locale === 'en' ? 'Export PDF' : 'Report Save Karen')}</span>
        </button>
      </div>

      <div className="print-header hidden print:block text-center border-b-[6px] border-emerald-600 pb-10 mb-12">
        <h1 className="text-6xl font-black text-emerald-800 tracking-tighter mb-2">ROZANA PAISA</h1>
        <p className="text-gray-400 font-black uppercase tracking-[0.5em] text-xs">OFFICIAL FINANCIAL SUMMARY</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col">
          <h3 className="text-lg font-black text-gray-800 dark:text-slate-200 mb-6 uppercase tracking-widest flex items-center italic">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 animate-pulse"></span>
            Expense Flow
          </h3>
          <div className="flex-1 w-full min-h-[220px] relative">
            {isMounted && expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1000}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontWeight: '900', background: '#1e293b', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 dark:text-slate-800 italic font-black uppercase tracking-widest text-xs">No Data Found</div>
            )}
          </div>
          
          {/* Detailed Expense Table below chart */}
          {expenseData.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-800 pb-2">Category Breakdown</p>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {expenseData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs font-bold text-gray-600 dark:text-slate-400">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-gray-800 dark:text-slate-200">{strings.currency}{item.value.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                        {((item.value / totalExpense) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-800 flex flex-col">
          <h3 className="text-lg font-black text-gray-800 dark:text-slate-200 mb-6 uppercase tracking-widest flex items-center italic">
             <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
             Wealth Trend
          </h3>
          <div className="flex-1 w-full min-h-[220px] relative">
            {isMounted && monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.03)' }} 
                    contentStyle={{ borderRadius: '20px', border: 'none', fontWeight: '900', background: '#1e293b', color: '#fff' }} 
                    itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={20} />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 dark:text-slate-800 italic font-black uppercase tracking-widest text-xs">Waiting for records</div>
            )}
          </div>

          {/* Monthly Stats Summary below chart */}
          {monthlyData.length > 0 && (
            <div className="mt-8 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-50 dark:border-slate-800 pb-2">Recent Monthly Pulse</p>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {monthlyData.slice().reverse().map((data) => (
                  <div key={data.month} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
                    <span className="text-xs font-black text-gray-500">{data.month}</span>
                    <div className="flex space-x-6 text-right">
                      <div>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">In</p>
                        <p className="text-[10px] font-black text-gray-800 dark:text-slate-200">{strings.currency}{data.income.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest">Out</p>
                        <p className="text-[10px] font-black text-gray-800 dark:text-slate-200">{strings.currency}{data.expense.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
          main { padding: 0 !important; overflow: visible !important; }
          .print-header { display: block !important; }
          .rounded-[3rem] { border-radius: 12px !important; box-shadow: none !important; border: 1px solid #eee !important; margin-bottom: 20px; }
          .grid { display: block !important; }
          .grid > div { margin-bottom: 30px !important; page-break-inside: avoid; }
          .dark { background: white !important; }
        }
      `}</style>
    </div>
  );
};

export default Reports;
