import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import { BASE_URL } from '@/api/config';

interface ContentSection {
  id: string;
  title: string;
  text: string;
  image?: File | string;
}

export default function SiteContentEditor() {
  const [sections, setSections] = useState<ContentSection[]>([
    { id: '1', title: 'Заголовок главной страницы', text: '', image: undefined },
    { id: '2', title: 'О нас', text: '', image: undefined },
    { id: '3', title: 'Контакты', text: '', image: undefined },
  ]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSectionChange = (id: string, field: keyof ContentSection, value: string | File | null) => {
    setSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      for (const section of sections) {
        if (section.image instanceof File) {
          const formData = new FormData();
          formData.append('file', section.image);
          formData.append('path', 'site-content');

          const response = await fetch(`${BASE_URL}/files/upload`, {
            method: 'POST',
            headers: {
              'X-Authorization': localStorage.getItem('adminToken') || '',
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }
        }
      }

      toast({
        title: 'Успешно',
        description: 'Контент сайта обновлен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось обновить контент',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Редактирование контента сайта</h2>
          <p className="text-muted-foreground">Быстро изменяйте текст и изображения на сайте</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Сохранение...' : 'Сохранить изменения'}
        </Button>
      </div>

      <div className="grid gap-6">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>Редактируйте текст и изображения для этого раздела</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`title-${section.id}`}>Заголовок</Label>
                <Input
                  id={`title-${section.id}`}
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)}
                  placeholder="Введите заголовок"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`text-${section.id}`}>Текст</Label>
                <Textarea
                  id={`text-${section.id}`}
                  value={section.text}
                  onChange={(e) => handleSectionChange(section.id, 'text', e.target.value)}
                  placeholder="Введите текст"
                  rows={4}
                />
              </div>

              <FileUpload
                value={section.image}
                onChange={(file) => handleSectionChange(section.id, 'image', file)}
                label="Изображение"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
