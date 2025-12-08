import { settingsApi } from './settings';

export interface ExamPeriod {
  course: string;
  periods: {
    date: string;
    groups: string[];
  }[];
}

export interface ExamPeriodsSettings {
  periods: ExamPeriod[];
}

export const examPeriodsPublicApi = {
  async getSettings(): Promise<ExamPeriodsSettings> {
    try {
      // Пытаемся получить настройки через публичный маршрут
      const response = await fetch('/api/settings/exam_periods');
      
      if (response.ok) {
        const data = await response.json();
        return data;
      }
      
      // Если публичный маршрут не работает, возвращаем пустые настройки
      return getDefaultSettings();
    } catch (error) {
      console.error('Ошибка загрузки публичных настроек периодов:', error);
      return getDefaultSettings();
    }
  }
};

// Настройки по умолчанию (чистые, без старых данных)
function getDefaultSettings(): ExamPeriodsSettings {
  return {
    periods: [
      {
        course: '1 курс',
        periods: []
      },
      {
        course: '2 курс',
        periods: []
      },
      {
        course: '3 курс',
        periods: []
      },
      {
        course: '4 курс',
        periods: []
      }
    ]
  };
}