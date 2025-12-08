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

export const examPeriodsSettingsApi = {
  async getSettings(): Promise<ExamPeriodsSettings> {
    try {
      const settings = await settingsApi.getSettings(['exam_periods']);
      const item = settings.find(s => s.name === 'exam_periods');
      
      if (item && item.value) {
        return item.value;
      }
      
      // Возвращаем пустые настройки по умолчанию, без лишних групп и дат
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
    } catch (error) {
      console.error('Ошибка загрузки настроек периодов экзаменов:', error);
      throw error;
    }
  },

  async updateSettings(settings: ExamPeriodsSettings): Promise<void> {
    try {
      await settingsApi.updateSettings([
        {
          name: 'exam_periods',
          value: settings,
          enabled: true
        }
      ]);
    } catch (error) {
      console.error('Ошибка сохранения настроек периодов экзаменов:', error);
      throw error;
    }
  },

  async getPeriodsForCourse(course: string): Promise<{date: string, groups: string[]}[]> {
    const settings = await this.getSettings();
    const coursePeriods = settings.periods.find(p => p.course === course);
    return coursePeriods?.periods || [];
  }
};