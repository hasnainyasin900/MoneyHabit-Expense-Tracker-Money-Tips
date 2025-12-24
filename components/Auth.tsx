
import React, { useState } from 'react';
import { AppLanguage } from '../types';

interface AuthProps {
  onComplete: (name: string, lang: AppLanguage) => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'auth' | 'lang'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('A valid email is required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be 6+ characters.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Name is required.');
      return;
    }

    if (isLogin) {
      setStep('lang');
    } else {
      setSuccessMsg('Account ready! You can now sign in.');
      setIsLogin(true);
      setPassword('');
    }
  };

  const handleLangSelect = (lang: AppLanguage) => {
    onComplete(name || email.split('@')[0] || 'User', lang);
  };

  const inputClasses = "w-full px-6 py-4 bg-gray-50 dark:bg-slate-800 border-2 border-transparent rounded-2xl focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all font-semibold text-gray-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
      
      <div className="max-w-md w-full mx-auto relative z-10 space-y-8 animate-in fade-in zoom-in duration-500">
        {step === 'auth' ? (
          <>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-2xl transform rotate-3">
                <i className="fas fa-wallet text-emerald-700 text-3xl"></i>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter italic">MoneyHabit</h1>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-10 shadow-2xl border border-white/5">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8 text-center">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>

              {error && (
                <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold border border-rose-100 dark:border-rose-900/30 flex items-center space-x-2 animate-shake">
                  <i className="fas fa-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-xs font-bold border border-emerald-100 dark:border-emerald-900/30 flex items-center space-x-2">
                  <i className="fas fa-check-circle"></i>
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ali Khan"
                      className={inputClasses}
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                >
                  {isLogin ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                    setSuccessMsg('');
                  }}
                  className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase tracking-widest hover:underline"
                >
                  {isLogin ? "New here? Create account" : "Already a member? Sign In"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl animate-in slide-in-from-right duration-500 text-center">
            <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2 tracking-tight">Preferred Language</h2>
            <p className="text-gray-500 dark:text-slate-400 mb-10 text-sm">Choose how you want the app to look.</p>
            
            <div className="space-y-3">
              <button
                onClick={() => handleLangSelect('en')}
                className="w-full group flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl hover:border-emerald-500 border-2 border-transparent transition-all shadow-sm"
              >
                <div className="text-left">
                  <h3 className="text-lg font-black text-gray-800 dark:text-white">English</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Standard Mode</p>
                </div>
                <i className="fas fa-globe-americas text-emerald-600 text-xl"></i>
              </button>

              <button
                onClick={() => handleLangSelect('pk')}
                className="w-full group flex items-center justify-between p-6 bg-gray-50 dark:bg-slate-800 rounded-3xl hover:border-emerald-500 border-2 border-transparent transition-all shadow-sm"
              >
                <div className="text-left">
                  <h3 className="text-lg font-black text-gray-800 dark:text-white">اردو / Roman</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Local Context</p>
                </div>
                <i className="fas fa-language text-emerald-600 text-xl"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
