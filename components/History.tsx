
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType, Filters } from '../types';
import { CATEGORIES } from '../constants';

interface HistoryProps {
  transactions: Transaction[];
  locale: string;
}

const History: React.FC<HistoryProps> = ({ transactions, locale }) => {
  const [filters, setFilters] = useState<Filters>({
    type: 'ALL',
    category: 'ALL',
    dateRange: 'ALL'
  });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const typeMatch = filters.type === 'ALL' || t.type === filters.type;
      const categoryMatch = filters.category === 'ALL' || t.category === filters.category;
      
      let dateMatch = true;
      const txDate = new Date(t.date);
      const today = new Date();
      
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

  const allCategories = [...CATEGORIES.EXPENSE, ...CATEGORIES.INCOME].map(c => c.name);
  const uniqueCategories = Array.from(new Set(allCategories));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-1">
        <h2 className="text-2xl font-bold text-gray-800">History</h2>
        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-500">
          {filteredTransactions.length} Items
        </span>
      </div>

      {/* Filter Chips */}
      <div className="space-y-3 overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex space-x-2">
          {['ALL', TransactionType.INCOME, TransactionType.EXPENSE].map(type => (
            <button
              key={type}
              onClick={() => setFilters({ ...filters, type: type as any })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.type === type ? 'bg-green-700 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        
        <div className="flex space-x-2">
          {['ALL', 'TODAY', 'WEEK', 'MONTH'].map(range => (
            <button
              key={range}
              onClick={() => setFilters({ ...filters, dateRange: range as any })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.dateRange === range ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilters({ ...filters, category: 'ALL' })}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filters.category === 'ALL' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
            }`}
          >
            All Categories
          </button>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilters({ ...filters, category: cat })}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                filters.category === cat ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-400 italic">No transactions match these filters.</p>
          </div>
        ) : (
          filteredTransactions.map(t => (
            <div key={t.id} className="bg-white p-5 rounded-3xl flex items-center justify-between shadow-sm border border-gray-50 animate-in fade-in duration-300">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${
                  t.type === TransactionType.INCOME ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  <i className={`fas ${t.type === TransactionType.INCOME ? 'fa-plus' : 'fa-minus'} text-xs absolute -mt-4 ml-4`}></i>
                  {CATEGORIES[t.type].find(c => c.name === t.category)?.icon || <i className="fas fa-money-bill"></i>}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{t.category}</p>
                  <p className="text-xs text-gray-400">{t.note || 'No notes'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-black text-lg ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                   {locale === 'pk' ? 'Rs.' : '$'} {t.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.date}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
