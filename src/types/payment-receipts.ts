// src/types/payment-receipts.ts
export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  mime?: string;
}

export interface PaymentReceipt {
  id: number;
  title: string;
  file_url: string;
  file_name: string;
  icon: string;
  gradient: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  files?: FileInfo[];
  publish_date?: number;
}

export const RECEIPT_GRADIENTS = [
  // Синие градиенты
  'from-blue-500 to-blue-700',
  'from-sky-500 to-blue-600',
  'from-indigo-500 to-purple-600',
  'from-blue-400 to-cyan-500',
  'from-violet-500 to-purple-700',
  
  // Зеленые градиенты
  'from-emerald-500 to-green-600',
  'from-teal-500 to-cyan-600',
  'from-green-500 to-emerald-600',
  'from-lime-500 to-green-600',
  'from-emerald-400 to-teal-500',
  
  // Оранжевые/красные градиенты
  'from-amber-500 to-orange-600',
  'from-orange-500 to-red-600',
  'from-red-500 to-pink-600',
  'from-rose-500 to-pink-600',
  'from-amber-400 to-orange-500',
  
  // Фиолетовые/розовые градиенты
  'from-purple-500 to-pink-600',
  'from-fuchsia-500 to-pink-600',
  'from-pink-500 to-rose-600',
  'from-purple-400 to-fuchsia-500',
  'from-violet-400 to-purple-500',
  
  // Дополнительные уникальные градиенты
  'from-cyan-500 to-blue-500',
  'from-blue-500 to-indigo-500',
  'from-indigo-400 to-blue-500',
  'from-emerald-400 to-cyan-400',
  'from-teal-400 to-emerald-400',
  'from-amber-400 to-yellow-400',
  'from-orange-400 to-amber-400',
  'from-red-400 to-orange-400',
  'from-rose-400 to-pink-400',
  'from-fuchsia-400 to-purple-400',
  'from-violet-300 to-purple-400',
  'from-purple-300 to-indigo-400'
] as const;

export const RECEIPT_ICONS = [
  'School', 'Car', 'Home', 'HeartHandshake', 'Waves', 'Banknote', 
  'FileText', 'Download', 'CreditCard', 'Building', 'Users', 'BookOpen'
] as const;

export type IconName = typeof RECEIPT_ICONS[number];
export type GradientName = typeof RECEIPT_GRADIENTS[number];