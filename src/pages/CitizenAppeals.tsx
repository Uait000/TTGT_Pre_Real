// src/pages/CitizenAppeals.tsx

import { useState, useRef, useCallback } from 'react';
import MainLayout from '@/components/MainLayout';
import { 
    FileText, 
    Upload, 
    X, 
    Paperclip, 
    Send, 
    AlertCircle, 
    CheckCircle, 
    Loader2, 
    Download 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Импортируем функцию API и тип данных
// УБЕДИТЕСЬ, что файл src/api/feedback.ts содержит ФУНКЦИИ createFeedback и uploadFeedbackFiles
import { createFeedback, uploadFeedbackFiles, FeedbackData } from '@/api/feedback'; 

// Импорты статических файлов (предполагаем, что пути верны)
import polObrac2022 from '@/assets/file/form/Pol_obrac_grazdan_2022.pdf';
import polObracIzm2024 from '@/assets/file/form/Pol_obrac_grazdan_izm_2024.pdf';
import polObracIzm2025 from '@/assets/file/form/Pol_obrac_grazdan_izm_2025.pdf';


// --- Типы и начальное состояние ---
const initialFormData = {
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    phone: '',
    subject: '',
    message: '', 
    agreement: false
};

interface Captcha {
    question: string;
    answer: string;
}
// -----------------------------------

// --- Утилиты ---
const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const generateCaptcha = (): Captcha => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = Math.random() > 0.5 ? '+' : '-';

    let question;
    let answer;

    if (operator === '+') {
        question = `${num1} + ${num2}`;
        answer = num1 + num2;
    } else {
        const minNum = Math.min(num1, num2);
        const maxNum = Math.max(num1, num2);
        question = `${maxNum} - ${minNum}`;
        answer = maxNum - minNum;
    }

    return { question, answer: String(answer) };
};
// -------------------


