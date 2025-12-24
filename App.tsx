
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import Reports from './components/Reports';
import Tips from './components/Tips';
import Insights from './components/Insights';
import Documentation from './components/Documentation';
import History from './components/History';
import Auth from './components/Auth';
import { Transaction, AppLanguage } from './types';

const STORAGE_KEY = 'rozana_paisa_data_v3';
const AUTH_KEY = 'rozana_paisa_auth_v3';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [locale, setLocale] = useState<AppLanguage>('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuth(true);
      setUserName(authData.name);
      setLocale(authData.language || 'en');
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setTransactions(JSON.parse(savedData));
      } catch (e) {
        console.error("Data error");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const handleOnboardingComplete = (name: string, lang: AppLanguage) => {
    setIsAuth(true);
    setUserName(name);
    setLocale(lang);
    localStorage.setItem(AUTH_KEY, JSON.stringify({ 
      name, 
      language: lang,
      date: new Date().toISOString() 
    }));
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setTransactions([transaction, ...transactions]);
  };

  if (!isAuth) {
    return <Auth onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} onAddTransaction={() => setShowForm(true)} />;
      case 'transactions':
        return <History transactions={transactions} locale={locale} />;
      case 'analytics':
        return <Reports transactions={transactions} locale={locale} />;
      case 'tips':
        return <Tips locale={locale} />;
      case 'insights':
        return <Insights transactions={transactions} locale={locale} />;
      case 'docs':
        return <Documentation />;
      default:
        return <Dashboard transactions={transactions} onAddTransaction={() => setShowForm(true)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
      
      {showForm && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onClose={() => setShowForm(false)} 
          locale={locale}
        />
      )}
    </Layout>
  );
};

export default App;
