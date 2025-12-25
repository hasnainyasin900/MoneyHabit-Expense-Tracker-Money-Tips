import React from 'react';
import { Transaction, TransactionType, AppLanguage } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
  locale: AppLanguage;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddTransaction, locale }) => {
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;
  
  const totalIncome = transactions
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const recentTransactions = transactions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const getCategoryIcon = (name: string, type: TransactionType) => {
    const list = type === TransactionType.EXPENSE ? CATEGORIES.EXPENSE : CATEGORIES.INCOME;
    const cat = list.find(c => c.name === name);
    return cat ? { icon: cat.icon, color: cat.color } : { icon: <i className="fas fa-question"></i>, color: '#gray' };
  };

  return (
    <div className="space-y-8 animate-fast-zoom">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-900 rounded-[3rem] p-10 text-white shadow-[0_30px_60px_-15px_rgba(5,150,105,0.4)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000"></div>
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em] mb-2">{strings.balance}</p>
            <h2 className="text-5xl font-black tracking-tighter italic">
              {strings.currency}{strings.currency ? ' ' : ''}{balance.toLocaleString()}
            </h2>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-emerald-400/30 rounded-xl flex items-center justify-center">
                  <i className="fas fa-arrow-down text-emerald-200 text-xs"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{strings.income}</span>
              </div>
              <p className="text-xl font-black">{strings.currency}{strings.currency ? ' ' : ''}{totalIncome.toLocaleString()}</p>
            </div>
            
            <div className="flex-1 bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/10 transition-transform hover:scale-[1.02]">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.8)] animate-fast-pulse">
                  <i className="fas fa-arrow-up text-white text-sm"></i>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">{strings.expense}</span>
              </div>
              <p className="text-xl font-black text-red-200">{strings.currency}{strings.currency ? ' ' : ''}{totalExpense.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={onAddTransaction}
        className="w-full group bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-slate-800 border-2 border-emerald-100 dark:border-emerald-900/30 p-6 rounded-[2rem] flex items-center justify-between transition-all duration-300 shadow-xl shadow-gray-200/50 active:scale-95"
      >
        <div className="flex items-center space-x-5">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform">
            <i className="fas fa-plus"></i>
          </div>
          <div className="text-left">
            <span className="block font-black text-lg text-emerald-900 dark:text-emerald-100">{strings.addEntry}</span>
            <span className="block text-xs font-bold text-emerald-600/60 uppercase tracking-widest italic">Quick Add</span>
          </div>
        </div>
        <i className="fas fa-chevron-right text-emerald-200 group-hover:translate-x-1 transition-transform"></i>
      </button>

      {/* History */}
      <div className="space-y-5">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl font-black text-gray-800 dark:text-slate-100 tracking-tight uppercase italic">{strings.recent}</h3>
          <i className="fas fa-history text-gray-300 dark:text-slate-700"></i>
        </div>
        
        <div className="space-y-4">
          {recentTransactions.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-16 rounded-[2.5rem] text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200 dark:text-slate-700">
                <i className="fas fa-receipt text-3xl"></i>
              </div>
              <p className="text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest text-xs">No entries found</p>
            </div>
          ) : (
            recentTransactions.map(t => {
              const catInfo = getCategoryIcon(t.category, t.type);
              return (
                <div key={t.id} className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] flex items-center justify-between shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all border border-transparent hover:border-emerald-50 dark:hover:border-emerald-900 animate-vibrant-entry">
                  <div className="flex items-center space-x-5">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner relative"
                      style={{ backgroundColor: `${catInfo.color}10`, color: catInfo.color }}
                    >
                      {catInfo.icon}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900 text-white ${t.type === TransactionType.INCOME ? 'bg-emerald-500 shadow-lg shadow-emerald-500/40' : 'bg-red-600 shadow-lg shadow-red-600/40'}`}>
                        <i className={`fas ${t.type === TransactionType.INCOME ? 'fa-plus' : 'fa-minus'}`}></i>
                      </div>
                    </div>
                    <div>
                      <p className="font-black text-gray-800 dark:text-slate-100">{t.category}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-black tracking-tight ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-600'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} {strings.currency}{t.amount.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-gray-300 dark:text-slate-500 italic truncate max-w-[80px]">{t.note}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;