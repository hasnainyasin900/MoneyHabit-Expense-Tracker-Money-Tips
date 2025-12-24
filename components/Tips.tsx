
import React, { useState, useEffect } from 'react';
import { DailyTip, AppLanguage } from '../types';
import { INITIAL_TIPS, TRANSLATIONS } from '../constants';
import { generateDailyTips } from '../services/geminiService';

interface TipsProps {
  locale: AppLanguage;
}

const Tips: React.FC<TipsProps> = ({ locale }) => {
  const [tips, setTips] = useState<DailyTip[]>(INITIAL_TIPS);
  const [loading, setLoading] = useState(false);
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  const fetchAITips = async () => {
    setLoading(true);
    const newTips = await generateDailyTips(locale);
    if (newTips && newTips.length > 0) {
      setTips(newTips.map((t: any, idx: number) => ({ ...t, id: `ai-${idx}` })));
    }
    setLoading(false);
  };

  useEffect(() => {
    if (locale === 'en') {
       fetchAITips(); // Auto-load fresh English tips if preferred
    }
  }, [locale]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">{strings.tips}</h2>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Smart money moves daily</p>
        </div>
        <button 
          onClick={fetchAITips}
          disabled={loading}
          className="bg-white text-emerald-600 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-emerald-50 shadow-xl shadow-emerald-900/5 flex items-center justify-center space-x-3 hover:bg-emerald-50 transition-all disabled:opacity-50 active:scale-95"
        >
          <i className={`fas fa-sparkles ${loading ? 'animate-spin' : ''}`}></i>
          <span>{locale === 'en' ? 'Get New Tips' : 'Naye Mashwaray'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {tips.map((tip) => (
          <div key={tip.id} className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-gray-50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className={`absolute top-0 right-0 p-6 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform`}>
               <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <i className="fas fa-lightbulb text-emerald-600"></i>
               </div>
            </div>
            
            <h3 className={`text-2xl font-black mb-4 text-gray-800 tracking-tight ${tip.language === 'Urdu' ? 'urdu-text' : ''}`}>
              {tip.title}
            </h3>
            <p className={`text-gray-500 leading-relaxed font-bold ${tip.language === 'Urdu' ? 'urdu-text text-xl' : 'text-md'}`}>
              {tip.content}
            </p>
            
            <div className="mt-8 flex items-center space-x-6 border-t border-gray-50 pt-6">
              <button className="text-emerald-600 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <i className="far fa-bookmark"></i>
                <span>Save</span>
              </button>
              <button className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center space-x-2 group-hover:scale-105 transition-transform">
                <i className="fas fa-share-alt"></i>
                <span>Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tips;
