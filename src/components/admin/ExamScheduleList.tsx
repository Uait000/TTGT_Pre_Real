import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';
import examScheduleApi from '@/api/exam-schedule';
import type { ExamSchedule } from '@/api/exam-schedule';
import { BASE_URL } from '@/api/config';

interface ExamScheduleListProps {
  onEdit: (schedule: ExamSchedule) => void;
  onDelete: (schedule: ExamSchedule) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

const ExamScheduleList = ({ onEdit, onDelete, onCreate, refreshTrigger }: ExamScheduleListProps) => {
  const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState<string>('all');

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const data = await examScheduleApi.getAll();
      setSchedules(data);
    } catch (error) {
      console.error('Ошибка загрузки расписания экзаменов:', error);
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [refreshTrigger]);

  const courses = Array.from(new Set(schedules.map(schedule => schedule.course))).sort();
  const filteredSchedules = filterCourse === 'all' 
    ? schedules 
    : schedules.filter(schedule => schedule.course === filterCourse);

  const getCourseColor = (course: string) => {
    const colors: Record<string, string> = {
      '1 курс': 'bg-blue-100 text-blue-800',
      '2 курс': 'bg-green-100 text-green-800',
      '3 курс': 'bg-orange-100 text-orange-800',
      '4 курс': 'bg-purple-100 text-purple-800'
    };
    return colors[course] || 'bg-gray-100 text-gray-800';
  };

  const getFileName = (schedule: ExamSchedule) => {
    if (schedule.files && schedule.files.length > 0) {
      return schedule.files[0].name;
    }
    return schedule.file_name || 'PDF файл';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Я убрал отсюда заголовок H1, так как он есть в родительском файле */}

      {/* Панель управления: Статистика + Фильтры + Кнопка добавления */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-6">
          <div className="text-sm text-gray-600">
            <span className="font-bold text-gray-900 text-lg mr-1">{schedules.length}</span>
            файлов
          </div>
          <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
          <div className="text-sm text-gray-600">
            <span className="font-bold text-green-600 text-lg mr-1">
              {schedules.filter(s => s.is_published).length}
            </span>
            опубликовано
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-400 transition-colors cursor-pointer"
          >
            <option value="all">Все курсы</option>
            {courses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
          
          <Button onClick={onCreate} className="flex items-center space-x-2 shadow-sm hover:shadow-md transition-all">
            <Plus size={16} />
            <span>Добавить файл</span>
          </Button>
        </div>
      </div>

      {/* Список расписаний */}
      <div className="space-y-3">
        {filteredSchedules.length === 0 ? (
          <Card className="text-center py-12 border-dashed">
            <CardContent>
              <div className="text-gray-500 text-base mb-4">
                {filterCourse === 'all' ? 'Нет файлов расписания экзаменов' : 'Нет файлов для этого курса'}
              </div>
              <Button onClick={onCreate} variant="outline" className="mt-2">
                <Plus size={16} className="mr-2" />
                Добавить первый файл
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredSchedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/50 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Контент карточки */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className={`${getCourseColor(schedule.course)} px-2.5 py-0.5 rounded-md font-medium`}>
                        {schedule.course}
                      </Badge>
                      
                      {schedule.is_published ? (
                        <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                          <Eye size={12} className="mr-1" />
                          Опубликовано
                        </div>
                      ) : (
                        <div className="flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                          <EyeOff size={12} className="mr-1" />
                          Черновик
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-primary transition-colors">
                      {schedule.title}
                    </h3>
                    
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500">
                      <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        <FileText size={14} className="mr-1.5" />
                        <span className="max-w-xs truncate">{getFileName(schedule)}</span>
                      </div>
                      <span className="text-xs">
                        Обновлено: {new Date(schedule.updated_at).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex items-center space-x-1 flex-shrink-0 self-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(schedule)}
                      className="h-9 w-9 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                      title="Редактировать"
                    >
                      <Edit size={18} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(schedule)}
                      className="h-9 w-9 text-gray-400 hover:text-red-600 hover:bg-red-50"
                      title="Удалить"
                    >
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Футер статистики */}
      {filteredSchedules.length > 0 && (
        <div className="text-center pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-400">
            Показано {filteredSchedules.length} из {schedules.length} файлов
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamScheduleList;