
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface ReportsProps {
  transactions: Transaction[];
  locale: string;
}

const Reports: React.FC<ReportsProps> = ({ transactions, locale }) => {
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

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
    }, []);

  const handleExport = () => {
    window.print();
  };

  const monthlyData = transactions.reduce((acc: any[], t) => {
    // Perform uppercase transformation during data preparation to avoid TypeScript errors with SVG tick properties
    const month = new Date(t.date).toLocaleString('default', { month: 'short' }).toUpperCase();
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
      <div className="flex justify-between items-center mb-4 no-print">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">{strings.reports}</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest font-bold mt-1">Financial analysis</p>
        </div>
        <button 
          onClick={handleExport}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 flex items-center space-x-3 transition-all active:scale-95"
        >
          <i className="fas fa-file-export"></i>
          <span>Save as Report</span>
        </button>
      </div>

      <div className="print-header hidden print:block text-center border-b-4 border-emerald-600 pb-8 mb-12">
        <h1 className="text-5xl font-black text-emerald-800 tracking-tighter mb-2">ROZANA PAISA</h1>
        <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-sm">Monthly Wealth Performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Spending Patterns */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h3 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-widest flex items-center">
            <span className="w-2 h-2 bg-rose-500 rounded-full mr-3 animate-pulse"></span>
            Spending Patterns
          </h3>
          <div className="h-72 w-full relative">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="99%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    animationDuration={1500}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', fontWeight: 'bold' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 italic font-bold">No data to display</div>
            )}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {expenseData.slice(0, 4).map((item, index) => (
              <div key={index} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-2xl">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-400 uppercase truncate leading-tight">{item.name}</p>
                  <p className="text-sm font-black text-gray-800">{strings.currency} {item.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Growth Trends */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <h3 className="text-lg font-black text-gray-800 mb-8 uppercase tracking-widest flex items-center">
             <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
             Growth Trends
          </h3>
          <div className="h-72 w-full relative">
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="99%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                  <XAxis 
                    dataKey="month" 
                    axisLine={false} 
                    tickLine={false} 
                    // Fixed: Removed textTransform as it is not a valid SVG property in React's SVGProps definition for tick objects.
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#9ca3af' }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }} 
                    contentStyle={{ borderRadius: '24px', border: 'none', fontWeight: 'bold' }} 
                  />
                  <Bar dataKey="income" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
                  <Bar dataKey="expense" fill="#f43f5e" radius={[8, 8, 0, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300 italic font-bold">Waiting for input</div>
            )}
          </div>
          <div className="mt-8 flex justify-center space-x-10">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-lg bg-emerald-500 shadow-lg shadow-emerald-100"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Inflow</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 rounded-lg bg-rose-500 shadow-lg shadow-rose-100"></div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Outflow</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; font-family: sans-serif; }
          main { padding: 0 !important; overflow: visible !important; }
          .print-header { display: block !important; }
          .rounded-[3rem] { border-radius: 12px !important; box-shadow: none !important; border: 1px solid #eee !important; }
          .shadow-2xl, .shadow-xl, .shadow-[0_20px_50px_rgba(0,0,0,0.05)] { box-shadow: none !important; }
          .h-72 { height: 350px !important; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Reports;
