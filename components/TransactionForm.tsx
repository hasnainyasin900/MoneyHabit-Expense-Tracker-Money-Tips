
import React, { useState, useEffect, useRef } from 'react';
import { TransactionType, Transaction } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  onClose: () => void;
  locale: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onClose, locale }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  useEffect(() => {
    // Focus amount input on open
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    onAdd({
      amount: parseFloat(amount),
      type,
      category,
      note,
      date
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-xl flex items-end md:items-center justify-center z-[100] p-0 md:p-4 transition-all duration-300">
      <div className="bg-white rounded-t-[3rem] md:rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 md:zoom-in duration-500">
        <div className={`p-8 text-white flex justify-between items-center transition-colors duration-500 ${
          type === TransactionType.EXPENSE ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <div>
            <h2 className="text-2xl font-black tracking-tight">{type === TransactionType.EXPENSE ? strings.expense : strings.income}</h2>
            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{strings.addEntry}</p>
          </div>
          <button onClick={onClose} className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-white/30 transition-all active:scale-90">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Amount Display */}
          <div className="text-center py-4">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">How much?</label>
            <div className="flex items-center justify-center space-x-2">
              <span className={`text-4xl font-black ${type === TransactionType.EXPENSE ? 'text-rose-600' : 'text-emerald-600'}`}>
                {strings.currency}
              </span>
              <input
                ref={inputRef}
                type="number"
                step="any"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full max-w-[200px] bg-transparent text-6xl font-black outline-none border-b-4 transition-all pb-2 text-center ${
                  type === TransactionType.EXPENSE ? 'text-rose-600 border-rose-100 focus:border-rose-600' : 'text-emerald-600 border-emerald-100 focus:border-emerald-600'
                }`}
                required
              />
            </div>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] border-2 border-gray-50">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === TransactionType.EXPENSE ? 'bg-white text-rose-600 shadow-md' : 'text-gray-400'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                type === TransactionType.INCOME ? 'bg-white text-emerald-600 shadow-md' : 'text-gray-400'
              }`}
            >
              Income
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-3 block">Category</label>
            <div className="grid grid-cols-4 gap-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {(type === TransactionType.EXPENSE ? CATEGORIES.EXPENSE : CATEGORIES.INCOME).map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all border-2 group ${
                    category === cat.name 
                    ? (type === TransactionType.EXPENSE ? 'border-rose-500 bg-rose-50' : 'border-emerald-600 bg-emerald-50')
                    : 'border-gray-50 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span style={{ color: category === cat.name ? undefined : cat.color }} className={`text-2xl mb-2 group-hover:scale-110 transition-transform ${category === cat.name ? (type === TransactionType.EXPENSE ? 'text-rose-600' : 'text-emerald-600') : ''}`}>
                    {cat.icon}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-tighter text-center ${category === cat.name ? 'text-gray-800' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="..."
                className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl p-4 outline-none font-bold text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-gray-200 rounded-2xl p-4 outline-none font-bold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all active:scale-[0.97] ${
              type === TransactionType.EXPENSE ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
            }`}
          >
            {strings.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
