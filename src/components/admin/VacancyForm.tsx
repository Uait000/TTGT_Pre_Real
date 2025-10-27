import { useState, useEffect } from 'react';
import { vacanciesApi, type CreateVacancyPayload } from '@/api/vacancies';
import type { Vacancy } from '@/api/config';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface VacancyFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editVacancy?: Vacancy | null;
}

export default function VacancyForm({ open, onClose, onSuccess, editVacancy }: VacancyFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateVacancyPayload>({
    title: '',
    department: '',
    salary: '',
    description: '',
  });

  useEffect(() => {
    if (editVacancy) {
      setFormData({
        title: editVacancy.title,
        department: editVacancy.department,
        salary: editVacancy.salary,
        description: editVacancy.description || '',
      });
    } else {
      setFormData({
        title: '',
        department: '',
        salary: '',
        description: '',
      });
    }
  }, [editVacancy, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.department.trim() || !formData.salary.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (editVacancy) {
        await vacanciesApi.update(editVacancy.id, formData);
        toast({
          title: 'Успешно',
          description: 'Вакансия обновлена',
        });
      } else {
        await vacanciesApi.create(formData);
        toast({
          title: 'Успешно',
          description: 'Вакансия создана',
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось сохранить вакансию',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editVacancy ? 'Редактировать вакансию' : 'Создать новую вакансию'}
          </DialogTitle>
          <DialogDescription>
            Заполните форму для {editVacancy ? 'обновления' : 'создания'} вакансии
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Название должности *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Например: Преподаватель информатики"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Отделение *</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="Например: Отделение информационных технологий"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="salary">Зарплата *</Label>
            <Input
              id="salary"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              placeholder="Например: От 30 000 руб."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Дополнительная информация о вакансии"
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Сохранение...' : editVacancy ? 'Обновить' : 'Создать'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
