
import React, { useState, useEffect } from 'react';
import { Transaction, AppLanguage } from '../types';
import { generateSmartInsights } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';

interface InsightsProps {
  transactions: Transaction[];
  locale: AppLanguage;
}

const Insights: React.FC<InsightsProps> = ({ transactions, locale }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const strings = TRANSLATIONS[locale] || TRANSLATIONS.pk;

  const getInsights = async () => {
    if (transactions.length < 3) {
      setInsight(locale === 'en' 
        ? "Add at least 3 entries to get smart insights." 
        : "Insights ke liye kam az kam 3 transactions add karen.");
      return;
    }
    setLoading(true);
    const result = await generateSmartInsights(transactions, locale);
    setInsight(result || (locale === 'en' ? 'Unavailable.' : 'Abhi dastyab nahi.'));
    setLoading(false);
  };

  useEffect(() => {
    getInsights();
  }, [locale]);

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-200 mb-6">
          <i className="fas fa-brain text-4xl"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-800 tracking-tighter uppercase italic">{strings.ai}</h2>
        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest max-w-xs mx-auto">
          {locale === 'en' ? 'AI analysis of your wealth journey.' : 'Gemini AI aap ke kharchon ka tajzia karta hai.'}
        </p>
      </div>

      <div className="bg-white p-10 rounded-[3.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-gray-50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-emerald-700 font-black uppercase tracking-widest text-xs animate-pulse">Consulting AI Advisor...</p>
          </div>
        ) : (
          <div className="space-y-8 relative z-10">
            <div className="prose prose-emerald">
              <div className={`text-gray-700 leading-relaxed whitespace-pre-wrap font-bold text-lg ${locale === 'pk' ? 'urdu-text' : ''}`}>
                {insight}
              </div>
            </div>
            
            <button 
              onClick={getInsights}
              className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center space-x-3 active:scale-95"
            >
              <i className="fas fa-magic"></i>
              <span>{locale === 'en' ? 'Refresh Insights' : 'Dubara Check Karen'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-emerald-50/50 p-8 rounded-[2rem] flex items-start space-x-5 border border-emerald-100">
        <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
          <i className="fas fa-shield-alt text-emerald-600"></i>
        </div>
        <p className="text-xs text-emerald-900/60 leading-relaxed font-bold">
          <strong>SECURE:</strong> {locale === 'en' 
            ? 'Your data analysis is private. AI advice is for guidance only.' 
            : 'Aap ka data mehfooz hai. AI mashwara sirf rehnumayi ke liye hai.'}
        </p>
      </div>
    </div>
  );
};

export default Insights;
