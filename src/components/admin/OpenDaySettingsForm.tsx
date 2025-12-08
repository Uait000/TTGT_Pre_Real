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
import { Plus, Trash2, Loader2, Calendar } from 'lucide-react';
import { settingsApi, type OpenDaySettings } from '@/api/settings';

interface OpenDaySettingsFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function OpenDaySettingsForm({ open, onClose, onSuccess }: OpenDaySettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Дефолтное состояние
  const defaultState: OpenDaySettings = {
    title: '',
    remote_dates: [{ date: '', time: '' }],
    in_person_dates: [{ date: '', time: '' }]
  };

  const [formData, setFormData] = useState<OpenDaySettings>(defaultState);

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      console.log('📥 Загрузка настроек дня открытых дверей...');
      const settings = await settingsApi.getOpenDaySettings();
      console.log('✅ Настройки загружены:', settings);
      
      // ИСПРАВЛЕНИЕ: Проверяем, что settings не null
      if (settings) {
        setFormData(settings);
      } else {
        // Если настроек нет, используем дефолтные пустые поля
        setFormData(defaultState);
      }
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить настройки',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    // Добавляем проверку на существование formData на всякий случай
    if (!formData || !formData.title.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните заголовок',
        variant: 'destructive'
      });
      return;
    }

    // Проверка дат
    const allDates = [...formData.remote_dates, ...formData.in_person_dates];
    for (const dateItem of allDates) {
      if (!dateItem.date.trim() || !dateItem.time.trim()) {
        toast({
          title: 'Ошибка',
          description: 'Пожалуйста, заполните все даты и время',
          variant: 'destructive'
        });
        return;
      }
    }

    setSaving(true);
    try {
      console.log('💾 Сохранение настроек...');
      await settingsApi.updateOpenDaySettings(formData);
      
      toast({
        title: 'Успешно',
        description: 'Настройки дня открытых дверей сохранены'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Ошибка сохранения настроек:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить настройки',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const addRemoteDate = () => {
    setFormData(prev => ({
      ...prev,
      remote_dates: [...prev.remote_dates, { date: '', time: '' }]
    }));
  };

  const removeRemoteDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      remote_dates: prev.remote_dates.filter((_, i) => i !== index)
    }));
  };

  const updateRemoteDate = (index: number, field: 'date' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      remote_dates: prev.remote_dates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const addInPersonDate = () => {
    setFormData(prev => ({
      ...prev,
      in_person_dates: [...prev.in_person_dates, { date: '', time: '' }]
    }));
  };

  const removeInPersonDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      in_person_dates: prev.in_person_dates.filter((_, i) => i !== index)
    }));
  };

  const updateInPersonDate = (index: number, field: 'date' | 'time', value: string) => {
    setFormData(prev => ({
      ...prev,
      in_person_dates: prev.in_person_dates.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleClose = () => {
    setFormData(defaultState);
    onClose();
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2">Загрузка настроек...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Если вдруг formData null (защита от краша), не рендерим форму
  if (!formData) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Настройки дня открытых дверей</DialogTitle>
          <DialogDescription>
            Измените заголовок и даты проведения дней открытых дверей
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Заголовок */}
          <div className="space-y-2">
            <Label htmlFor="title">Заголовок страницы *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Графики проведения 2024/2025 учебный год"
              required
            />
          </div>

          {/* Дистанционные даты */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Дистанционные даты</Label>
              <Button type="button" onClick={addRemoteDate} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Добавить дату
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.remote_dates.map((dateItem, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <Label htmlFor={`remote-date-${index}`}>Дата</Label>
                    </div>
                    <Input
                      id={`remote-date-${index}`}
                      value={dateItem.date}
                      onChange={(e) => updateRemoteDate(index, 'date', e.target.value)}
                      placeholder="31 октября 2024 года"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`remote-time-${index}`}>Время</Label>
                    <Input
                      id={`remote-time-${index}`}
                      value={dateItem.time}
                      onChange={(e) => updateRemoteDate(index, 'time', e.target.value)}
                      placeholder="13:00"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRemoteDate(index)}
                    disabled={formData.remote_dates.length === 1}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Очные даты */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Очные даты</Label>
              <Button type="button" onClick={addInPersonDate} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Добавить дату
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.in_person_dates.map((dateItem, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <Label htmlFor={`inperson-date-${index}`}>Дата</Label>
                    </div>
                    <Input
                      id={`inperson-date-${index}`}
                      value={dateItem.date}
                      onChange={(e) => updateInPersonDate(index, 'date', e.target.value)}
                      placeholder="30 ноября 2024 года"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`inperson-time-${index}`}>Время</Label>
                    <Input
                      id={`inperson-time-${index}`}
                      value={dateItem.time}
                      onChange={(e) => updateInPersonDate(index, 'time', e.target.value)}
                      placeholder="10:00"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeInPersonDate(index)}
                    disabled={formData.in_person_dates.length === 1}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={saving}>
              Отмена
            </Button>
            <Button type="submit" disabled={saving}>
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
        </form>
      </DialogContent>
    </Dialog>
  );
}