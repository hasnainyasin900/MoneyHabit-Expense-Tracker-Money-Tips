
import React, { useState, useEffect, useRef } from 'react';
import { TransactionType, Transaction } from '../types';
import { CATEGORIES, TRANSLATIONS } from '../constants';

interface TransactionFormProps {
  onAdd: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  onUpdate?: (transaction: Transaction) => void;
  editingTransaction?: Transaction | null;
  onClose: () => void;
  locale: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAdd, onUpdate, editingTransaction, onClose, locale }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmount(editingTransaction.amount.toString());
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note);
      setDate(editingTransaction.date);
    }
    setTimeout(() => inputRef.current?.focus(), 300);
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category) return;
    
    const amountNum = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(amountNum) || amountNum <= 0) return;

    if (editingTransaction && onUpdate) {
      onUpdate({
        ...editingTransaction,
        amount: amountNum,
        type,
        category,
        note,
        date
      });
    } else {
      onAdd({
        amount: amountNum,
        type,
        category,
        note,
        date
      });
    }
    onClose();
  };

  const clearAmount = () => {
    setAmount('');
    inputRef.current?.focus();
  };

  const inputClasses = "w-full bg-gray-50 dark:bg-slate-800 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 outline-none font-bold text-sm transition-all dark:text-slate-100 dark:placeholder:text-slate-500";

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xl flex items-end md:items-center justify-center z-[200] p-0 md:p-6 transition-all duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-t-[3rem] md:rounded-[3rem] w-full max-w-xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-20 duration-400 my-auto">
        
        {/* Header */}
        <div className={`p-8 text-white flex justify-between items-center transition-all duration-300 relative overflow-hidden ${
          type === TransactionType.EXPENSE ? 'bg-rose-600' : 'bg-emerald-600'
        }`}>
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{editingTransaction ? 'Edit Entry' : (type === TransactionType.EXPENSE ? strings.expense : strings.income)}</h2>
            <p className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em]">{strings.addEntry}</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Amount Display */}
          <div className="text-center relative">
            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2 block">
              {strings.currency ? `Amount (${strings.currency})` : 'Amount'}
            </label>
            <div className="flex items-center justify-center relative max-w-[14rem] mx-auto">
              <input
                ref={inputRef}
                type="number"
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className={`w-full bg-transparent text-5xl font-black outline-none border-b-4 transition-all pb-2 text-center placeholder:text-gray-100 dark:placeholder:text-slate-800 ${
                  type === TransactionType.EXPENSE ? 'text-rose-600 border-rose-50 dark:border-rose-950/30 focus:border-rose-600' : 'text-emerald-600 border-emerald-50 dark:border-emerald-950/30 focus:border-emerald-600'
                }`}
                required
              />
              {amount && (
                <button 
                  type="button"
                  onClick={clearAmount}
                  className="absolute -right-8 bottom-4 w-7 h-7 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all shadow-sm"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              )}
            </div>
          </div>

          {/* Type Toggle */}
          <div className="bg-gray-100 dark:bg-slate-800 p-1.5 rounded-2xl flex border border-gray-200 dark:border-slate-800/50">
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                type === TransactionType.EXPENSE ? 'bg-white dark:bg-slate-700 text-rose-600 shadow-sm' : 'text-gray-400'
              }`}
            >
              <i className="fas fa-minus-circle text-[10px]"></i>
              <span>Expense</span>
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                type === TransactionType.INCOME ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-gray-400'
              }`}
            >
              <i className="fas fa-plus-circle text-[10px]"></i>
              <span>Income</span>
            </button>
          </div>

          {/* Categories Grid */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-2">Category</label>
            <div className="grid grid-cols-4 gap-2 max-h-44 overflow-y-auto pr-2 custom-scrollbar p-1">
              {(type === TransactionType.EXPENSE ? CATEGORIES.EXPENSE : CATEGORIES.INCOME).map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all border-2 ${
                    category === cat.name 
                    ? (type === TransactionType.EXPENSE ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/20' : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20')
                    : 'border-transparent bg-gray-50 dark:bg-slate-800/50'
                  }`}
                >
                  <span className={`text-xl mb-1 ${category === cat.name ? (type === TransactionType.EXPENSE ? 'text-rose-600' : 'text-emerald-600') : 'text-gray-400'}`}>
                    {cat.icon}
                  </span>
                  <span className={`text-[8px] font-black uppercase tracking-tighter truncate w-full text-center ${category === cat.name ? 'text-gray-800 dark:text-slate-100' : 'text-gray-400'}`}>
                    {cat.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Note and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-2">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Brief description..."
                className={inputClasses}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-widest ml-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={inputClasses}
              />
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white py-5 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-[0.98] ${
              type === TransactionType.EXPENSE ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200 dark:shadow-rose-950/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 dark:shadow-emerald-950/20'
            }`}
          >
            {editingTransaction ? 'Update Entry' : strings.save}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
