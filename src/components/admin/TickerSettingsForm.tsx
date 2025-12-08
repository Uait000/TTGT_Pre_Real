// src/components/admin/TickerSettingsForm.tsx
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, Megaphone, RefreshCw, Cloud, HardDrive, Calendar, Clock, Users, Link, ExternalLink } from "lucide-react";
import { fetchTickerSettings, saveTickerSettings, checkApiHealth } from "@/api/tickerApi";

// Zod-схема для валидации
const formSchema = z.object({
  text: z.string().min(1, "Текст не может быть пустым"),
  date: z.string().optional().default(""),
  time: z.string().optional().default(""),
  format: z.enum(["очный", "заочный"]),
  is_enabled: z.boolean().default(false),
  link: z.string().optional().default(""),
  link_text: z.string().optional().default(""),
}).refine(data => {
  // Если формат заочный, то ссылка должна быть указана
  if (data.format === "заочный" && data.link) {
    try {
      new URL(data.link);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "Некорректный URL ссылки",
  path: ["link"]
});

type TickerFormValues = z.infer<typeof formSchema>;

const TickerSettingsForm = () => {
  const queryClient = useQueryClient();
  const [storageMode, setStorageMode] = React.useState<'local' | 'api' | 'unknown'>('unknown');
  const [apiHealth, setApiHealth] = React.useState<{ healthy: boolean; status: number; message: string } | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = React.useState(false);

  // Проверяем здоровье API при загрузке
  React.useEffect(() => {
    const checkHealth = async () => {
      const health = await checkApiHealth();
      setApiHealth(health);
      console.log('🏥 API Health:', health);
    };
    
    checkHealth();
  }, []);

  // Загружаем настройки только один раз при монтировании
  const { data: currentSettings, isLoading, error, refetch } = useQuery({
    queryKey: ['tickerSettings'],
    queryFn: async () => {
      const data = await fetchTickerSettings();
      console.log('📥 Loaded ticker settings:', data);
      return data;
    },
    retry: 1,
    onSuccess: (data) => {
      // Определяем откуда пришли данные
      const hasLocalData = localStorage.getItem('ticker_settings');
      const fromApi = data && data.source === 'api';
      setStorageMode(fromApi ? 'api' : 'local');
      
      // Инициализируем форму только при первой загрузке
      if (!initialLoadComplete) {
        console.log('🔄 Initial form setup with data:', data);
        form.reset({
          text: data.text || "",
          date: data.date || "",
          time: data.time || "",
          format: data.format || "очный",
          is_enabled: data.is_enabled || false,
          link: data.link || "",
          link_text: data.link_text || "",
        });
        setInitialLoadComplete(true);
      }
    }
  });

  const form = useForm<TickerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      date: "",
      time: "",
      format: "очный",
      is_enabled: false,
      link: "",
      link_text: "",
    }
  });

  const watchFormat = form.watch("format");
  const watchLink = form.watch("link");
  const watchLinkText = form.watch("link_text");

  const mutation = useMutation({
    mutationFn: saveTickerSettings,
    onSuccess: (result: any) => {
      console.log('✅ Save result:', result);
      
      if (result.fallback) {
        toast({ 
          title: "💾 Сохранено локально", 
          description: "Настройки сохранены в браузере (проблемы с подключением к серверу)",
          variant: "default"
        });
        setStorageMode('local');
      } else {
        toast({ 
          title: "✅ Успешно", 
          description: "Настройки сохранены на сервер и доступны всем посетителям",
          variant: "default"
        });
        setStorageMode('api');
      }
      
      // Обновляем только публичные данные для отображения
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
    onError: (error: Error) => {
      console.error('❌ Save error:', error);
      toast({ 
        variant: "destructive", 
        title: "❌ Ошибка", 
        description: error.message || "Не удалось сохранить настройки" 
      });
    },
  });

  const onSubmit = (data: TickerFormValues) => {
    console.log('📤 Submitting form data:', data);
    mutation.mutate(data);
  };

  const isEnabled = form.watch('is_enabled');

  // Ручное обновление настроек
  const handleManualRefresh = async () => {
    try {
      const newData = await refetch();
      if (newData.data) {
        // Обновляем форму с новыми данными
        form.reset({
          text: newData.data.text || "",
          date: newData.data.date || "",
          time: newData.data.time || "",
          format: newData.data.format || "очный",
          is_enabled: newData.data.is_enabled || false,
          link: newData.data.link || "",
          link_text: newData.data.link_text || "",
        });
        
        toast({
          title: "Данные обновлены",
          description: `Настройки загружены с сервера`,
          variant: "default"
        });
      }
    } catch (err) {
      console.error('Refresh error:', err);
    }
  };

  // Функция для проверки валидности URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Загрузка настроек...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2 font-medium">
          Ошибка загрузки настроек
        </div>
        <div className="text-sm text-gray-600 mb-4 max-w-md mx-auto">
          {error.message}
        </div>
        <div className="flex justify-center space-x-3">
          <Button 
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Повторить
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Status Indicator */}
      <div className={`mb-6 p-4 rounded-lg border ${
        storageMode === 'api' ? 'bg-green-50 border-green-200' : 
        storageMode === 'local' ? 'bg-yellow-50 border-yellow-200' : 
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-start space-x-3">
          {storageMode === 'api' ? (
            <Cloud className="w-5 h-5 text-green-600 mt-0.5" />
          ) : storageMode === 'local' ? (
            <HardDrive className="w-5 h-5 text-yellow-600 mt-0.5" />
          ) : (
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin mt-0.5" />
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${
                storageMode === 'api' ? 'text-green-700' : 
                storageMode === 'local' ? 'text-yellow-700' : 
                'text-blue-700'
              }`}>
                {storageMode === 'api' ? '✅ Режим: Серверный' :
                 storageMode === 'local' ? '⚠️ Режим: Локальный' :
                 'Определение режима...'}
              </span>
              
              <div className="flex space-x-2">
                {/* Manual Refresh Button */}
                <Button 
                  onClick={handleManualRefresh}
                  variant="ghost" 
                  size="sm"
                  className="h-8"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Проверить сервер
                </Button>
                
                {/* API Health Button */}
                <Button 
                  onClick={async () => {
                    const health = await checkApiHealth();
                    setApiHealth(health);
                    toast({
                      title: health.healthy ? "✅ API доступен" : "❌ Проблемы с API",
                      description: health.message,
                      variant: health.healthy ? "default" : "destructive"
                    });
                  }}
                  variant="ghost" 
                  size="sm"
                  className="h-8"
                >
                  <Cloud className="w-3 h-3 mr-1" />
                  Статус API
                </Button>
              </div>
            </div>
            
            <p className="text-sm opacity-75 mt-1">
              {storageMode === 'api' ? 'Настройки синхронизируются с сервером и доступны всем посетителям' :
               storageMode === 'local' ? 'Настройки сохраняются только в вашем браузере и не видны другим пользователям' :
               'Проверка подключения...'}
            </p>
            
            {/* API Health Status */}
            {apiHealth && (
              <div className={`mt-2 text-xs px-2 py-1 rounded ${
                apiHealth.healthy ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <strong>Статус API:</strong> {apiHealth.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-full ${isEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            {isEnabled ? <Eye size={20} /> : <EyeOff size={20} />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {isEnabled ? 'Бегущая строка активна' : 'Бегущая строка отключена'}
            </h3>
            <p className="text-sm text-gray-600">
              {isEnabled ? 'Текст будет отображаться на главной странице' : 'Текст скрыт от посетителей'}
            </p>
          </div>
        </div>
        
        {isEnabled && form.watch('text') && (
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-sm text-blue-600 mb-3">
              <Megaphone size={16} />
              <span className="font-medium">Предпросмотр нового дизайна:</span>
            </div>
            
            {/* Preview of new design */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg overflow-hidden relative">
              {/* Decorative elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 rounded-full"></div>
              </div>

              <div className="relative z-10 py-3 px-6">
                <div className="flex items-center space-x-4">
                  {/* Main Icon */}
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-full backdrop-blur-sm">
                    <Megaphone className="w-4 h-4 text-white" />
                  </div>
                  
                  {/* Announcement Badge */}
                  <div className="flex items-center space-x-2 bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Важное объявление
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* Text */}
                    <span className="text-base font-bold text-white whitespace-nowrap truncate">
                      {form.watch('text')}
                    </span>

                    {/* Icons for date/time/format */}
                    <div className="flex items-center space-x-3 text-white/90 flex-shrink-0">
                      {form.watch('date') && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span className="whitespace-nowrap">{form.watch('date')}</span>
                        </div>
                      )}
                      
                      {form.watch('time') && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Clock className="w-3 h-3" />
                          <span className="whitespace-nowrap">{form.watch('time')}</span>
                        </div>
                      )}
                      
                      {form.watch('format') && (
                        <div className="flex items-center space-x-1 text-xs">
                          <Users className="w-3 h-3" />
                          <span className="font-semibold whitespace-nowrap">
                            {form.watch('format')?.toUpperCase()}
                          </span>
                        </div>
                      )}

                      {/* Link preview for online format */}
                      {watchFormat === "заочный" && watchLink && isValidUrl(watchLink) && (
                        <div className="flex items-center space-x-1 text-xs bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
                          <Link className="w-3 h-3 text-white" />
                          <a 
                            href={watchLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-white font-medium hover:underline whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {watchLinkText || "Присоединиться"}
                            <ExternalLink className="w-2 h-2 ml-1 inline" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine pointer-events-none"></div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-orange-500 rounded"></div>
                <span>Градиентный фон</span>
              </div>
              <div className="flex items-center space-x-1">
                <Megaphone className="w-3 h-3 text-blue-500" />
                <span>Иконки информации</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-white/20 rounded"></div>
                <span>Стеклянный эффект</span>
              </div>
              {watchFormat === "заочный" && watchLink && (
                <div className="flex items-center space-x-1">
                  <Link className="w-3 h-3 text-green-500" />
                  <span>Кликабельная ссылка</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Settings Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6">
            {/* Main Text */}
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Основной текст *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="День открытых дверей" 
                      {...field} 
                      className="text-base py-3"
                    />
                  </FormControl>
                  <FormDescription>
                    Основное сообщение, которое будет отображаться в бегущей строке
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дата</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="15 ноября 2025 (СУББОТА)" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Дополнительная информация о дате
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Время</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="В 10:00" 
                        {...field} 
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Дополнительная информация о времени
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Format */}
            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Формат мероприятия</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите формат" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="очный">Очный формат</SelectItem>
                      <SelectItem value="заочный">Заочный формат (онлайн)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {watchFormat === "заочный" 
                      ? "Для онлайн-формата можно добавить ссылку для подключения" 
                      : "Укажите формат проведения мероприятия"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Link Settings - Only show for online format */}
            {watchFormat === "заочный" && (
              <div className="space-y-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-2 mb-2">
                  <Link className="w-4 h-4 text-blue-600" />
                  <h3 className="font-medium text-blue-800">Настройки онлайн-подключения</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ссылка для подключения *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://meet.google.com/xxx-yyyy-zzz" 
                            {...field} 
                            value={field.value || ''}
                            className="font-mono text-sm"
                          />
                        </FormControl>
                        <FormDescription>
                          Ссылка на Zoom, Google Meet, Teams и т.д.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="link_text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Текст ссылки</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Присоединиться к встрече" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Текст, который будет отображаться на кнопке ссылки
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {watchLink && isValidUrl(watchLink) && (
                  <div className="mt-2 p-3 bg-white rounded border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Link className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium">Ссылка активна:</span>
                      </div>
                      <a 
                        href={watchLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
                      >
                        <span>Проверить ссылку</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 break-all">
                      {watchLink}
                    </div>
                  </div>
                )}
                
                {watchLink && !isValidUrl(watchLink) && (
                  <div className="mt-2 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <div className="flex items-center space-x-2 text-yellow-800">
                      <div className="w-4 h-4">⚠️</div>
                      <span className="text-sm font-medium">Некорректный URL</span>
                    </div>
                    <div className="mt-1 text-xs text-yellow-700">
                      Введите корректный URL (например: https://meet.google.com/xxx-yyyy-zzz)
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Toggle */}
            <FormField
              control={form.control}
              name="is_enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-4 bg-gray-50">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-base font-medium cursor-pointer">
                      Включить бегущую строку на сайте
                    </FormLabel>
                    <FormDescription className="text-sm">
                      Когда включено, бегущая строка будет отображаться всем посетителям сайта
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-6 border-t">
            <Button 
              type="submit" 
              disabled={mutation.isPending} 
              className="min-w-32"
              size="lg"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                'Сохранить настройки'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TickerSettingsForm;