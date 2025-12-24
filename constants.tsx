
import React from 'react';

export const CATEGORIES = {
  EXPENSE: [
    { name: 'Food', icon: <i className="fas fa-utensils"></i>, color: '#ef4444' },
    { name: 'Transport', icon: <i className="fas fa-bus"></i>, color: '#f59e0b' },
    { name: 'Rent', icon: <i className="fas fa-home"></i>, color: '#6366f1' },
    { name: 'Shopping', icon: <i className="fas fa-shopping-bag"></i>, color: '#ec4899' },
    { name: 'Health', icon: <i className="fas fa-heartbeat"></i>, color: '#10b981' },
    { name: 'Education', icon: <i className="fas fa-book"></i>, color: '#8b5cf6' },
    { name: 'Other', icon: <i className="fas fa-ellipsis-h"></i>, color: '#6b7280' },
  ],
  INCOME: [
    { name: 'Salary', icon: <i className="fas fa-money-check-alt"></i>, color: '#22c55e' },
    { name: 'Freelance', icon: <i className="fas fa-laptop-code"></i>, color: '#3b82f6' },
    { name: 'Shop Sale', icon: <i className="fas fa-store"></i>, color: '#f97316' },
    { name: 'Gift', icon: <i className="fas fa-gift"></i>, color: '#a855f7' },
    { name: 'Other', icon: <i className="fas fa-ellipsis-h"></i>, color: '#6b7280' },
  ]
};

export const TRANSLATIONS: any = {
  en: {
    welcome: 'Welcome Back',
    balance: 'Total Balance',
    income: 'Income',
    expense: 'Expense',
    recent: 'Recent Entries',
    history: 'Transaction History',
    reports: 'Financial Reports',
    tips: 'Money Tips',
    ai: 'AI Insights',
    addEntry: 'Add New Entry',
    save: 'Save Entry',
    currency: '',
    settings: 'Settings',
    language: 'Language',
    chooseLanguage: 'Choose your language',
    profile: 'Profile'
  },
  pk: {
    welcome: 'Khush Amdeed',
    balance: 'Kul Balance',
    income: 'Kamai',
    expense: 'Kharcha',
    recent: 'Halia Entries',
    history: 'Tareekh',
    reports: 'Maloomat',
    tips: 'Mashwaray',
    ai: 'AI Mashwara',
    addEntry: 'Nayi Entry',
    save: 'Mehfooz Karen',
    currency: 'Rs.',
    settings: 'Settings',
    language: 'Zuban',
    chooseLanguage: 'Apni zuban chunain',
    profile: 'Profile'
  }
};

export const INITIAL_TIPS = [
  {
    id: '1',
    title: 'Emergency Fund',
    content: 'Apnay paas hamesha 3-6 mahinay ka kharcha bacha kar rakhen.',
    language: 'Roman Urdu' as const
  },
  {
    id: '2',
    title: 'پیسے بچائیں',
    content: 'اپنی آمدنی کا کم از کم 20 فیصد بچانے کی کوشش کریں۔',
    language: 'Urdu' as const
  },
  {
    id: '3',
    title: 'Budgeting Rule',
    content: 'Follow the 50/30/20 rule: 50% Needs, 30% Wants, 20% Savings.',
    language: 'English' as const
  }
];
