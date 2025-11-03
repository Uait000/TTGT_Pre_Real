// src/components/admin/ZamenaManager.tsx (ФИНАЛЬНЫЙ ГОТОВЫЙ КОД)

import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { zamenaApi } from '@/api/zamena';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileText, Upload, X } from 'lucide-react';

export default function ZamenaManager() {

    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle'); 
    const { toast } = useToast();

    
    const fetchCurrentFile = useCallback(async () => {
        try {
            const data = await zamenaApi.get(); 
            setCurrentFileUrl(data.url); 
        } catch (error) {
            console.error("GET Status Failed:", error);
            setCurrentFileUrl(null); 
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCurrentFile(); 
    }, [fetchCurrentFile]);

    
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFileToUpload(acceptedFiles[0]);
            setUploadStatus('idle');
        }
    }, []);

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
            toast({ title: 'Файл не выбран', description: 'Пожалуйста, выберите новый PDF файл для замены.', variant: 'destructive' });
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');

        try {
            // Вызываем прямой POST-запрос, как указал разработчик
            await zamenaApi.upload(fileToUpload); 
            
            toast({
                title: 'Успешно!',
                description: 'Файл замен обновлен. Обновление на сайте произойдет автоматически.',
            });
            
            setFileToUpload(null); 
            // Обновляем URL, который теперь должен быть доступен
            await fetchCurrentFile(); 
            setUploadStatus('success');

        } catch (error) {
            setUploadStatus('error');
            toast({
                title: 'Ошибка загрузки',
                description: error instanceof Error ? error.message : 'Не удалось загрузить файл.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            setIsUploading(false);
        }
    };

    const isReplaceDisabled = !fileToUpload || isUploading;
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Управление заменами</h2>
            <p className="text-muted-foreground">Загрузите PDF-файл с заменами. Новый файл автоматически заменит старый.</p>

            <Card className='shadow-lg'>
                <CardHeader>
                    <CardTitle>Текущий файл</CardTitle>
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
                                            <span className="font-medium">{fileToUpload.name}</span>
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
                                    </div>
                                )}
                            </div>
                            
                            {currentFileUrl ? (
                                <p className="text-xs text-muted-foreground pt-2">
                                    Текущий закрепленный файл: <a href={currentFileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">zamena.pdf</a>
                                </p>
                            ) : (
                                <p className="text-xs text-red-500 pt-2">
                                    Файл замен не закреплен на сервере.
                                </p>
                            )}
                        </>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleUpload} disabled={isReplaceDisabled}>
                        {isUploading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Загрузка...</>
                        ) : (
                            'Заменить файл'
                        )}
                    </Button>
                </CardFooter>
                
                <div className="px-6 pb-6 text-center">
                    {uploadStatus === 'success' && <p className="text-green-600 font-medium mt-4">Успешно! Файл замен обновлен.</p>}
                    {uploadStatus === 'error' && <p className="text-red-600 font-medium mt-4">Ошибка! Не удалось обновить файл замен.</p>}
                </div>
            </Card>
        </div>
    );
}