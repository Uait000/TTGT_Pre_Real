import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { scheduleApi } from '@/api/schedule';

const ScheduleFileHandler = () => {
  const { filename } = useParams();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadFile = async () => {
      if (!filename) {
        setError('Файл не указан');
        setLoading(false);
        return;
      }

      try {
        const fileContent = await scheduleApi.getScheduleFile(filename);
        setContent(fileContent);
      } catch (err) {
        setError('Не удалось загрузить файл расписания');
        console.error('Ошибка загрузки файла:', err);
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [filename]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Загрузка расписания...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 text-lg mb-4">❌ {error}</div>
        <p className="text-gray-600">Попробуйте обновить страницу или обратитесь к администратору</p>
      </div>
    );
  }

  return (
    <div 
      className="p-4 schedule-content"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default ScheduleFileHandler;