const CitizenAppeals = () => {
    const [formData, setFormData] = useState(initialFormData);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [captcha, setCaptcha] = useState(generateCaptcha);
    const [captchaAnswer, setCaptchaAnswer] = useState('');
    // Добавлен статус для файлов
    const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'partial-success'>('idle'); 
    const [errorMessage, setErrorMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Управление состоянием ---
    const documents = [
        { title: 'Положение о порядке рассмотрения обращений граждан (2022)', url: polObrac2022 },
        { title: 'Изменения в положение о порядке рассмотрения обращений граждан от 10.09.2024', url: polObracIzm2024 },
        { title: 'Изменения в положение о порядке рассмотрения обращений граждан от 23.04.2025', url: polObracIzm2025 }
    ];

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const MAX_FILES = 25;
        const availableSlots = MAX_FILES - uploadedFiles.length;
        const newFiles = files.slice(0, availableSlots);
        setUploadedFiles(prev => [...prev, ...newFiles]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const resetForm = useCallback(() => {
        setFormData(initialFormData);
        setUploadedFiles([]);
        setCaptchaAnswer('');
        setCaptcha(generateCaptcha());
        setFormStatus('idle');
        setErrorMessage('');
    }, []);
    // -------------------

    // --- Обработчик отправки формы ---
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormStatus('loading');
        setErrorMessage('');

        // 1. Проверка Капчи и Согласия
        if (captchaAnswer.trim() !== captcha.answer) {
            setErrorMessage('Неверный ответ на математический пример. Попробуйте еще раз.');
            setFormStatus('error');
            setCaptcha(generateCaptcha());
            setCaptchaAnswer('');
            return;
        }
        if (!formData.agreement) {
            setErrorMessage('Необходимо дать согласие на обработку персональных данных.');
            setFormStatus('error');
            return;
        }

        // 2. Сбор текстовых данных для JSON-запроса
        const dataToSend: FeedbackData = {
            first_name: formData.firstName,   
            second_name: formData.lastName,   
            middle_name: formData.middleName, 
            email: formData.email,
            phone: formData.phone,
            topic: formData.subject,      
            content: formData.message,    
        };
        
        let feedbackId: number | void;

        // 3. Отправка текстовых данных (JSON)
        try {
            // Ожидаем, что createFeedback вернет ID, если статус 200, или void, если 204
            feedbackId = await createFeedback(dataToSend); 
        } catch (error: any) {
            setFormStatus('error');
            setErrorMessage(error.message || 'Ошибка отправки текстовых данных.');
            setCaptcha(generateCaptcha());
            setCaptchaAnswer('');
            return; // Останавливаемся
        }

        // 4. Отправка файлов (multipart/form-data)
        if (uploadedFiles.length > 0) {
            
            // Если нет файлов, но бэкенд не вернул ID (статус 204), мы можем продолжать.
            // Если есть файлы И нет ID, это ошибка логики бэкенда.
            if (!feedbackId && uploadedFiles.length > 0) {
                 setErrorMessage('Текстовые данные отправлены, но не удалось получить ID для привязки файлов. Файлы не будут загружены.');
                 setFormStatus('partial-success'); // Частичный успех
            } else {
                try {
                    // Отправляем файлы, используя полученный ID
                    // TypeScript гарантирует, что feedbackId: number | void. 
                    // Если он number, используем его, если void, используем 0 или null (зависит от API)
                    await uploadFeedbackFiles(feedbackId as number, uploadedFiles);

                } catch (error: any) {
                    // Если файлы не загрузились, показываем успех основной части с предупреждением.
                    setErrorMessage(`Текстовое обращение создано, но произошла ошибка при загрузке файлов: ${error.message || 'Ошибка сети/сервера при загрузке файлов.'}`);
                    setFormStatus('partial-success'); 
                    return; // Завершаем выполнение, чтобы показать сообщение.
                }
            }
        }
        
        // 5. Полный успех
        setFormStatus('success'); 
    };

    // -----------------------------------


    return (
        <MainLayout>
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold text-primary mb-2">Обращения граждан</h1>
                <p className="text-lg text-muted-foreground">
                    Здесь вы можете задать вопрос, внести предложение или сообщить о проблеме.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden">
                <Tabs defaultValue="form" className="w-full">
                    
                    {/* --- Вкладки навигации --- */}
                    <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 h-auto p-1.5 rounded-t-xl rounded-b-none">
                        <TabsTrigger 
                            value="form" 
                            className="py-2.5 text-sm font-semibold transition-all duration-300
                                        data-[state=active]:bg-primary 
                                        data-[state=active]:text-primary-foreground 
                                        data-[state=active]:shadow-md"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Форма обращения
                        </TabsTrigger>
                        
                        <TabsTrigger 
                            value="docs" 
                            className="py-2.5 text-sm font-semibold transition-all duration-300
                                        data-[state=active]:bg-primary 
                                        data-[state=active]:text-primary-foreground 
                                        data-[state=active]:shadow-md"
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            Нормативные документы
                        </TabsTrigger>
                        
                        <TabsTrigger 
                            value="faq" 
                            className="py-2.5 text-sm font-semibold transition-all duration-300
                                        data-[state=active]:bg-primary 
                                        data-[state=active]:text-primary-foreground 
                                        data-[state=active]:shadow-md"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Часто задаваемые вопросы
                        </TabsTrigger>
                    </TabsList>

                    {/* --- Вкладка 1: ФОРМА --- */}
                    <TabsContent value="form" className="p-6 md:p-10">
                        <form 
                            onSubmit={handleSubmit} 
                            className="space-y-6"
                        >
                            <h2 className="text-2xl font-semibold text-primary pb-3 border-b border-border/50">
                                Заполните форму
                            </h2>
                            
                            {/* Уведомления */}
                            {(formStatus === 'success' || formStatus === 'partial-success') && (
                                <Alert 
                                    variant={formStatus === 'success' ? "success" : "destructive"}
                                    className={formStatus === 'success' ? "bg-green-50 border-green-300 text-green-800" : "bg-yellow-50 border-yellow-300 text-yellow-800"}
                                >
                                    {formStatus === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    <AlertTitle>{formStatus === 'success' ? "Отправлено!" : "Частичный успех с предупреждением"}</AlertTitle>
                                    <AlertDescription>
                                        {formStatus === 'success' 
                                            ? "Ваше обращение успешно зарегистрировано (включая все файлы)."
                                            : errorMessage 
                                        }
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            onClick={resetForm}
                                            className="ml-4 text-green-700 hover:bg-green-100"
                                        >
                                            Начать новое обращение
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            )}
                            {formStatus === 'error' && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>Ошибка</AlertTitle>
                                    <AlertDescription>{errorMessage}</AlertDescription>
                                </Alert>
                            )}
                            
                            {/* Поля формы (без изменений) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">Фамилия *</Label>
                                    <Input id="lastName" required value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">Имя *</Label>
                                    <Input id="firstName" required value={formData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="middleName" className="block text-sm font-medium text-foreground mb-2">Отчество (при наличии)</Label>
                                <Input id="middleName" value={formData.middleName}
                                    onChange={(e) => handleInputChange('middleName', e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email *</Label>
                                    <Input id="email" type="email" required value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">Телефон *</Label>
                                    <Input id="phone" type="tel" required value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">Тема сообщения</Label>
                                <Input id="subject" value={formData.subject}
                                    onChange={(e) => handleInputChange('subject', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Сообщение *</Label>
                                <Textarea id="message" required rows={6} value={formData.message}
                                    onChange={(e) => handleInputChange('message', e.target.value)}
                                />
                            </div>
                            
                            {/* Блок загрузки файлов */}
                            <div>
                                <Label className="block text-sm font-medium text-foreground mb-2">Прикрепить файлы</Label>
                                <input
                                    type="file"
                                    multiple
                                    accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.rtf"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    id="file-upload"
                                    ref={fileInputRef}
                                    disabled={uploadedFiles.length >= 25}
                                />
                                <Label
                                    htmlFor="file-upload"
                                    className={`flex items-center justify-center w-full p-6 border-2 border-dashed border-primary/30 rounded-lg 
                                    ${uploadedFiles.length < 25 ? 'cursor-pointer hover:border-primary/50 hover:bg-primary/5' : 'cursor-not-allowed bg-secondary/50'}
                                    transition-colors`}
                                >
                                    <Upload className="w-5 h-5 text-primary mr-2" />
                                    <span className="text-sm text-muted-foreground">
                                        Выберите файлы (до {25 - uploadedFiles.length} шт. | jpg, png, pdf, docx...)
                                    </span>
                                </Label>
                                
                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        <Alert variant="default" className="bg-blue-50 border-blue-300 text-blue-800">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Внимание</AlertTitle>
                                            <AlertDescription>
                                                Файлы будут отправлены **отдельным запросом** после успешной регистрации текстового обращения.
                                            </AlertDescription>
                                        </Alert>
                                        {uploadedFiles.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-2 pl-3 bg-secondary/50 rounded-lg border border-border/50">
                                                <div className="flex items-center space-x-2 min-w-0">
                                                    <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span className="text-sm text-foreground truncate">{file.name}</span>
                                                    <span className="text-xs text-muted-foreground flex-shrink-0">({formatBytes(file.size)})</span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeFile(index)}
                                                    className="text-red-500 hover:text-red-700 w-6 h-6 flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Блок с динамической капчей */}
                            <div>
                                <Label className="block text-sm font-medium text-foreground mb-2">Проверка *</Label>
                                <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
                                    <span className="text-lg font-semibold text-foreground">
                                        {captcha.question} =
                                    </span>
                                    <Input
                                        required
                                        type="number"
                                        value={captchaAnswer}
                                        onChange={(e) => setCaptchaAnswer(e.target.value)}
                                        className="w-24"
                                        aria-label="Ответ на математический пример"
                                    />
                                </div>
                            </div>

                            {/* Чекбокс согласия */}
                            <div className="flex items-start space-x-3 pt-4 border-t border-border/50">
                                <Checkbox
                                    id="agreement"
                                    checked={formData.agreement}
                                    onCheckedChange={(checked) => handleInputChange('agreement', checked as boolean)}
                                    required
                                />
                                <Label htmlFor="agreement" className="text-sm text-foreground leading-relaxed">
                                    Я даю согласие на обработку моих персональных данных в соответствии с
                                    Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных».
                                </Label>
                            </div>

                            {/* Кнопки */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto flex-1"
                                    disabled={formStatus === 'loading'}
                                >
                                    {formStatus === 'loading' ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5 mr-2" />
                                    )}
                                    Отправить обращение
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full sm:w-auto"
                                    onClick={resetForm}
                                    disabled={formStatus === 'loading'}
                                >
                                    Сбросить
                                </Button>
                            </div>
                        </form>
                    </TabsContent>

                    {/* --- Вкладки 2 и 3 (FAQ) --- */}
                    <TabsContent value="docs" className="p-6 md:p-10">
                        <h2 className="text-2xl font-semibold text-primary mb-6">Нормативные документы</h2>
                        <div className="space-y-3">
                            {documents.map((doc, index) => (
                                <a
                                    key={index}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between space-x-3 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/30 transition-all group"
                                >
                                    <FileText className="w-5 h-5 text-primary/80 group-hover:text-primary transition-colors flex-shrink-0" />
                                    <span className="text-foreground font-medium group-hover:text-primary transition-colors text-sm flex-1">
                                        {doc.title}
                                    </span>
                                    <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="faq" className="p-6 md:p-10">
                        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
                            Часто задаваемые вопросы
                        </h2>
                        
                        <Accordion type="single" collapsible className="w-full">
                            
                            <AccordionItem value="item-1">
                                <AccordionTrigger className="text-left">Когда у вас День открытых дверей и в каком формате?</AccordionTrigger>
                                <AccordionContent className="space-y-6">
                                    <p className="font-semibold text-foreground">Графики проведения "Дней открытых дверей" 2024/2025 учебный год</p>
                                    
                                    <div>
                                        <h4 className="font-medium text-foreground mb-3">В <span className="text-primary">дистанционном формате</span> для удалённых территорий</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">№</TableHead>
                                                    <TableHead>Дата проведения</TableHead>
                                                    <TableHead className="text-right">Время</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>1</TableCell>
                                                    <TableCell>31 октября 2024</TableCell>
                                                    <TableCell className="text-right">13:00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>2</TableCell>
                                                    <TableCell>12 декабря 2024</TableCell>
                                                    <TableCell className="text-right">13:00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>3</TableCell>
                                                    <TableCell>20 февраля 2025</TableCell>
                                                    <TableCell className="text-right">13:00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>4</TableCell>
                                                    <TableCell>03 апреля 2025</TableCell>
                                                    <TableCell className="text-right">13:00</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-foreground mb-3">В <span className="text-primary">очном формате</span> (при стабильной обстановке)</h4>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px]">№</TableHead>
                                                    <TableHead>Дата проведения</TableHead>
                                                    <TableHead className="text-right">Время</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell>1</TableCell>
                                                    <TableCell>30 ноября 2024</TableCell>
                                                    <TableCell className="text-right">10:00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>3</TableCell>
                                                    <TableCell>01 марта 2025</TableCell>
                                                    <TableCell className="text-right">10:00</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell>5</TableCell>
                                                    <TableCell>26 апреля 2025</TableCell>
                                                    <TableCell className="text-right">10:00</TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <p><strong>Приглашаем</strong> – всех тех, кто решает задачу выбора будущей профессии, а также их родителей.</p>
                                        <p><strong>В программе:</strong></p>
                                        <ul className="list-disc list-inside text-muted-foreground pl-4">
                                            <li>Встреча с руководством, заведующими отделениями и преподавателями;</li>
                                            <li>Знакомство с работой отделений и учебных лабораторий;</li>
                                            <li>Знакомство с техникумом.</li>
                                        </ul>
                                        <p className="font-semibold pt-2">Приходите и мы поможем Вам сделать правильный выбор!</p>
                                    </div>

                                    <div className="bg-primary/5 rounded-lg p-4 text-sm space-y-2">
                                        <p><strong>Адрес:</strong> Тихорецк, ул.Красноармейская 57.</p>
                                        <p><strong>Справки:</strong> кабинет 101А, тел. 8(86196) 6-20-03 доб.110</p>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-2">
                                <AccordionTrigger className="text-left">Какой проходной балл для поступления?</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-foreground">
                                        Проходной балл прошлого года можно посмотреть по ссылке:{' '}
                                        <a href="http://rgups.ru/filiali/ttgt/sveden-obrazovanie-priem/" target='_blank' rel='noopener noreferrer' className="text-primary hover:text-primary-hover underline">
                                            http://rgups.ru/filiali/ttgt/sveden-obrazovanie-priem/
                                        </a>
                                    </p>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-left">Какие специальности реализуются в техникуме?</AccordionTrigger>
                                <AccordionContent className="space-y-3">
                                    <p>В техникуме реализуются следующие специальности:</p>
                                    <ol className="list-decimal list-inside text-foreground space-y-1 pl-4">
                                        <li>08.02.01 Строительство и эксплуатация зданий и сооружений;</li>
                                        <li>09.02.01 Компьютерные системы и комплексы;</li>
                                        <li>11.02.06 Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта);</li>
                                        <li>13.02.07 Электроснабжение;</li>
                                        <li>15.02.19 Сварочное производство;</li>
                                        <li>23.02.01 Организация перевозок и управление на транспорте (по видам);</li>
                                        <li>23.02.04 Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин и оборудования (по отраслям);</li>
                                        <li>23.02.06 Техническая эксплуатация подвижного состава железных дорог (электроподвижной состав);</li>
                                        <li>23.02.06 Техническая эксплуатация подвижного состава железных дорог (вагоны);</li>
                                        <li>23.02.08 Строительство железных дорог, путь и путевое хозяйство;</li>
                                        <li>27.02.03 Автоматика и телемеханика на транспорте (железнодорожном транспорте);</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-left">Можно ли перевестись из другого техникума?</AccordionTrigger>
                                <AccordionContent className="space-y-3 text-foreground">
                                    <p>Законодательство в сфере образования предусматривает возможность перевода с одной образовательной организации в другую.</p>
                                    <p><strong>Алгоритм перевода:</strong></p>
                                    <ol className="list-decimal list-inside space-y-2 pl-4">
                                        <li>Наличие вакантного места (бюджетного или платного) на интересующей специальности.</li>
                                        <li>Получить в своей организации справку о периоде обучения и предоставить ее нам.</li>
                                        <li>Наша аттестационная комиссия определяет перечень перезачтенных дисциплин. Если разница не превышает 5 дисциплин, мы выдаем справку о переводе.</li>
                                        <li>На основании этой справки вы пишете заявление на отчисление в порядке перевода в вашем учреждении.</li>
                                        <li>После предоставления нам аттестата и выписки из приказа об отчислении, мы зачисляем вас.</li>
                                    </ol>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-5">
                                <AccordionTrigger className="text-left">Платят ли стипендию и кто может ее получать?</AccordionTrigger>
                                <AccordionContent className="space-y-3 text-foreground">
                                    <p>Стипендиальное обеспечение осуществляется на основании Положения ФГБОУ ВО РГУПС.</p>
                                    <p><strong>Стипендии могут получать только студенты, обучающиеся на бюджетной основе.</strong></p>
                                    <p>Стипендии, выплачиваемые студентам техникума:</p>
                                    <ul className="list-disc list-inside space-y-1 pl-4">
                                        <li>Государственная академическая стипендия;</li>
                                        <li>Государственная социальная стипендия;</li>
                                        <li>Стипендия Правительства Российской Федерации;</li>
                                        <li>Стипендия Правительства РФ (приоритетные направления);</li>
                                        <li>Именная стипендия Президента ОАО «РЖД»;</li>
                                        <li>Стипендия начальника железной дороги.</li>
                                    </ul>
                                    <p>
                                        С условиями можно познакомиться на сайте РГУПС:{' '}
                                        <a href="http://www.rgups.ru/sved-obr/stipendii-i-usloviia-predostavl-701/" target='_blank' rel='noopener noreferrer' className="text-primary hover:text-primary-hover underline">
                                            ссылка
                                        </a>
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-6">
                                <AccordionTrigger className="text-left">Когда начинается прием документов и какие нужны?</AccordionTrigger>
                                <AccordionContent className="space-y-3 text-foreground">
                                    <p>Приемная кампания в техникум начинается <strong>20 июня</strong>.</p>
                                    <p>Абитуриент заполняет заявление и предоставляет в отборочную комиссию:</p>
                                    <ul className="list-disc list-inside space-y-1 pl-4">
                                        <li>Оригинал и/или ксерокопию документов, удостоверяющих личность, гражданство;</li>
                                        <li>Оригинал и/или ксерокопию документа об образовании;</li>
                                        <li>СНИЛС;</li>
                                        <li>4 фотографии, размером 3х4 см;</li>
                                        <li>Медицинскую справку (например, по форме 086-у, содержащую заключение профпатолога).</li>
                                        <li>Иностранные студенты дополнительно предоставляют заверенный перевод на русский язык документа об образовании.</li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-7">
                                <AccordionTrigger className="text-left">Можно ли подать документы для поступления online?</AccordionTrigger>
                                <AccordionContent className="space-y-3 text-foreground">
                                    <p>Приём заявлений выполняется одним из следующих способов:</p>
                                    <ul className="list-disc list-inside space-y-1 pl-4">
                                        <li>Лично в отборочную комиссию ТТЖТ - филиал РГУПС;</li>
                                        <li>Через операторов почтовой связи (заказным письмом);</li>
                                        <li>В электронной форме, посредством E-mail;</li>
                                        <li>Через личный кабинет абитуриента на сайте <a href="http://www.ttgt.org" target='_blank' rel='noopener noreferrer' className="text-primary hover:text-primary-hover underline">www.ttgt.org</a>;</li>
                                        <li>С использованием функционала «Единый портал государственных и муниципальных услуг (функций)».</li>
                                    </ul>
                                    <p>Документы принимаются не позднее сроков, установленных в <span className="font-semibold text-primary">Правилах приёма</span>.</p>
                                </AccordionContent>
                            </AccordionItem>
                            
                            <AccordionItem value="item-8">
                                <AccordionTrigger className="text-left">Какие льготы есть у абитуриента из многодетной семьи?</AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-foreground">
                                        Поступление в техникум осуществляется на общедоступной основе, т.е. льготы при поступлении отсутствуют.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                            
                        </Accordion>
                    </TabsContent>

                </Tabs>
            </div>

        </MainLayout>
    );
};

export default CitizenAppeals;