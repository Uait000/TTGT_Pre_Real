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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FileText, Upload, X, Loader2, Plus, Trash2 } from 'lucide-react';
import examScheduleApi from '@/api/exam-schedule';
import type { ExamSchedule, CreateExamSchedulePayload, ExamGroup, GroupFile } from '@/api/exam-schedule';
import { filesApi } from '@/api/files';

interface ExamScheduleFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editSchedule?: ExamSchedule | null;
}

const COURSES = ['1 курс', '2 курс', '3 курс', '4 курс'];

export default function ExamScheduleForm({ open, onClose, onSuccess, editSchedule }: ExamScheduleFormProps) {
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [groups, setGroups] = useState<ExamGroup[]>([]);
  const [groupFiles, setGroupFiles] = useState<Map<string, File>>(new Map());
  const { toast } = useToast();

  const [formData, setFormData] = useState<CreateExamSchedulePayload>({
    title: '',
    course: COURSES[0],
    date_range: '',
    groups: [],
    is_published: true,
    files: [],
    publish_date: Math.floor(Date.now() / 1000),
    group_files: []
  });

  useEffect(() => {
    if (open && editSchedule) {
      setFormData({
        title: editSchedule.title,
        course: editSchedule.course,
        date_range: editSchedule.date_range || '',
        groups: editSchedule.groups || [],
        is_published: editSchedule.is_published,
        files: editSchedule.files ? editSchedule.files.map(f => f.id) : [],
        publish_date: editSchedule.publish_date || Math.floor(Date.now() / 1000),
        group_files: editSchedule.group_files || []
      });
      setGroups(editSchedule.groups || []);
      setPdfFile(null);
      setGroupFiles(new Map());
    } else if (open && !editSchedule) {
      setFormData({
        title: '',
        course: COURSES[0],
        date_range: '',
        groups: [],
        is_published: true,
        files: [],
        publish_date: Math.floor(Date.now() / 1000),
        group_files: []
      });
      setGroups([]);
      setPdfFile(null);
      setGroupFiles(new Map());
    }
  }, [editSchedule, open]);

  const addGroup = () => {
    // Дата внутри группы теперь не важна, ставим пустую строку или можно дублировать общую дату
    setGroups([...groups, { date: '', list: [''] }]);
  };

  const updateGroupList = (groupIndex: number, listIndex: number, value: string) => {
    const newGroups = [...groups];
    const newList = [...newGroups[groupIndex].list];
    newList[listIndex] = value;
    newGroups[groupIndex].list = newList;
    setGroups(newGroups);
  };

  const addGroupItem = (groupIndex: number) => {
    const newGroups = [...groups];
    newGroups[groupIndex].list.push('');
    setGroups(newGroups);
  };

  const removeGroupItem = (groupIndex: number, itemIndex: number) => {
    const newGroups = [...groups];
    const groupName = newGroups[groupIndex].list[itemIndex];
    newGroups[groupIndex].list.splice(itemIndex, 1);
    
    if (groupName) {
      const newGroupFiles = new Map(groupFiles);
      newGroupFiles.delete(groupName);
      setGroupFiles(newGroupFiles);
    }
    
    setGroups(newGroups);
  };

  const removeGroup = (index: number) => {
    const newGroups = groups.filter((_, i) => i !== index);
    const groupToRemove = groups[index];
    
    const newGroupFiles = new Map(groupFiles);
    groupToRemove.list.forEach(groupName => {
      newGroupFiles.delete(groupName);
    });
    setGroupFiles(newGroupFiles);
    
    setGroups(newGroups);
  };

  const handleGroupFileChange = (groupIndex: number, itemIndex: number, file: File) => {
    const groupName = groups[groupIndex].list[itemIndex];
    if (!groupName.trim()) {
      toast({
        title: 'Ошибка',
        description: 'Сначала введите название группы',
        variant: 'destructive'
      });
      return;
    }

    if (file.type !== 'application/pdf') {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, загрузите PDF файл',
        variant: 'destructive'
      });
      return;
    }

    const newGroupFiles = new Map(groupFiles);
    newGroupFiles.set(groupName, file);
    setGroupFiles(newGroupFiles);
  };

  const removeGroupFile = (groupName: string) => {
    const newGroupFiles = new Map(groupFiles);
    newGroupFiles.delete(groupName);
    setGroupFiles(newGroupFiles);
  };

  const getGroupFileName = (groupName: string): string | null => {
    const file = groupFiles.get(groupName);
    return file ? file.name : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.course.trim()) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, заполните название и выберите курс', 
        variant: 'destructive' 
      });
      return;
    }

    if (!pdfFile && groups.length === 0) {
      toast({ 
        title: 'Ошибка', 
        description: 'Пожалуйста, загрузите общий PDF файл или добавьте группы с файлами', 
        variant: 'destructive' 
      });
      return;
    }

    for (const group of groups) {
      // Убрана проверка group.date, так как поле скрыто
      if (group.list.some(item => !item.trim())) {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, укажите названия всех групп', 
          variant: 'destructive' 
        });
        return;
      }
    }

    setLoading(true);
    try {
      let uploadedFileIds: string[] = [];
      if (pdfFile) {
        try {
          const fileId = await filesApi.upload(pdfFile);
          if (typeof fileId === 'string' && fileId) {
            uploadedFileIds = [fileId];
          }
        } catch (error) {
          console.error('Ошибка загрузки общего файла:', error);
          throw new Error('Не удалось загрузить общий файл');
        }
      }

      const groupFilesToUpload: GroupFile[] = [];
      for (const [groupName, file] of groupFiles.entries()) {
        try {
          const fileId = await filesApi.upload(file);
          if (typeof fileId === 'string' && fileId) {
            groupFilesToUpload.push({
              groupName,
              fileId,
              fileName: file.name
            });
          }
        } catch (error) {
          console.error(`Ошибка загрузки файла для группы ${groupName}:`, error);
          throw new Error(`Не удалось загрузить файл для группы ${groupName}`);
        }
      }

      const payload: CreateExamSchedulePayload = {
        title: formData.title,
        course: formData.course,
        date_range: formData.date_range,
        groups: groups,
        is_published: formData.is_published,
        files: uploadedFileIds,
        publish_date: formData.publish_date,
        group_files: groupFilesToUpload
      };

      if (editSchedule) {
        await examScheduleApi.update(editSchedule.id, payload, pdfFile || undefined);
      } else {
        await examScheduleApi.create(payload, pdfFile || undefined);
      }

      toast({ 
        title: 'Успешно', 
        description: `Расписание ${formData.is_published ? 'опубликовано' : 'сохранено как черновик'}`,
      });
      
      onSuccess();
    } catch (error) {
      console.error('❌ Ошибка сохранения расписания:', error);
      toast({ 
        title: 'Ошибка', 
        description: error instanceof Error ? error.message : 'Не удалось сохранить расписание', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      course: COURSES[0],
      date_range: '',
      groups: [],
      is_published: true,
      files: [],
      publish_date: Math.floor(Date.now() / 1000),
      group_files: []
    });
    setGroups([]);
    setPdfFile(null);
    setGroupFiles(new Map());
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setFormData(prev => ({ 
          ...prev, 
          file_name: file.name
        }));
        setGroups([]);
        setGroupFiles(new Map());
      } else {
        toast({ 
          title: 'Ошибка', 
          description: 'Пожалуйста, загрузите PDF файл', 
          variant: 'destructive' 
        });
      }
    }
  };

  const removeFile = () => {
    setPdfFile(null);
    setFormData(prev => ({ ...prev, file_name: '', files: [] }));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editSchedule ? 'Редактировать расписание' : 'Добавить расписание экзаменов'}</DialogTitle>
          <DialogDescription>
            Заполните форму для {editSchedule ? 'редактирования' : 'создания'} расписания
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Название расписания (Дата/Период) *</Label>
              <Input 
                id="title" 
                value={formData.title} 
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} 
                placeholder="Например: с 15 по 28 июня"
                required 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Курс *</Label>
              <Select 
                value={formData.course} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, course: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите курс" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((course) => (
                    <SelectItem key={course} value={course}>
                      {course}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <Label>Общий PDF файл для всего курса</Label>
            {pdfFile ? (
              <div className="flex items-center justify-between p-3 border border-green-200 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    {pdfFile.name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={16} />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-blue-600">Нажмите для загрузки</span> общего файла
                  </div>
                </label>
              </div>
            )}
          </div>

          {!pdfFile && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Группы и файлы экзаменов</Label>
                <Button type="button" onClick={addGroup} variant="outline" size="sm">
                  <Plus size={16} className="mr-1" />
                  Добавить блок групп
                </Button>
              </div>

              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm text-gray-700">Блок групп {groupIndex + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGroup(groupIndex)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  {/* ПОЛЕ "Период экзаменов" УДАЛЕНО ПО ПРОСЬБЕ ПОЛЬЗОВАТЕЛЯ */}

                  <div className="space-y-2">
                    <Label className="text-xs text-gray-500">Список групп с файлами</Label>
                    {group.list.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <Input
                          value={item}
                          onChange={(e) => updateGroupList(groupIndex, itemIndex, e.target.value)}
                          placeholder="Название группы (например: Д-2-1)"
                          className="flex-1"
                        />
                        
                        <div className="flex items-center space-x-2">
                          {getGroupFileName(item) ? (
                            <div className="flex items-center space-x-2 p-2 border border-green-200 bg-green-50 rounded">
                              <FileText className="h-4 w-4 text-green-600" />
                              <span className="text-xs text-green-800 max-w-24 truncate">
                                {getGroupFileName(item)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeGroupFile(item)}
                                className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <input
                                type="file"
                                id={`group-file-${groupIndex}-${itemIndex}`}
                                accept=".pdf"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleGroupFileChange(groupIndex, itemIndex, file);
                                  }
                                }}
                                className="hidden"
                              />
                              <label 
                                htmlFor={`group-file-${groupIndex}-${itemIndex}`}
                                className="cursor-pointer bg-blue-50 text-blue-700 px-3 py-2 rounded text-sm hover:bg-blue-100 transition-colors"
                              >
                                <Upload size={14} className="inline mr-1" />
                                Файл
                              </label>
                            </>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGroupItem(groupIndex, itemIndex)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={group.list.length === 1}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addGroupItem(groupIndex)}
                      className="mt-2"
                    >
                      <Plus size={16} className="mr-1" />
                      Добавить группу
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_published"
                  checked={formData.is_published}
                  onCheckedChange={(isChecked) => {
                    setFormData(prev => ({
                      ...prev,
                      is_published: isChecked,
                    }));
                  }}
                />
                <Label htmlFor="is_published" className="text-base font-normal cursor-pointer">
                  Опубликовать расписание
                </Label>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.is_published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {formData.is_published ? 'ОПУБЛИКОВАН' : 'ЧЕРНОВИК'}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Отмена
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : editSchedule ? (
                'Обновить'
              ) : (
                'Создать'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}