import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; 
import { useAccessibility } from '../context/AccessibilityContext';
import './AccessibilityPanel.css'; 
export const AccessibilityPanel = () => {

  const {
    fontSize,
    contrast,
    imagesHidden,
    setFontSize,
    setContrast,
    toggleImages,
    togglePanel, 
    isPanelOpen 
  } = useAccessibility();

  if (!isPanelOpen) {
    return null;
  }

  const el = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    const portalRoot = document.getElementById('portal-root'); 
    
    if (!portalRoot) {
        console.error("CRITICAL: #portal-root element not found in index.html.");
        return; 
    }

    portalRoot.appendChild(el);

    return () => {
      if (portalRoot.contains(el)) {
        portalRoot.removeChild(el);
      }
    };
  }, [el]); 
  const resetSettings = () => {
    setFontSize('normal');
    setContrast('normal');
    if (imagesHidden) {
      toggleImages(); 
    }
  };
  return createPortal(
    (
      <div className="accessibility-panel">
        <div className="access-panel-group">
          <strong>Размер:</strong>
          <button onClick={() => setFontSize('normal')} className={fontSize === 'normal' ? 'active' : ''} aria-label="Обычный размер шрифта">A</button>
          <button onClick={() => setFontSize('medium')} className={fontSize === 'medium' ? 'active' : ''} aria-label="Средний размер шрифта">A</button>
          <button onClick={() => setFontSize('large')} className={fontSize === 'large' ? 'active' : ''} aria-label="Большой размер шрифта">A</button>
        </div>

        <div className="access-panel-group">
          <strong>Контраст:</strong>
          <button onClick={() => setContrast('normal')} className={contrast === 'normal' ? 'active' : ''} aria-label="Обычный контраст">A</button>
          <button onClick={() => setContrast('high-contrast')} className={contrast === 'high-contrast' ? 'active' : ''} aria-label="Высокий контраст (черным по белому)">A</button>
          <button onClick={() => setContrast('inverted')} className={contrast === 'inverted' ? 'active' : ''} aria-label="Инвертированный контраст (белым по черному)">A</button>
        </div>

        <div className="access-panel-group">
          <button onClick={toggleImages} aria-label={imagesHidden ? 'Включить изображения' : 'Выключить изображения'}>
            {imagesHidden ? 'Включить изображения' : 'Выключить изображения'}
          </button>
        </div>
        
        <div className="access-panel-group access-panel-actions">
          <button onClick={resetSettings}>Сбросить</button>
          <button onClick={togglePanel} className="close-panel-btn">Закрыть</button>
        </div>
      </div>
    ),
    el 
  );
};

