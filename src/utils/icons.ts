// src/utils/icons.ts
import { 
  School, Car, Home, HeartHandshake, Waves, Banknote, 
  FileText, Download, CreditCard, Building, Users, BookOpen 
} from 'lucide-react';

export const iconComponents = {
  School,
  Car, 
  Home,
  HeartHandshake,
  Waves,
  Banknote,
  FileText,
  Download,
  CreditCard,
  Building,
  Users,
  BookOpen
};

export type IconName = keyof typeof iconComponents;