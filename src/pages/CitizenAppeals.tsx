import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

const CitizenAppeals = () => {
  const [formData, setFormData] = useState({
    lastName: '',
    firstName: '',
    middleName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    captcha: '',
    agreement: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [captchaAnswer, setCaptchaAnswer] = useState('');

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const typeValidFiles = files.filter(file => validTypes.includes(file.type));
    const availableSlots = 4 - uploadedFiles.length;
    const validFiles = typeValidFiles.filter((file, index) => {
      return index < availableSlots;
    });
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaAnswer !== '12') {
      alert('Неверный ответ на математический пример');
      return;
    }
    // Handle form submission
    console.log('Form submitted:', formData, uploadedFiles);
  };

  const documents = [
    {
      title: 'Положение о порядке рассмотрения обращений граждан',
      url: '#'
    },
    {
      title: 'Изменения в положение о порядке рассмотрения обращений граждан от 10.09.2024',
      url: '#'
    },
    {
      title: 'Изменения в положение о порядке рассмотрения обращений граждан от 23.04.2025',
      url: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Обращения граждан</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Contact Form */}
                <div className="bg-white rounded-lg p-8 shadow-sm mb-8">
                  <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Форма обращения</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Фамилия *</label>
                        <Input
                          required
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Имя *</label>
                        <Input
                          required
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Отчество (при наличии)</label>
                      <Input
                        value={formData.middleName}
                        onChange={(e) => handleInputChange('middleName', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Телефон *</label>
                        <Input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Тема сообщения</label>
                      <Input
                        value={formData.subject}
                        onChange={(e) => handleInputChange('subject', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Сообщение *</label>
                      <Textarea
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Math Captcha *</label>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-semibold">10 + 2 =</span>
                          <Input
                            required
                            type="number"
                            value={captchaAnswer}
                            onChange={(e) => setCaptchaAnswer(e.target.value)}
                            className="w-20"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Загрузка файлов</label>
                        <div className="space-y-2">
                          <input
                            type="file"
                            multiple
                            accept=".jpg,.png,.gif,.pdf"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                          />
                          <label
                            htmlFor="file-upload"
                            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                          >
                            <Upload className="w-5 h-5 text-primary mr-2" />
                            <span className="text-sm text-muted-foreground">
                              Выберите файлы (до 4 файлов: jpg, png, gif, pdf)
                            </span>
                          </label>
                        </div>
                        
                        {uploadedFiles.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm text-foreground">{file.name}</span>
                                <button
                                  type="button"
                                  onClick={() => removeFile(index)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="agreement"
                        checked={formData.agreement}
                        onCheckedChange={(checked) => handleInputChange('agreement', checked as boolean)}
                        required
                      />
                      <label htmlFor="agreement" className="text-sm text-foreground">
                        Согласие на обработку персональных данных{' '}
                        <a href="#" className="text-primary hover:text-primary-hover underline">
                          (скачать документ)
                        </a>
                      </label>
                    </div>

                    <div className="text-center">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Отправить
                      </Button>
                    </div>
                  </form>
                </div>

                {/* Documents and FAQ */}
                <div className="space-y-8">
                  {/* Documents */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-primary mb-6">Нормативные документы</h2>
                    <div className="space-y-4">
                      {documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                        >
                          <FileText className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0" />
                          <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                            {doc.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-primary mb-6">Часто задаваемые вопросы</h2>
                    
                    <div className="space-y-6">
                      <div className="border-b border-border/30 pb-6">
                        <h3 className="font-semibold text-foreground mb-3">Когда у вас День открытых дверей и в каком формате?</h3>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-primary mb-2">Графики проведения "Дней открытых дверей" 2024/2025 учебный год</h4>
                            
                            <div className="mb-4">
                              <h5 className="font-medium text-foreground mb-2">В дистанционном формате для удалённых территорий</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full border border-primary/20 rounded-lg">
                                  <thead className="bg-primary/10">
                                    <tr>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">№ п/п</th>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">Дата проведения</th>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">Время</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">1</td>
                                      <td className="border border-primary/20 p-3">31 октября 2024 года</td>
                                      <td className="border border-primary/20 p-3">13.00</td>
                                    </tr>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">2</td>
                                      <td className="border border-primary/20 p-3">12 декабря 2024 года</td>
                                      <td className="border border-primary/20 p-3">13.00</td>
                                    </tr>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">3</td>
                                      <td className="border border-primary/20 p-3">20 февраля 2025 года</td>
                                      <td className="border border-primary/20 p-3">13.00</td>
                                    </tr>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">4</td>
                                      <td className="border border-primary/20 p-3">03 апреля 2025 года</td>
                                      <td className="border border-primary/20 p-3">13.00</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            <div>
                              <h5 className="font-medium text-foreground mb-2">В очном формате при стабильной санитарно-эпидемиологической обстановки в условиях распространения инфекционных заболеваний</h5>
                              <div className="overflow-x-auto">
                                <table className="w-full border border-primary/20 rounded-lg">
                                  <thead className="bg-primary/10">
                                    <tr>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">№ п/п</th>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">Дата проведения</th>
                                      <th className="border border-primary/20 p-3 text-left font-semibold text-primary">Время</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">1</td>
                                      <td className="border border-primary/20 p-3">30 ноября 2024 года</td>
                                      <td className="border border-primary/20 p-3">10.00</td>
                                    </tr>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">3</td>
                                      <td className="border border-primary/20 p-3">01 марта 2025 года</td>
                                      <td className="border border-primary/20 p-3">10.00</td>
                                    </tr>
                                    <tr className="hover:bg-primary/5">
                                      <td className="border border-primary/20 p-3">5</td>
                                      <td className="border border-primary/20 p-3">26 апреля 2025 года</td>
                                      <td className="border border-primary/20 p-3">10.00</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mt-4">
                            <p className="text-foreground mb-2">
                              <strong>Приглашаем</strong> – всех тех, кто решает задачу выбора будущей профессии, а также их родителей.
                            </p>
                            <div className="space-y-1 text-sm text-foreground">
                              <p><strong>В программе:</strong></p>
                              <p>• Встреча с руководством техникума, заведующими отделениями и преподавателями;</p>
                              <p>• Знакомство с работой отделений и учебных лабораторий;</p>
                              <p>• Знакомство с техникумом.</p>
                              <p className="mt-2"><strong>Приходите и мы поможем Вам сделать правильный выбор!!!</strong></p>
                            </div>
                            
                            <div className="mt-4 space-y-1 text-sm">
                              <p><strong>Адрес техникума:</strong> Тихорецк, ул.Красноармейская 57.</p>
                              <p><strong>За справками обращаться в приемную комиссию:</strong></p>
                              <p>кабинет 101А, телефон для справок 8(86196) 6-20-03 доб.110</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Какой проходной балл для поступления?</h3>
                          <p className="text-foreground">
                            Проходной балл прошлого года можно посмотреть по ссылке{' '}
                            <a href="http://rgups.ru/filiali/ttgt/sveden-obrazovanie-priem/" className="text-primary hover:text-primary-hover underline">
                              http://rgups.ru/filiali/ttgt/sveden-obrazovanie-priem/
                            </a>
                          </p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Какие специальности, реализуются в техникуме?</h3>
                          <div className="text-foreground space-y-1 text-sm">
                            <p>В техникуме реализуются следующие специальности:</p>
                            <p>08.02.01 Строительство и эксплуатация зданий и сооружений;</p>
                            <p>09.02.01 Компьютерные системы и комплексы;</p>
                            <p>11.02.06 Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта);</p>
                            <p>13.02.07 Электроснабжение;</p>
                            <p>15.02.19 Сварочное производство;</p>
                            <p>23.02.01 Организация перевозок и управление на транспорте (по видам);</p>
                            <p>23.02.04 Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин и оборудования (по отраслям);</p>
                            <p>23.02.06 Техническая эксплуатация подвижного состава железных дорог (электроподвижной состав);</p>
                            <p>23.02.06 Техническая эксплуатация подвижного состава железных дорог (вагоны);</p>
                            <p>23.02.08 Строительство железных дорог, путь и путевое хозяйство;</p>
                            <p>27.02.03 Автоматика и телемеханика на транспорте (железнодорожном транспорте);</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Можно перевестись в ваш техникум с другого техникума и что для этого нужно сделать?</h3>
                          <div className="text-foreground space-y-2 text-sm">
                            <p>Законодательство в сфере образования предусматривает возможность перевода с одной образовательной организации в другую.</p>
                            <p><strong>Алгоритм перевода:</strong></p>
                            <p>1. Необходимо наличие вакантного места (бюджетного или платного) на интересующей специальности, курсе и форме обучения в техникуме.</p>
                            <p>2. Получить в образовательной организации, где проходите обучение (исходная образовательная организация), справку о периоде обучения, в которой отражаются изученные дисциплины, модули, пройденные практики и результаты аттестации по этим элементам учебного плана. Предоставить ее в наш техникум.</p>
                            <p>3. Аттестационная комиссия техникума по представленной справке о периоде обучения определяет перечень изученных учебных дисциплин, модулей, пройденных практик, которые в случае перевода обучающегося будут перезачтены или переаттестованы. Если разница в учебных планах специальностей не превышает 5 (пяти) дисциплин, модулей, то техникум РГУПС выдает справку о переводе, которая предоставляется в исходную образовательную организацию.</p>
                            <p>4. На основании этой справки о переводе в исходной организации пишется заявление на отчисление в порядке перевода в техникум.</p>
                            <p>5. После предоставления в техникум аттестата и выписки из приказа об отчислении из исходной образовательной организации, лицо, желающее быть переведенным в техникум, зачисляется приказом в наш техникум.</p>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-2">Платят ли в техникуме стипендию, и может ли получать стипендию студент, обучающийся на платной основе?</h3>
                          <div className="text-foreground space-y-2 text-sm">
                            <p>Стипендиальное обеспечение и материальная поддержка студентов техникума осуществляется на основании Положения о стипендиальном обеспечении и других формах материальной поддержки студентов, аспирантов и докторантов ФГБОУ ВО РГУПС.</p>
                            <p><strong>Стипендии могут получать только студенты, обучающиеся на бюджетной основе.</strong></p>
                            <p><strong>Стипендии, выплачиваемые студентам техникума:</strong></p>
                            <p>- Государственная академическая стипендия;</p>
                            <p>- Государственная социальная стипендия;</p>
                            <p>- Стипендия Правительства Российской Федерации;</p>
                            <p>- Стипендия Правительства Российской Федерации (приоритетные направления модернизации технологического развития российской экономики);</p>
                            <p>- Именная стипендия Президента ОАО «РЖД»;</p>
                            <p>- Стипендия начальника железной дороги.</p>
                            <p>С условиями предоставления стипендий можно познакомиться на сайте РГУПС:{' '}
                              <a href="http://www.rgups.ru/sved-obr/stipendii-i-usloviia-predostavl-701/" className="text-primary hover:text-primary-hover underline">
                                http://www.rgups.ru/sved-obr/stipendii-i-usloviia-predostavl-701/
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default CitizenAppeals;