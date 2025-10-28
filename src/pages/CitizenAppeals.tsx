import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
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

// --- Импорт PDF-файлов ---
import polObrac2022 from '@/assets/file/form/Pol_obrac_grazdan_2022.pdf';
import polObracIzm2024 from '@/assets/file/form/Pol_obrac_grazdan_izm_2024.pdf';
import polObracIzm2025 from '@/assets/file/form/Pol_obrac_grazdan_izm_2025.pdf';

// Начальное состояние для сброса формы
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

// Хелпер для форматирования размера файла
const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const CitizenAppeals = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documents = [
    {
      title: 'Положение о порядке рассмотрения обращений граждан (2022)',
      url: polObrac2022
    },
    {
      title: 'Изменения в положение о порядке рассмотрения обращений граждан от 10.09.2024',
      url: polObracIzm2024
    },
    {
      title: 'Изменения в положение о порядке рассмотрения обращений граждан от 23.04.2025',
      url: polObracIzm2025
    }
  ];

  // ... (handleInputChange, handleFileUpload, removeFile, resetForm, handleSubmit) ...
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

  const resetForm = () => {
    setFormData(initialFormData);
    setUploadedFiles([]);
    setCaptchaAnswer('');
    setFormStatus('idle');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setErrorMessage('');

    if (captchaAnswer !== '12') {
      setErrorMessage('Неверный ответ на математический пример.');
      setFormStatus('error');
      return;
    }
    if (!formData.agreement) {
      setErrorMessage('Необходимо дать согласие на обработку персональных данных.');
      setFormStatus('error');
      return;
    }

    const data = new FormData();
    data.append('lastName', formData.lastName);
    data.append('firstName', formData.firstName);
    data.append('middleName', formData.middleName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('subject', formData.subject);
    data.append('message', formData.message);
    data.append('recipient', 'kovixi@mail.ru'); 

    uploadedFiles.forEach((file, i) => {
      data.append(`file_${i+1}`, file, file.name);
    });

    try {
      const response = await fetch('/api/send-appeal', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Ошибка сервера: ${response.statusText}`);
      }
      setFormStatus('success');
      resetForm();

    } catch (error: any) {
      setFormStatus('error');
      setErrorMessage(error.message || 'Не удалось подключиться к серверу. Попробуйте позже.');
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-primary mb-2">Обращения граждан</h1>
              <p className="text-lg text-muted-foreground">
                Здесь вы можете задать вопрос, внести предложение или сообщить о проблеме.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-border/50 overflow-hidden">
              <Tabs defaultValue="form" className="w-full">
                
                {/* --- 
                  ИЗМЕНЕНИЯ ЗДЕСЬ: 
                  - TabsList: 'rounded-t-xl rounded-b-none' и 'p-1.5' для лучшего вида
                  - TabsTrigger: Добавлены классы для цвета, шрифта и анимации
                --- */}
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
                    
                    {/* ... (Содержимое формы: Уведомления, Поля, Кнопки) ... */}
                    {formStatus === 'success' && (
                      <Alert variant="success">
                        <CheckCircle className="h-4 w-4" />
                        <AlertTitle>Отправлено!</AlertTitle>
                        <AlertDescription>
                          Ваше обращение успешно зарегистрировано. Мы свяжемся с вами в ближайшее время.
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

                    <div>
                      <Label className="block text-sm font-medium text-foreground mb-2">Проверка *</Label>
                      <div className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg">
                        <span className="text-lg font-semibold text-foreground">10 + 2 =</span>
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

                {/* --- Вкладка 2: ДОКУМЕНТЫ --- */}
                <TabsContent value="docs" className="p-6 md:p-10">
                  <h2 className="text-2xl font-semibold text-primary mb-6">Нормативные документы</h2>
                  <div className="space-y-3">
                    {/* ... (Содержимое вкладки Документы) ... */}
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

                {/* --- Вкладка 3: FAQ --- */}
                <TabsContent value="faq" className="p-6 md:p-10">
                  <h2 className="text-2xl font-semibold text-primary mb-6 text-center">
                    Часто задаваемые вопросы
                  </h2>
                  
                  {/* ... (Содержимое вкладки FAQ с Аккордеоном) ... */}
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

          </div>
        </main>
        
        <aside className="hidden lg:block w-80 bg-white border-l border-border p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default CitizenAppeals;