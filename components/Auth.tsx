
import React, { useState } from 'react';
import { AppLanguage } from '../types';

interface AuthProps {
  onComplete: (name: string, lang: AppLanguage) => void;
}

const Auth: React.FC<AuthProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'auth' | 'lang'>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('lang');
  };

  const handleLangSelect = (lang: AppLanguage) => {
    onComplete(name || 'User', lang);
  };

  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48 blur-3xl"></div>

      <div className="max-w-md w-full mx-auto relative z-10 space-y-8 animate-in fade-in zoom-in duration-700">
        {step === 'auth' ? (
          <>
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <i className="fas fa-wallet text-emerald-700 text-4xl"></i>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter italic">Rozana Paisa</h1>
              <p className="text-emerald-100/80 font-medium">Smart daily wealth management.</p>
            </div>

            <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] p-10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.3)] border border-white/20">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </h2>

              <form onSubmit={handleAuthSubmit} className="space-y-6">
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-600 focus:bg-white outline-none transition-all font-semibold"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Email or Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="you@example.com"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-600 focus:bg-white outline-none transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-emerald-600 focus:bg-white outline-none transition-all font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-emerald-900/20 hover:bg-emerald-700 transform active:scale-[0.98] transition-all"
                >
                  Continue
                </button>
              </form>

              <div className="mt-8 text-center">
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-emerald-700 font-black text-sm uppercase tracking-wide"
                >
                  {isLogin ? "Create an account" : "I already have an account"}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/95 backdrop-blur-2xl rounded-[3.5rem] p-12 shadow-2xl animate-in slide-in-from-right duration-500">
            <h2 className="text-3xl font-black text-gray-800 text-center mb-4">Select Language</h2>
            <p className="text-gray-500 text-center mb-10 text-sm font-medium">Aap ki tarjeeh kya hai?</p>
            
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleLangSelect('en')}
                className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-500 transition-all text-left"
              >
                <div>
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-emerald-700">English</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Full professional English</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fas fa-globe-americas text-emerald-600 text-xl"></i>
                </div>
              </button>

              <button
                onClick={() => handleLangSelect('pk')}
                className="group flex items-center justify-between p-6 bg-gray-50 rounded-[2rem] hover:bg-emerald-50 border-2 border-transparent hover:border-emerald-500 transition-all text-left"
              >
                <div>
                  <h3 className="text-xl font-black text-gray-800 group-hover:text-emerald-700">اردو / Roman</h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Local context & advice</p>
                </div>
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                  <i className="fas fa-language text-emerald-600 text-xl"></i>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
