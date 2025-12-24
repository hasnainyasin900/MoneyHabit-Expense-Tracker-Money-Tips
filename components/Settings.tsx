
import React from 'react';
import { AppLanguage } from '../types';
import { TRANSLATIONS } from '../constants';

interface SettingsProps {
  currentLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  userName: string;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

const Settings: React.FC<SettingsProps> = ({ 
  currentLanguage, 
  onLanguageChange, 
  userName, 
  isDarkMode, 
  onToggleDarkMode 
}) => {
  const strings = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('moneyhabit_auth_v1');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 animate-fast-zoom">
      <div className="px-2">
        <h2 className="text-3xl font-black text-gray-800 dark:text-slate-100 tracking-tighter uppercase italic">{strings.settings}</h2>
        <p className="text-emerald-600 font-black text-[10px] uppercase tracking-widest mt-1">Preferences & Options</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] shadow-sm border border-gray-50 dark:border-slate-800 space-y-10">
        {/* Profile Section */}
        <div className="flex items-center justify-between pb-8 border-b border-gray-50 dark:border-slate-800">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center">
              <i className="fas fa-user text-xl text-emerald-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white leading-none">{userName}</h3>
              <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Active Account</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Appearance Toggle */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Appearance</label>
            <button
              onClick={onToggleDarkMode}
              className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${
                isDarkMode 
                ? 'border-emerald-600 bg-slate-800 text-white' 
                : 'border-gray-100 bg-gray-50 text-gray-800'
              }`}
            >
              <div className="flex items-center space-x-4">
                <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'} text-lg`}></i>
                <span className="font-black text-xs uppercase tracking-widest">{isDarkMode ? 'Dark' : 'Light'} Mode</span>
              </div>
              <div className={`w-10 h-5 rounded-full relative transition-colors ${isDarkMode ? 'bg-emerald-600' : 'bg-gray-300'}`}>
                <div 
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all`} 
                  style={{ left: isDarkMode ? '1.375rem' : '0.125rem' }}
                ></div>
              </div>
            </button>
          </div>

          {/* Language Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{strings.language}</label>
            <div className="flex gap-2">
              {[
                { id: 'en', label: 'English' },
                { id: 'pk', label: 'اردو / Roman' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => onLanguageChange(lang.id as AppLanguage)}
                  className={`flex-1 p-5 rounded-3xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                    currentLanguage === lang.id 
                    ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600' 
                    : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-400'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Support Card */}
      <div className="p-8 bg-emerald-900 dark:bg-emerald-950 rounded-[2.5rem] text-white overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="text-xl font-black italic tracking-tighter">MoneyHabit Help</h4>
            <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mt-1">Need help managing? Talk to us.</p>
          </div>
          <button className="bg-white text-emerald-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">
            Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
