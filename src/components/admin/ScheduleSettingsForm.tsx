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
import { Loader2, Calendar } from 'lucide-react';
import { settingsApi } from '@/api/settings';

interface ScheduleSettingsFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ScheduleSettingsForm({ open, onClose, onSuccess }: ScheduleSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const [sessionPeriod, setSessionPeriod] = useState('');

  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      console.log('📥 Загрузка настроек периода сессии...');
      const settings = await settingsApi.getScheduleSettings();
      console.log('✅ Настройки периода сессии загружены:', settings);
      setSessionPeriod(settings.session_period);
    } catch (error) {
      console.error('❌ Ошибка загрузки настроек:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить настройки периода сессии',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация
    if (!sessionPeriod.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните период сессии',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      console.log('💾 Сохранение настроек периода сессии...');
      await settingsApi.updateScheduleSettings({
        session_period: sessionPeriod.trim()
      });
      
      toast({
        title: 'Успешно',
        description: 'Период сессии сохранен'
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('❌ Ошибка сохранения настроек:', error);
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить период сессии',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setSessionPeriod('');
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Настройки периода сессии</DialogTitle>
          <DialogDescription>
            Установите период сессии для заочного отделения. Этот текст будет отображаться над всеми расписаниями сессий.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Период сессии */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Label htmlFor="session_period">Период сессии *</Label>
            </div>
            <Input
              id="session_period"
              value={sessionPeriod}
              onChange={(e) => setSessionPeriod(e.target.value)}
              placeholder="c 15 сентября 2025 г. по 27 сентября 2025 г.:"
              required
            />
            <p className="text-sm text-gray-500">
              Этот текст будет отображаться над всеми расписаниями сессий заочного отделения
            </p>
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
                'Сохранить период'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}