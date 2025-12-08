import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone'; 
import { scheduleApi } from '@/api/schedule';
import documentsApi, { type Document as DocType, type CreateDocumentPayload } from '@/api/documents';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
    Loader2, FileText, Upload, X, Archive, AlertTriangle, CheckCircle2, 
    Plus, Edit, Trash2, Calendar, Download, ExternalLink 
} from 'lucide-react';

interface ScheduleDocument {
    id: number;
    title: string;
    file_url: string;
    file_name: string;
    section_type: 'general' | 'correspondence_schedule' | 'correspondence_graph';
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

type DocumentSection = 'general' | 'correspondence_schedule' | 'correspondence_graph';

export default function ScheduleManager() {
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle'); 
    
    const [documents, setDocuments] = useState<ScheduleDocument[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(true);
    const [activeSection, setActiveSection] = useState<DocumentSection>('general');
    const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
    const [editingDocument, setEditingDocument] = useState<ScheduleDocument | null>(null);
    const [documentFile, setDocumentFile] = useState<File | null>(null);
    
    const [documentForm, setDocumentForm] = useState({
        title: '',
        is_published: true
    });

    const { toast } = useToast();

    // Загрузка документов
    const loadDocuments = async () => {
        setIsLoadingDocuments(true);
        try {
            console.log('📥 Загрузка документов...');
            
            let allDocuments = [];
            
            // Пробуем сначала админский endpoint
            try {
                console.log('📥 Пробуем загрузить через getAll (админский)...');
                allDocuments = await documentsApi.getAll();
                console.log('✅ getAll успешно:', allDocuments.length, 'документов');
                
                // Фильтруем только опубликованные документы
                allDocuments = allDocuments.filter(doc => doc.is_published === true);
                console.log('✅ После фильтрации опубликованных:', allDocuments.length, 'документов');
                
            } catch (adminError) {
                console.log('❌ getAll не сработал, пробуем getPublicAll...');
                try {
                    allDocuments = await documentsApi.getPublicAll();
                    console.log('✅ getPublicAll успешно:', allDocuments.length, 'документов');
                } catch (publicError) {
                    console.error('❌ Оба метода не сработали:', publicError);
                    allDocuments = [];
                }
            }

            console.log('📄 Все загруженные документы:', allDocuments);

            // Преобразуем в формат ScheduleDocument
            const scheduleDocuments: ScheduleDocument[] = allDocuments.map(doc => {
                let sectionType: DocumentSection = 'general';
                
                const sectionTitle = doc.section_title.toLowerCase();
                const docTitle = doc.document_title.toLowerCase();
                
                if (sectionTitle.includes('заоч') || docTitle.includes('заоч')) {
                    if (sectionTitle.includes('график') || docTitle.includes('график')) {
                        sectionType = 'correspondence_graph';
                    } else if (sectionTitle.includes('сесси') || docTitle.includes('сесси')) {
                        sectionType = 'correspondence_schedule';
                    }
                }

                return {
                    id: doc.id,
                    title: doc.document_title,
                    file_url: doc.file_url || (doc.files && doc.files.length > 0 ? doc.files[0].url : ''),
                    file_name: doc.file_name || (doc.files && doc.files.length > 0 ? doc.files[0].name : ''),
                    section_type: sectionType,
                    is_published: doc.is_published,
                    created_at: doc.created_at,
                    updated_at: doc.updated_at
                };
            });

            console.log('📊 Преобразованные документы:', scheduleDocuments);
            setDocuments(scheduleDocuments);
            
        } catch (error) {
            console.error('❌ Ошибка загрузки документов:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось загрузить документы',
                variant: 'destructive'
            });
            setDocuments([]);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            if (!file.type.includes('zip') && !file.name.toLowerCase().endsWith('.zip')) {
                toast({
                    title: 'Ошибка',
                    description: 'Пожалуйста, загрузите файл в формате ZIP.',
                    variant: 'destructive'
                });
                return;
            }
            setFileToUpload(file);
            setUploadStatus('idle');
        }
    }, [toast]);

