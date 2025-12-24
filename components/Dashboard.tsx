
import React from 'react';
import { Transaction, TransactionType } from '../types';
import { CATEGORIES } from '../constants';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddTransaction }) => {
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
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="relative z-10">
          <p className="text-green-200 text-sm font-medium mb-1 uppercase tracking-wider">Kul Balance (Total)</p>
          <h2 className="text-5xl font-extrabold mb-8 leading-tight">Rs. {balance.toLocaleString()}</h2>
          
          <div className="flex justify-between items-center bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500/30 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-down text-green-300"></i>
              </div>
              <div>
                <p className="text-xs text-green-200 uppercase">Kamai (In)</p>
                <p className="font-bold">Rs. {totalIncome.toLocaleString()}</p>
              </div>
            </div>
            <div className="w-[1px] h-8 bg-white/20"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center">
                <i className="fas fa-arrow-up text-red-300"></i>
              </div>
              <div>
                <p className="text-xs text-green-200 uppercase">Kharcha (Out)</p>
                <p className="font-bold">Rs. {totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <button 
        onClick={onAddTransaction}
        className="w-full bg-white border-2 border-dashed border-green-700/30 p-6 rounded-3xl flex items-center justify-center space-x-3 text-green-800 hover:bg-green-50 transition-colors group shadow-sm"
      >
        <div className="w-10 h-10 bg-green-700 text-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <i className="fas fa-plus"></i>
        </div>
        <span className="font-bold text-lg">Add New Transaction</span>
      </button>

      {/* Recent History */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xl font-bold text-gray-800">Recent Entry</h3>
          <button className="text-green-700 font-semibold text-sm">See All</button>
        </div>
        
        {recentTransactions.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-clipboard-list text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500 font-medium">Koi transaction nahi hai.<br/>Nayi entry add karen!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map(t => {
              const catInfo = getCategoryIcon(t.category, t.type);
              return (
                <div key={t.id} className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner"
                      style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                    >
                      {catInfo.icon}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{t.category}</p>
                      <p className="text-xs text-gray-400">{t.note || 'No notes'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === TransactionType.INCOME ? '+' : '-'} Rs. {t.amount.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400">{t.date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ad Placeholder */}
      <div className="bg-gray-200 border border-gray-300 rounded-xl p-2 text-center text-[10px] text-gray-400 h-16 flex items-center justify-center uppercase tracking-widest">
        Banner Ad Placement
      </div>
    </div>
  );
};

export default Dashboard;
