
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', icon: 'fa-home', label: 'Home' },
    { id: 'transactions', icon: 'fa-exchange-alt', label: 'History' },
    { id: 'analytics', icon: 'fa-chart-pie', label: 'Reports' },
    { id: 'tips', icon: 'fa-lightbulb', label: 'Tips' },
    { id: 'insights', icon: 'fa-brain', label: 'AI Insights' },
    { id: 'docs', icon: 'fa-file-alt', label: 'App Info' }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50 md:flex-row">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-green-700 text-white p-6 shadow-xl">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <i className="fas fa-wallet text-green-700 text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Rozana Paisa</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id ? 'bg-white text-green-700 shadow-md' : 'hover:bg-green-600'
              }`}
            >
              <i className={`fas ${item.icon}`}></i>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
        {/* Header - Mobile */}
        <header className="md:hidden bg-green-700 text-white p-4 flex justify-between items-center sticky top-0 z-10 shadow-md">
          <div className="flex items-center space-x-2">
            <i className="fas fa-wallet text-xl"></i>
            <span className="font-bold text-lg">Rozana Paisa</span>
          </div>
          <button className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center">
            <i className="fas fa-user text-sm"></i>
          </button>
        </header>

        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Navigation - Mobile */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around p-2 z-10 shadow-2xl">
        {navItems.slice(0, 4).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              activeTab === item.id ? 'text-green-700' : 'text-gray-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg mb-1`}></i>
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={() => setActiveTab('insights')}
          className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
            activeTab === 'insights' ? 'text-green-700' : 'text-gray-400'
          }`}
        >
          <i className="fas fa-brain text-lg mb-1"></i>
          <span className="text-[10px] font-medium">AI</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
