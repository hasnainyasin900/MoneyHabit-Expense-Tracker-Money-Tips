
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  note: string;
  type: TransactionType;
  date: string;
  timestamp: number;
}

export interface DailyTip {
  id: string;
  title: string;
  content: string;
  language: 'Urdu' | 'Roman Urdu' | 'English';
}

export type AppLanguage = 'en' | 'pk';

export interface AuthUser {
  name: string;
  email?: string;
  isLoggedIn: boolean;
  language?: AppLanguage;
}

export interface Filters {
  type: TransactionType | 'ALL';
  category: string;
  dateRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
}
