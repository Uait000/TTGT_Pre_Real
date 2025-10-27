import { useState, useEffect } from 'react';
import { vacanciesApi } from '@/api/vacancies';
import type { Vacancy } from '@/api/config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VacanciesListProps {
  onEdit: (vacancy: Vacancy) => void;
  onDelete: (vacancy: Vacancy) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

export default function VacanciesList({
  onEdit,
  onDelete,
  onCreate,
  refreshTrigger,
}: VacanciesListProps) {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadVacancies = async () => {
      setLoading(true);
      try {
        const data = await vacanciesApi.getAll();
        setVacancies(data);
      } catch (error) {
        toast({
          title: 'Ошибка',
          description: 'Не удалось загрузить вакансии',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadVacancies();
  }, [refreshTrigger, toast]);

  if (loading) {
    return <div className="text-center py-8">Загрузка...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление вакансиями</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить вакансию
        </Button>
      </div>

      {vacancies.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">Нет вакансий</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {vacancies.map((vacancy) => (
            <Card key={vacancy.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {vacancy.department}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(vacancy)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDelete(vacancy)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-semibold text-lg mb-2">{vacancy.salary}</p>
                {vacancy.description && (
                  <p className="text-muted-foreground">{vacancy.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
