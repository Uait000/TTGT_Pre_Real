import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; 
import { useAccessibility } from '../context/AccessibilityContext';
import './AccessibilityPanel.css'; // Подключаем стили

// Убираем ": React.FC", чтобы исправить ошибку TypeScript
export const AccessibilityPanel = () => {

  const {
    fontSize,
    contrast,
    imagesHidden,
    setFontSize,
    setContrast,
    toggleImages,
    togglePanel, 
    isPanelOpen // <-- Получаем состояние
  } = useAccessibility();

  // Если панель не открыта, компонент ничего не рендерит (null)
  if (!isPanelOpen) {
    return null;
  }

  // Создаем DOM-элемент для портала ОДИН РАЗ
  const el = useMemo(() => document.createElement('div'), []);

  useEffect(() => {
    // Находим portal-root ВНУТРИ useEffect
    const portalRoot = document.getElementById('portal-root'); 
    
    if (!portalRoot) {
        console.error("CRITICAL: #portal-root element not found in index.html.");
        return; // Если не нашли, ничего не делаем
    }
    
    // Добавляем наш элемент в 'portal-root' при монтировании
    portalRoot.appendChild(el);

    // Убираем наш элемент при размонтировании
    return () => {
      if (portalRoot.contains(el)) {
        portalRoot.removeChild(el);
      }
    };
  }, [el]); // Зависимость [el] гарантирует, что эффект сработает только один раз


  // Функция для сброса всех настроек
  const resetSettings = () => {
    setFontSize('normal');
    setContrast('normal');
    if (imagesHidden) {
      toggleImages(); // Выключаем, если было включено
    }
  };

  // Оборачиваем всю панель в createPortal
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
    el // Рендерим в наш созданный 'div'
  );
};

