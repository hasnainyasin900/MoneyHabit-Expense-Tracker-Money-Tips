
import React from 'react';

const Documentation: React.FC = () => {
  return (
    <div className="space-y-12 pb-12 animate-in fade-in duration-500">
      <section className="space-y-4">
        <h2 className="text-3xl font-black text-green-800">Product Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-green-700">1. Target Audience</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
              <li>Pakistani Students (Pocket money tracking)</li>
              <li>Freelancers (Project income management)</li>
              <li>Small Shop Owners (Daily sale/purchase)</li>
            </ul>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-lg mb-2 text-green-700">2. Monetization (AdMob Only)</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
              <li>Banner Ads: Bottom of all main screens</li>
              <li>Interstitial: After saving 5 transactions</li>
              <li>Rewarded: Unlock PDF Export for 24h</li>
              <li>Native: Mixed in the Transaction list</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">ASO & Growth (Pakistan Market)</h2>
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div>
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-2">Play Store Title</h4>
            <p className="text-green-700 font-semibold">Rozana Paisa – Daily Expense, Money Tips & Budget</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-2">Short Description</h4>
            <p className="text-gray-600">Apnay rozana ke kharchy control karen aur paise bachayen. Daily money tips in Urdu!</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-2">Primary Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {['Expense Tracker Pakistan', 'Urdu Money App', 'Daily Kharcha', 'Budget Planner', 'Paisa App'].map(k => (
                  <span key={k} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">{k}</span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-gray-700 uppercase text-xs tracking-widest mb-2">30-Day Growth Plan</h4>
              <p className="text-xs text-gray-500 leading-relaxed">
                Week 1: Family & Friends (WhatsApp status marketing).<br/>
                Week 2: Freelance Pakistan Facebook Groups.<br/>
                Week 3: Local Shopkeeper outreach in markets.<br/>
                Week 4: Influencer collaboration (Tech reviewers).
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Technical Architecture (Flutter/Mobile)</h2>
        <div className="bg-gray-900 text-green-400 p-8 rounded-3xl font-mono text-xs overflow-x-auto">
          <pre>{`
lib/
├── core/
│   ├── theme/
│   ├── utils/ (Urdu number formatting, etc.)
│   └── constants/
├── data/
│   ├── models/ (Transaction, Category, Tip)
│   ├── datasources/ (SQLite, SharedPreferences)
│   └── repositories/
├── domain/
│   └── entities/
├── presentation/
│   ├── providers/ (State management: Bloc/Riverpod)
│   ├── pages/ (Home, History, Analytics, Tips)
│   └── widgets/ (CustomButton, AdContainer)
└── services/
    ├── ads_service.dart (AdMob init)
    ├── notification_service.dart
    └── ai_service.dart (Gemini API Integration)
          `}</pre>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">DB Schema (SQLite)</h2>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b">
                <th className="pb-2 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Table</th>
                <th className="pb-2 font-bold text-gray-400 uppercase tracking-widest text-[10px]">Columns</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              <tr className="border-b">
                <td className="py-3 font-bold text-green-700">transactions</td>
                <td className="py-3">id (INT PK), amount (REAL), category (TEXT), type (TEXT), note (TEXT), date (DATE), sync_status (INT)</td>
              </tr>
              <tr className="border-b">
                <td className="py-3 font-bold text-green-700">categories</td>
                <td className="py-3">id (INT PK), name (TEXT), icon_path (TEXT), color (TEXT), type (TEXT)</td>
              </tr>
              <tr>
                <td className="py-3 font-bold text-green-700">daily_tips</td>
                <td className="py-3">id (INT PK), title (TEXT), content (TEXT), language (TEXT), date_shown (DATE)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-red-50 p-8 rounded-[2rem] border border-red-100">
        <h3 className="text-red-800 font-bold mb-4 flex items-center space-x-2">
          <i className="fas fa-exclamation-triangle"></i>
          <span>Risk Analysis & Compliance</span>
        </h3>
        <ul className="text-sm text-red-700 space-y-2 list-disc pl-4">
          <li><strong>AdMob Policy:</strong> No accidental clicks. Clear labels "Advertisement".</li>
          <li><strong>Data Privacy:</strong> User financial data stays offline by default. Clear privacy policy.</li>
          <li><strong>AI Hallucinations:</strong> Disclaimer that AI advice is for informational purposes only.</li>
          <li><strong>Performance:</strong> Low-end phone optimization (Pakistani market standard).</li>
        </ul>
      </section>
    </div>
  );
};

export default Documentation;
