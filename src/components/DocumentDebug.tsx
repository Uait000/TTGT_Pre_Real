import { useState, useEffect } from 'react';
import documentsApi from '@/api/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentDebug() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllDocuments = async () => {
    setLoading(true);
    try {
      console.log('🔍 Начинаем загрузку документов для отладки...');
      
      // Загружаем через getAll (админский)
      const adminDocs = await documentsApi.getAll();
      console.log('📋 Документы из getAll (админский):', adminDocs);
      
      // Загружаем через getPublicAll (публичный)
      const publicDocs = await documentsApi.getPublicAll();
      console.log('📋 Документы из getPublicAll (публичный):', publicDocs);
      
      setDocuments([...adminDocs, ...publicDocs]);
      
    } catch (error) {
      console.error('❌ Ошибка загрузки документов для отладки:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDocuments();
  }, []);

  if (loading) {
    return <div>Загрузка отладочной информации...</div>;
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Отладка документов ({documents.length} шт.)</CardTitle>
        <Button onClick={loadAllDocuments}>Обновить</Button>
      </CardHeader>
      <CardContent>
        {documents.map((doc, index) => (
          <div key={index} className="border p-3 mb-2 rounded">
            <p><strong>ID:</strong> {doc.id}</p>
            <p><strong>Название:</strong> {doc.title || doc.document_title}</p>
            <p><strong>Раздел:</strong> {doc.section_title}</p>
            <p><strong>Опубликован:</strong> {doc.is_published ? 'Да' : 'Нет'}</p>
            <p><strong>URL файла:</strong> {doc.file_url || 'Нет'}</p>
            <p><strong>Файлы:</strong> {doc.files ? JSON.stringify(doc.files) : 'Нет'}</p>
            <p><strong>Тип:</strong> {doc.type}</p>
            <p><strong>Категория:</strong> {doc.category}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}