    const handleFileRemove = () => {
        setFileToUpload(null);
        setUploadStatus('idle');
    };
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/zip': ['.zip'],
            'application/x-zip-compressed': ['.zip']
        },
        multiple: false,
    });
    
    const handleUpload = async () => {
        if (!fileToUpload) {
            toast({ 
                title: 'Файл не выбран', 
                description: 'Пожалуйста, выберите ZIP архив с расписанием.', 
                variant: 'destructive' 
            });
            return;
        }

        setIsUploading(true);
        setUploadStatus('idle');

        try {
            console.log('🚀 Начало загрузки файла расписания:', fileToUpload.name);
            
            await scheduleApi.upload(fileToUpload); 
            
            console.log('✅ Файл расписания успешно загружен');
            
            toast({
                title: 'Успешно!',
                description: 'ZIP архив с расписанием загружен и доступен на сайте.',
            });
            
            setFileToUpload(null); 
            setUploadStatus('success');

        } catch (error) {
            console.error('❌ Ошибка загрузки файла расписания:', error);
            setUploadStatus('error');
            
            const errorMessage = error instanceof Error ? error.message : 'Не удалось загрузить файл.';
            
            toast({
                title: 'Ошибка загрузки',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setIsUploading(false);
        }
    };

    const openDocumentDialog = (section: DocumentSection, document?: ScheduleDocument) => {
        setActiveSection(section);
        if (document) {
            setEditingDocument(document);
            setDocumentForm({
                title: document.title,
                is_published: document.is_published
            });
        } else {
            setEditingDocument(null);
            setDocumentForm({
                title: '',
                is_published: true
            });
        }
        setDocumentFile(null);
        setIsDocumentDialogOpen(true);
    };

    const closeDocumentDialog = () => {
        setIsDocumentDialogOpen(false);
        setEditingDocument(null);
        setDocumentForm({
            title: '',
            is_published: true
        });
        setDocumentFile(null);
    };

    const handleDocumentSubmit = async () => {
        if (!documentForm.title.trim()) {
            toast({
                title: 'Ошибка',
                description: 'Введите название документа',
                variant: 'destructive'
            });
            return;
        }

        if (!documentFile && !editingDocument) {
            toast({
                title: 'Ошибка',
                description: 'Выберите файл для загрузки',
                variant: 'destructive'
            });
            return;
        }

        try {
            let sectionTitle = '';
            switch (activeSection) {
                case 'general':
                    sectionTitle = 'Общие документы';
                    break;
                case 'correspondence_graph':
                    sectionTitle = 'Учебные графики заочного отделения';
                    break;
                case 'correspondence_schedule':
                    sectionTitle = 'Расписание сессий заочного отделения';
                    break;
            }

            const payload: CreateDocumentPayload = {
                section_title: sectionTitle,
                document_title: documentForm.title,
                is_published: documentForm.is_published,
                use_external_link: false,
                external_link: '',
                publish_date: Math.floor(Date.now() / 1000)
            };

            console.log('📤 Отправка документа:', {
                section: activeSection,
                payload,
                file: documentFile?.name
            });

            let result;
            if (editingDocument) {
                result = await documentsApi.update(editingDocument.id, payload, documentFile || undefined);
            } else {
                result = await documentsApi.create(payload, documentFile || undefined);
            }

            console.log('✅ Результат сохранения:', result);

            toast({
                title: 'Успешно!',
                description: `Документ ${documentForm.is_published ? 'опубликован' : 'сохранен как черновик'}`,
            });

            closeDocumentDialog();
            loadDocuments();

        } catch (error) {
            console.error('❌ Ошибка сохранения документа:', error);
            toast({
                title: 'Ошибка',
                description: error instanceof Error ? error.message : 'Не удалось сохранить документ',
                variant: 'destructive'
            });
        }
    };

    const handleDeleteDocument = async (document: ScheduleDocument) => {
        if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
            return;
        }

        try {
            await documentsApi.delete(document.id);
            toast({
                title: 'Успешно!',
                description: 'Документ удален',
            });
            loadDocuments();
        } catch (error) {
            console.error('❌ Ошибка удаления документа:', error);
            toast({
                title: 'Ошибка',
                description: 'Не удалось удалить документ',
                variant: 'destructive'
            });
        }
    };

    const getSectionTitle = (section: DocumentSection): string => {
        switch (section) {
            case 'general': return 'Общие документы';
            case 'correspondence_graph': return 'Учебные графики заочного отделения';
            case 'correspondence_schedule': return 'Расписание сессий заочного отделения';
            default: return 'Документы';
        }
    };

    const getSectionDescription = (section: DocumentSection): string => {
        switch (section) {
            case 'general': return 'Документы для раздела "Общие документы и графики"';
            case 'correspondence_graph': return 'Документы для карточки "Учебные графики" в разделе заочного отделения';
            case 'correspondence_schedule': return 'Документы для карточки "Расписание сессий" в разделе заочного отделения';
            default: return 'Управление документами';
        }
    };

    const filteredDocuments = documents.filter(doc => doc.section_type === activeSection);
    const isUploadDisabled = !fileToUpload || isUploading;
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Управление расписанием и документами</h2>
                    <p className="text-muted-foreground">Загружайте расписание и управляйте документами для всех разделов</p>
                </div>
            </div>

            <Card className='shadow-lg'>
                <CardHeader>
                    <CardTitle>Загрузка нового расписания</CardTitle>
                    <CardDescription>
                        Загрузите ZIP архив содержащий HTML файлы расписания
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        {fileToUpload ? (
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary">
                                <div className="flex items-center space-x-3">
                                    <Archive className="w-5 h-5 text-primary" />
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
                                    {isDragActive ? 'Отпустите файл здесь...' : 'Нажмите для загрузки ZIP архива или перетащите файл'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Поддерживается только ZIP формат с HTML файлами внутри
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button 
                        onClick={handleUpload} 
                        disabled={isUploadDisabled}
                        className="w-full"
                        size="lg"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                Загрузка...
                            </>
                        ) : (
                            'Загрузить расписание'
                        )}
                    </Button>
                    
                    {uploadStatus === 'success' && (
                        <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center gap-2 justify-center">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <p className="text-green-700 text-sm">
                                    Расписание успешно обновлено и доступно на сайте
                                </p>
                            </div>
                        </div>
                    )}
                    {uploadStatus === 'error' && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center gap-2 justify-center">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <p className="text-red-700 text-sm">
                                    Ошибка при обновлении расписания
                                </p>
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Управление документами</CardTitle>
                    <CardDescription>
                        Добавляйте и редактируйте документы для разных разделов сайта
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex space-x-2 mb-6">
                        {(['general', 'correspondence_graph', 'correspondence_schedule'] as DocumentSection[]).map((section) => (
                            <Button
                                key={section}
                                variant={activeSection === section ? "default" : "outline"}
                                onClick={() => setActiveSection(section)}
                                className="flex-1"
                            >
                                {getSectionTitle(section)}
                            </Button>
                        ))}
                    </div>

                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">{getSectionDescription(activeSection)}</p>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">{getSectionTitle(activeSection)}</h3>
                        <Button onClick={() => openDocumentDialog(activeSection)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Добавить документ
                        </Button>
                    </div>

                    {isLoadingDocuments ? (
                        <div className="text-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                            <p>Загрузка документов...</p>
                        </div>
                    ) : filteredDocuments.length > 0 ? (
                        <div className="space-y-3">
                            {filteredDocuments.map((document) => (
                                <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="font-medium">{document.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(document.updated_at).toLocaleDateString('ru-RU')}
                                                {!document.is_published && (
                                                    <span className="ml-2 text-orange-600">(Черновик)</span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => window.open(document.file_url, '_blank')}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openDocumentDialog(activeSection, document)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteDocument(document)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>Нет документов в этой секции</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingDocument ? 'Редактировать документ' : 'Добавить документ'}
                        </DialogTitle>
                        <DialogDescription>
                            {getSectionDescription(activeSection)}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Название документа */}
                        <div className="space-y-2">
                            <Label htmlFor="title">
                                Название документа
                            </Label>
                            <Input
                                id="title"
                                value={documentForm.title}
                                onChange={(e) => setDocumentForm(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Название документа или графика"
                            />
                        </div>

                        {/* Загрузка файла */}
                        <div className="space-y-2">
                            <Label>Файл документа</Label>
                            {documentFile ? (
                                <div className="flex items-center justify-between p-3 border rounded-lg bg-secondary">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-green-500" />
                                        <span className="font-medium">{documentFile.name}</span>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setDocumentFile(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : editingDocument ? (
                                <div className="p-3 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-600">
                                        Текущий файл: {editingDocument.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Оставьте пустым, чтобы сохранить текущий файл
                                    </p>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                    <input
                                        type="file"
                                        id="document-upload"
                                        onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <label htmlFor="document-upload" className="cursor-pointer">
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium text-blue-600">Нажмите для загрузки</span> или перетащите файл
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Поддерживаются PDF, DOC, DOCX файлы
                                        </p>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Публикация */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="is_published"
                                checked={documentForm.is_published}
                                onCheckedChange={(checked) => setDocumentForm(prev => ({ ...prev, is_published: checked }))}
                            />
                            <Label htmlFor="is_published">Опубликовать документ</Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={closeDocumentDialog}>
                            Отмена
                        </Button>
                        <Button onClick={handleDocumentSubmit}>
                            {editingDocument ? 'Обновить' : 'Создать'} документ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}