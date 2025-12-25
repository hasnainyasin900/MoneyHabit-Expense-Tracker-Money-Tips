import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Filters } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface HistoryProps {
  transactions: Transaction[];
  locale: string;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ transactions, locale, onEdit, onDelete }) => {
  const [filters, setFilters] = useState<Filters>({
    type: 'ALL',
    category: 'ALL',
    dateRange: 'ALL'
  });
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filters.type === 'ALL' || t.type === filters.type;
      const categoryMatch = filters.category === 'ALL' || t.category === filters.category;
      
      let dateMatch = true;
      const txDate = new Date(t.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (filters.dateRange === 'TODAY') {
        dateMatch = txDate.toDateString() === today.toDateString();
      } else if (filters.dateRange === 'WEEK') {
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        dateMatch = txDate >= lastWeek;
      } else if (filters.dateRange === 'MONTH') {
        dateMatch = txDate.getMonth() === today.getMonth() && txDate.getFullYear() === today.getFullYear();
      }

      return typeMatch && categoryMatch && dateMatch;
    });
  }, [transactions, filters]);

  const uniqueCategories = Array.from(new Set([...CATEGORIES.EXPENSE, ...CATEGORIES.INCOME].map(c => c.name)));

  const handleTransactionClick = (t: Transaction) => {
    setSelectedTx(t);
  };

  const handleConfirmDelete = (id: string) => {
    if (window.confirm('Delete this transaction permanently? This cannot be undone.')) {
      onDelete(id);
      setSelectedTx(null);
    }
  };

  const activeFiltersCount = (filters.type !== 'ALL' ? 1 : 0) + 
                             (filters.category !== 'ALL' ? 1 : 0) + 
                             (filters.dateRange !== 'ALL' ? 1 : 0);

  return (
    <div className="space-y-6 animate-fast-zoom">
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter uppercase italic">{strings.history || 'History'}</h2>
          <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-1">Transaction Log</p>
        </div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl text-xs font-black transition-all border shadow-sm ${
            isFilterOpen || activeFiltersCount > 0
            ? 'bg-emerald-600 text-white border-emerald-600'
            : 'bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border-gray-100 dark:border-slate-800'
          }`}
        >
          <i className="fas fa-filter"></i>
          <span>{isFilterOpen ? 'Close' : 'Filter'}</span>
          {activeFiltersCount > 0 && <span className="bg-white text-emerald-600 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ml-1">{activeFiltersCount}</span>}
        </button>
      </div>

      {/* Consolidated Filter Bar */}
      {isFilterOpen && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-800 space-y-4 animate-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Time Period</label>
              <select 
                value={filters.dateRange}
                onChange={(e) => setFilters({...filters, dateRange: e.target.value as any})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-xs dark:text-slate-200"
              >
                <option value="ALL">All Time</option>
                <option value="TODAY">Today</option>
                <option value="WEEK">This Week</option>
                <option value="MONTH">This Month</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Type</label>
              <select 
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-xs dark:text-slate-200"
              >
                <option value="ALL">All Types</option>
                <option value={TransactionType.EXPENSE}>Expense</option>
                <option value={TransactionType.INCOME}>Income</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Category</label>
              <select 
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-xl p-3 outline-none font-bold text-xs dark:text-slate-200"
              >
                <option value="ALL">All Categories</option>
                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end">
            <button 
              onClick={() => setFilters({ type: 'ALL', category: 'ALL', dateRange: 'ALL' })}
              className="text-[10px] font-black text-rose-500 uppercase tracking-widest hover:underline px-4"
            >
              Reset All
            </button>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-slate-800">
            <div className="w-32 h-32 mx-auto mb-6 opacity-20 dark:opacity-40">
              <i className="fas fa-receipt text-6xl text-gray-300"></i>
            </div>
            <p className="text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest text-xs italic">
              {locale === 'pk' ? 'Koi records nahi mile' : 'No records match your filters'}
            </p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div 
              key={t.id} 
              onClick={() => handleTransactionClick(t)}
              className="ripple bg-white dark:bg-slate-900 p-5 rounded-3xl flex items-center justify-between shadow-sm border border-transparent hover:border-emerald-100 dark:hover:border-emerald-900 transition-all cursor-pointer active:scale-[0.98] group animate-vibrant-entry"
            >
              <div className="flex items-center space-x-4 pointer-events-none">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl relative ${
                  t.type === TransactionType.INCOME ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600' : 'bg-rose-50 dark:bg-rose-950/30 text-rose-600'
                }`}>
                  {CATEGORIES[t.type].find(c => c.name === t.category)?.icon || <i className="fas fa-tag"></i>}
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-[10px] border-2 border-white dark:border-slate-900 text-white ${t.type === TransactionType.INCOME ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-red-600 shadow-md shadow-red-600/30'}`}>
                    <i className={`fas ${t.type === TransactionType.INCOME ? 'fa-plus' : 'fa-minus'}`}></i>
                  </div>
                </div>
                <div>
                  <p className="font-black text-gray-800 dark:text-slate-200 leading-tight">{t.category}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 truncate max-w-[120px]">{t.note || 'No note'}</p>
                </div>
              </div>
              <div className="text-right pointer-events-none">
                <p className={`font-black text-lg ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-rose-600'}`}>
                   {t.type === TransactionType.INCOME ? '+' : '-'} {strings.currency}{t.amount.toLocaleString()}
                </p>
                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-0.5">{t.date}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[210] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className={`p-8 text-white relative ${selectedTx.type === TransactionType.INCOME ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <i className="fas fa-times"></i>
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl relative">
                  {CATEGORIES[selectedTx.type].find(c => c.name === selectedTx.category)?.icon || <i className="fas fa-tag"></i>}
                  <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-[12px] border-[3px] border-white text-white ${selectedTx.type === TransactionType.INCOME ? 'bg-emerald-500 shadow-xl' : 'bg-red-600 shadow-xl'}`}>
                    <i className={`fas ${selectedTx.type === TransactionType.INCOME ? 'fa-plus' : 'fa-minus'}`}></i>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/70">{selectedTx.type}</p>
                  <h3 className="text-2xl font-black italic tracking-tighter">{selectedTx.category}</h3>
                </div>
              </div>
              <div className="text-center">
                <p className="text-4xl font-black italic tracking-tighter">
                  {selectedTx.type === TransactionType.INCOME ? '+' : '-'} {strings.currency}{selectedTx.amount.toLocaleString()}
                </p>
              </div>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4 border-b border-gray-50 dark:border-slate-800 pb-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Date</label>
                  <p className="text-gray-800 dark:text-slate-100 font-black text-sm">{selectedTx.date}</p>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Created</label>
                  <p className="text-gray-800 dark:text-slate-100 font-black text-sm">{new Date(selectedTx.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Detailed Note</label>
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl italic font-bold text-gray-600 dark:text-slate-300 text-xs">
                  {selectedTx.note || 'No specific details added for this entry.'}
                </div>
              </div>

              <div>
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">Reference ID</label>
                 <p className="text-[9px] font-mono text-gray-300 dark:text-slate-600 uppercase tracking-tighter">TXN-{selectedTx.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button 
                  onClick={() => {
                    onEdit(selectedTx);
                    setSelectedTx(null);
                  }}
                  className="flex items-center justify-center space-x-2 bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                >
                  <i className="fas fa-edit"></i>
                  <span>Edit</span>
                </button>
                <button 
                  onClick={() => handleConfirmDelete(selectedTx.id)}
                  className="flex items-center justify-center space-x-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                >
                  <i className="fas fa-trash"></i>
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;