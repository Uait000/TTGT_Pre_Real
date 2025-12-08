import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { examPeriodsSettingsApi } from '@/api/exam-periods-settings';
import type { ExamPeriodsSettings, ExamPeriod } from '@/api/exam-periods-settings';

interface ExamPeriodsSettingsFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const COURSES = ['1 курс', '2 курс', '3 курс', '4 курс'];

export default function ExamPeriodsSettingsForm({ open, onClose, onSuccess }: ExamPeriodsSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [settings, setSettings] = useState<ExamPeriodsSettings>({
    periods: COURSES.map(course => ({
      course,
      periods: [{
        date: '',
        groups: ['']
      }]
    }))
  });

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await examPeriodsSettingsApi.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Ошибка загрузки настроек периодов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить настройки периодов',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Очищаем пустые группы перед сохранением
      const cleanedSettings = {
        periods: settings.periods.map(coursePeriod => ({
          ...coursePeriod,
          periods: coursePeriod.periods.map(period => ({
            ...period,
            groups: period.groups.filter(group => group.trim() !== '') // Удаляем пустые группы
          })).filter(period => period.date.trim() !== '' || period.groups.length > 0) // Удаляем пустые периоды
        })).filter(coursePeriod => coursePeriod.periods.length > 0) // Удаляем курсы без периодов
      };

      // Если все курсы удалены, добавляем пустые по умолчанию
      if (cleanedSettings.periods.length === 0) {
        cleanedSettings.periods = COURSES.map(course => ({
          course,
          periods: [{
            date: '',
            groups: ['']
          }]
        }));
      }

      await examPeriodsSettingsApi.updateSettings(cleanedSettings);
      toast({
        title: 'Успешно',
        description: 'Настройки периодов сохранены'
      });
      onSuccess();
    } catch (error) {
      console.error('Ошибка сохранения настроек периодов:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки периодов',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateCoursePeriod = (courseIndex: number, periodIndex: number, field: 'date', value: string) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods[periodIndex][field] = value;
    setSettings(newSettings);
  };

  const updateCourseGroup = (courseIndex: number, periodIndex: number, groupIndex: number, value: string) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods[periodIndex].groups[groupIndex] = value;
    setSettings(newSettings);
  };

  const addPeriod = (courseIndex: number) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods.push({
      date: '',
      groups: ['']
    });
    setSettings(newSettings);
  };

  const removePeriod = (courseIndex: number, periodIndex: number) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods.splice(periodIndex, 1);
    setSettings(newSettings);
  };

  const addGroup = (courseIndex: number, periodIndex: number) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods[periodIndex].groups.push('');
    setSettings(newSettings);
  };

  const removeGroup = (courseIndex: number, periodIndex: number, groupIndex: number) => {
    const newSettings = { ...settings };
    newSettings.periods[courseIndex].periods[periodIndex].groups.splice(groupIndex, 1);
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редактирование периодов экзаменов</DialogTitle>
          <DialogDescription>
            Настройте периоды и группы для каждого курса. Эти данные будут отображаться на странице расписания экзаменов.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {settings.periods.map((coursePeriod, courseIndex) => (
            <div key={coursePeriod.course} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">{coursePeriod.course}</h3>
              
              <div className="space-y-4">
                {coursePeriod.periods.map((period, periodIndex) => (
                  <div key={periodIndex} className="border border-gray-100 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Период {periodIndex + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePeriod(courseIndex, periodIndex)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        disabled={coursePeriod.periods.length === 1}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`period-${courseIndex}-${periodIndex}`}>
                          Период экзаменов (например: "с 15 июня по 28 июня 2025 года")
                        </Label>
                        <Input
                          id={`period-${courseIndex}-${periodIndex}`}
                          value={period.date}
                          onChange={(e) => updateCoursePeriod(courseIndex, periodIndex, 'date', e.target.value)}
                          placeholder="с 15 июня по 28 июня 2025 года"
                        />
                      </div>

                      <div>
                        <Label>Группы</Label>
                        <div className="space-y-2">
                          {period.groups.map((group, groupIndex) => (
                            <div key={groupIndex} className="flex items-center space-x-2">
                              <Input
                                value={group}
                                onChange={(e) => updateCourseGroup(courseIndex, periodIndex, groupIndex, e.target.value)}
                                placeholder="Например: Д-2-1 или ПМ-2-1, ПМ-2-2"
                                className="flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGroup(courseIndex, periodIndex, groupIndex)}
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={period.groups.length === 1}
                              >
                                <Trash2 size={16} />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addGroup(courseIndex, periodIndex)}
                          >
                            <Plus size={16} className="mr-1" />
                            Добавить группу
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addPeriod(courseIndex)}
                >
                  <Plus size={16} className="mr-1" />
                  Добавить период
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить настройки'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}