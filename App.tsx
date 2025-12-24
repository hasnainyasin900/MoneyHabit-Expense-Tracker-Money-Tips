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
import Settings from './components/Settings';
import { Transaction, AppLanguage } from './types';

const STORAGE_KEY = 'moneyhabit_data_v1';
const AUTH_KEY = 'moneyhabit_auth_v1';
const THEME_KEY = 'moneyhabit_theme';

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [locale, setLocale] = useState<AppLanguage>('en');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Auth Check
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuth(true);
      setUserName(authData.name);
      setLocale(authData.language || 'en');
    }

    // Data Load
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        setTransactions(JSON.parse(savedData));
      } catch (e) {
        console.error("Data error");
      }
    }

    // Theme Load
    const savedTheme = localStorage.getItem(THEME_KEY);
    const dark = savedTheme === 'dark';
    setIsDarkMode(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem(THEME_KEY, newMode ? 'dark' : 'light');
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const handleLanguageChange = (lang: AppLanguage) => {
    setLocale(lang);
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      localStorage.setItem(AUTH_KEY, JSON.stringify({ ...authData, language: lang }));
    }
  };

  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'timestamp'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
    setTransactions([transaction, ...transactions]);
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setTransactions(transactions.map(t => t.id === updatedTx.id ? updatedTx : t));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const openEditForm = (tx: Transaction) => {
    setEditingTransaction(tx);
    setShowForm(true);
  };

  if (!isAuth) {
    return <Auth onComplete={handleOnboardingComplete} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard transactions={transactions} onAddTransaction={() => setShowForm(true)} locale={locale} />;
      case 'transactions':
        return <History transactions={transactions} locale={locale} onEdit={openEditForm} onDelete={handleDeleteTransaction} />;
      case 'analytics':
        return <Reports transactions={transactions} locale={locale} />;
      case 'tips':
        return <Tips locale={locale} />;
      case 'insights':
        return <Insights transactions={transactions} locale={locale} />;
      case 'settings':
        return (
          <Settings 
            currentLanguage={locale} 
            onLanguageChange={handleLanguageChange} 
            userName={userName} 
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
          />
        );
      case 'docs':
        return <Documentation />;
      default:
        return <Dashboard transactions={transactions} onAddTransaction={() => setShowForm(true)} locale={locale} />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} locale={locale}>
      <div className="page-transition">
        {renderContent()}
      </div>
      
      {showForm && (
        <TransactionForm 
          onAdd={handleAddTransaction} 
          onUpdate={handleUpdateTransaction}
          editingTransaction={editingTransaction}
          onClose={() => {
            setShowForm(false);
            setEditingTransaction(null);
          }} 
          locale={locale}
        />
      )}
    </Layout>
  );
};

export default App;