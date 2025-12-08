// src/components/admin/ZamenaManager.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { zamenaApi } from '@/api/zamena';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, X, RefreshCw } from 'lucide-react';

export default function ZamenaManager() {
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle'); 
    const { toast } = useToast();

    // Функция для получения текущего файла с добавлением timestamp для избежания кэширования
    const fetchCurrentFile = useCallback(async (forceRefresh = false) => {
        try {
            if (forceRefresh) {
                setIsRefreshing(true);
            }
            
            const data = await zamenaApi.get(); 
            // Добавляем timestamp к URL чтобы избежать кэширования браузера
            if (data.url) {
                const timestamp = new Date().getTime();
                setCurrentFileUrl(`${data.url}?t=${timestamp}`);
            } else {
                setCurrentFileUrl(null);
            }
            
            console.log('📋 Текущий файл замен:', data.url);
        } catch (error) {
            console.error("GET Status Failed:", error);
            setCurrentFileUrl(null); 
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentFile(); 
    }, [fetchCurrentFile]);

    // Функция для принудительного обновления
    const handleForceRefresh = async () => {
        await fetchCurrentFile(true);
        toast({
            title: 'Обновлено',
            description: 'Информация о файле замен обновлена.',
        });
    };

    // Обработчик загрузки файлов
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            // Проверяем что файл PDF
            if (file.type !== 'application/pdf') {
                toast({
                    title: 'Ошибка',
                    description: 'Пожалуйста, загрузите файл в формате PDF.',
                    variant: 'destructive'
                });
                return;
            }
            setFileToUpload(file);
            setUploadStatus('idle');
            console.log('📄 Выбран файл для загрузки:', file.name);
        }
    }, [toast]);

    const handleFileRemove = () => {
        setFileToUpload(null);
        setUploadStatus('idle');
    };
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        multiple: false,
    });
    
    const handleUpload = async () => {
        if (!fileToUpload) {
            toast({ 
                title: 'Файл не выбран', 
                description: 'Пожалуйста, выберите новый PDF файл для замены.', 
                variant: 'destructive' 
            });
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');

        try {
            console.log('🚀 Начало загрузки файла замен:', fileToUpload.name);
            
            // Вызываем прямой POST-запрос
            await zamenaApi.upload(fileToUpload); 
            
            console.log('✅ Файл замен успешно загружен');
            
            toast({
                title: 'Успешно!',
                description: 'Файл замен обновлен. Обновление на сайте произойдет автоматически.',
            });
            
            setFileToUpload(null); 
            
            // Ждем немного перед обновлением, чтобы сервер успел обработать файл
            setTimeout(async () => {
                await fetchCurrentFile(true);
                setUploadStatus('success');
                
                // Дополнительное уведомление об успешном обновлении
                toast({
                    title: 'Обновление завершено',
                    description: 'Файл замен полностью обновлен на сайте.',
                    duration: 3000,
                });
            }, 1000);

        } catch (error) {
            console.error('❌ Ошибка загрузки файла замен:', error);
            setUploadStatus('error');
            toast({
                title: 'Ошибка загрузки',
                description: error instanceof Error ? error.message : 'Не удалось загрузить файл.',
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const isReplaceDisabled = !fileToUpload || isUploading;
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Управление заменами</h2>
                    <p className="text-muted-foreground">Загрузите PDF-файл с заменами. Новый файл автоматически заменит старый.</p>
                </div>
                <Button 
                    onClick={handleForceRefresh} 
                    variant="outline" 
                    size="sm"
                    disabled={isRefreshing}
                    className="flex items-center space-x-2"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    <span>Обновить</span>
                </Button>
            </div>

            <Card className='shadow-lg'>
                <CardHeader>
                    <CardTitle>Текущий файл</CardTitle>
                    <CardDescription>
                        {currentFileUrl 
                            ? 'Файл замен успешно загружен и доступен на сайте' 
                            : 'Файл замен не загружен или недоступен'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <>
                            <div className="mb-4">
                                {fileToUpload ? (
                                    <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary">
                                        <div className="flex items-center space-x-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <span className="font-medium block">{fileToUpload.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    Размер: {(fileToUpload.size / 1024 / 1024).toFixed(2)} MB
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={handleFileRemove} disabled={isUploading}>
                                            <X className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        {...getRootProps()}
                                        className={`p-10 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
                                            isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 dark:border-gray-600 hover:border-primary'
                                        }`}
                                    >
                                        <input {...getInputProps()} />
                                        <Upload className="w-6 h-6 mx-auto mb-2 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">
                                            {isDragActive ? 'Отпустите файл здесь...' : 'Нажмите для загрузки PDF документа или перетащите файл'}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Поддерживается только PDF формат
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            {currentFileUrl ? (
                                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div>
                                        <p className="text-sm font-medium text-green-800">
                                            Файл замен доступен на сайте
                                        </p>
                                        <p className="text-xs text-green-600">
                                            <a 
                                                href={currentFileUrl} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="hover:underline"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    // Открываем в новом окне с принудительным обновлением
                                                    window.open(`${currentFileUrl}`, '_blank');
                                                }}
                                            >
                                                Открыть файл замен
                                            </a>
                                        </p>
                                    </div>
                                    <FileText className="w-5 h-5 text-green-600" />
                                </div>
                            ) : (
                                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm font-medium text-yellow-800">
                                        Файл замен не загружен
                                    </p>
                                    <p className="text-xs text-yellow-600">
                                        Загрузите PDF файл чтобы он стал доступен на сайте
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button 
                        onClick={handleUpload} 
                        disabled={isReplaceDisabled}
                        className="w-full"
                        size="lg"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Загрузка...
                            </>
                        ) : (
                            'Заменить файл'
                        )}
                    </Button>
                    
                    {uploadStatus === 'success' && (
                        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-green-700 text-sm text-center">
                                ✅ Файл замен успешно обновлен и доступен на сайте
                            </p>
                        </div>
                    )}
                    {uploadStatus === 'error' && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm text-center">
                                ❌ Ошибка при обновлении файла замен
                            </p>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}