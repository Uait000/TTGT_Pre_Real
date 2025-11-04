import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
type FontSize = 'normal' | 'medium' | 'large';
type Contrast = 'normal' | 'high-contrast' | 'inverted';

interface AccessibilityContextType {
  fontSize: FontSize;
  contrast: Contrast;
  imagesHidden: boolean;
  setFontSize: (size: FontSize) => void;
  setContrast: (contrast: Contrast) => void;
  toggleImages: () => void;
  isPanelOpen: boolean;
  togglePanel: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  

  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem('fontSize') as FontSize) || 'normal');
  const [contrast, setContrast] = useState<Contrast>(() => (localStorage.getItem('contrast') as Contrast) || 'normal');
  const [imagesHidden, setImagesHidden] = useState<boolean>(() => localStorage.getItem('imagesHidden') === 'true');

  useEffect(() => {
    const root = document.documentElement; 

    root.classList.remove('font-size-normal', 'font-size-medium', 'font-size-large');
    root.classList.remove('contrast-normal', 'contrast-high-contrast', 'contrast-inverted');
    root.classList.remove('images-hidden');

    root.classList.add(`font-size-${fontSize}`);
    root.classList.add(`contrast-${contrast}`);
    if (imagesHidden) {
      root.classList.add('images-hidden');
    }
    
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('contrast', contrast);
    localStorage.setItem('imagesHidden', String(imagesHidden));
  }, [fontSize, contrast, imagesHidden]);

  const toggleImages = () => {
    setImagesHidden(prev => !prev);
  };

  const togglePanel = () => {
    setIsPanelOpen(prev => !prev);
  };

  const value = useMemo(() => ({
    fontSize,
    contrast,
    imagesHidden,
    setFontSize,
    setContrast,
    toggleImages,
    isPanelOpen,
    togglePanel,
  }), [fontSize, contrast, imagesHidden, isPanelOpen]);

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

