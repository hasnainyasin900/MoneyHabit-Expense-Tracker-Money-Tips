import React from 'react';
import { TRANSLATIONS } from '../constants';
import { AppLanguage } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  locale: AppLanguage;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, locale }) => {
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;
  
  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: locale === 'en' ? 'Home' : 'Ghar' },
    { id: 'transactions', icon: 'fa-exchange-alt', label: locale === 'en' ? 'History' : 'Tareekh' },
    { id: 'analytics', icon: 'fa-chart-pie', label: locale === 'en' ? 'Reports' : 'Report' },
    { id: 'tips', icon: 'fa-lightbulb', label: locale === 'en' ? 'Tips' : 'Mashwaray' },
    { id: 'insights', icon: 'fa-brain', label: locale === 'en' ? 'AI' : 'AI' },
    { id: 'settings', icon: 'fa-cog', label: locale === 'en' ? 'Settings' : 'Settings' }
  ];

  return (
    <div className={`flex flex-col h-screen bg-gray-50 dark:bg-slate-950 md:flex-row transition-colors duration-300 ${locale === 'pk' ? 'urdu-text' : ''}`}>
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-emerald-900 dark:bg-emerald-950 text-white p-8 shadow-2xl relative">
        <div className="flex items-center space-x-4 mb-12">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
            <i className="fas fa-wallet text-emerald-800 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter italic leading-none">MoneyHabit</h1>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400">Wealth OS</span>
          </div>
        </div>
        
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest group ${
                activeTab === item.id 
                ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-950/20 translate-x-1' 
                : 'text-emerald-100/50 hover:bg-white/5 hover:text-emerald-100'
              }`}
            >
              <i className={`fas ${item.icon} ${activeTab === item.id ? 'animate-bounce' : ''}`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-10">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2">Region</p>
            <div className="flex items-center space-x-3">
              <i className={`fas ${locale === 'en' ? 'fa-globe-americas' : 'fa-language'}`}></i>
              <span className="font-bold text-xs">{locale === 'en' ? 'Global / EN' : 'Pakistan / PK'}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0 relative">
        <header className="md:hidden bg-emerald-900 dark:bg-emerald-950 text-white p-6 flex justify-between items-center sticky top-0 z-10 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
              <i className="fas fa-wallet text-emerald-900 text-lg"></i>
            </div>
            <span className="font-black text-lg italic tracking-tighter">MoneyHabit</span>
          </div>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 active:scale-90 transition-all ${activeTab === 'settings' ? 'bg-emerald-600' : ''}`}
          >
            <i className="fas fa-cog text-xl"></i>
          </button>
        </header>

        <div className="max-w-6xl mx-auto p-6 md:p-12">
          {children}
        </div>
      </main>

      {/* Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-20 bg-emerald-900/90 dark:bg-emerald-950/90 backdrop-blur-xl rounded-[2.5rem] flex justify-around items-center p-2 z-[90] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10">
        {navItems.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all ${
              activeTab === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-emerald-100/40'
            }`}
          >
            <i className={`fas ${item.icon} text-lg mb-1`}></i>
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;