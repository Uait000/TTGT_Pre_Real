import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';

// Типы для наших настроек
type FontSize = 'normal' | 'medium' | 'large';
type Contrast = 'normal' | 'high-contrast' | 'inverted';

// Тип для значения Контекста
interface AccessibilityContextType {
  fontSize: FontSize;
  contrast: Contrast;
  imagesHidden: boolean;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  toggleImages: () => void;
  // Свойства для управления панелью
  isPanelOpen: boolean;
  togglePanel: () => void;
}

// Создаем Контекст
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Создаем "Провайдер" (обертку для сайта)
export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Состояние для панели
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // Состояния для настроек
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('fontSize') as FontSize) || 'normal');
  const [contrast, setContrast] = useState<Contrast>(() => (localStorage.getItem('contrast') as Contrast) || 'normal');
  const [imagesHidden, setImagesHidden] = useState<boolean>(() => localStorage.getItem('imagesHidden') === 'true');

  // Эффект, который применяет классы ко всему сайту (тегу <html>)
  useEffect(() => {
    const root = document.documentElement; // Это <html>

    // Очищаем старые классы
    root.classList.remove('font-size-normal', 'font-size-medium', 'font-size-large');
    root.classList.remove('contrast-normal', 'contrast-high-contrast', 'contrast-inverted');
    root.classList.remove('images-hidden');

    // Добавляем новые
    root.classList.add(`font-size-${fontSize}`);
    root.classList.add(`contrast-${contrast}`);
    if (imagesHidden) {
      root.classList.add('images-hidden');
    }
    
    // Сохраняем в localStorage
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('contrast', contrast);
    localStorage.setItem('imagesHidden', String(imagesHidden));
  }, [fontSize, contrast, imagesHidden]);

  const toggleImages = () => {
    setImagesHidden(prev => !prev);
  };
  
  // Функция для панели
  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  // Оборачиваем в useMemo, чтобы избежать ненужных рендеров
  const value = useMemo(() => ({
    fontSize,
    contrast,
    imagesHidden,
    setFontSize,
    setContrast,
    toggleImages,
    // Передаем новые свойства
    isPanelOpen,
    togglePanel,
  }), [fontSize, contrast, imagesHidden, isPanelOpen]); // <-- isPanelOpen в зависимостях

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Кастомный Хук для легкого доступа к настройкам
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

