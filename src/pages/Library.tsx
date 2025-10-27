import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import lib_1 from '@/assets/pictures/phoca_thumb_l_276.jfif';
import lib_2 from '@/assets/pictures/phoca_thumb_l_277.jfif';
import lib_3 from '@/assets/pictures/phoca_thumb_l_278.jfif';
import lib_4 from '@/assets/pictures/phoca_thumb_l_279.jfif';
import lib_5 from '@/assets/pictures/phoca_thumb_l_280.jfif';
import lib_6 from '@/assets/pictures/phoca_thumb_l_281.jfif';
import lib_7 from '@/assets/pictures/phoca_thumb_l_282.jfif';
import lib_8 from '@/assets/pictures/phoca_thumb_l_283.jfif';
import lib_9 from '@/assets/pictures/phoca_thumb_l_284.jfif';

const Library = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { id: 1, src: lib_1, alt: 'Библиотека 1' },
    { id: 2, src: lib_2, alt: 'Библиотека 2' },
    { id: 3, src: lib_3, alt: 'Библиотека 3' },
    { id: 4, src: lib_4, alt: 'Библиотека 4' },
    { id: 5, src: lib_5, alt: 'Библиотека 5' },
    { id: 6, src: lib_6, alt: 'Библиотека 6' },
    { id: 7, src: lib_7, alt: 'Библиотека 7' },
    { id: 8, src: lib_8, alt: 'Библиотека 8' },
    { id: 9, src: lib_9, alt: 'Библиотека 9' }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            {/* Info Blocks */}
            <InfoBlocks />
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Библиотека</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Карусель изображений */}
                <div className="relative max-w-4xl mx-auto mb-8">
                  <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={images[currentSlide].src}
                      alt={images[currentSlide].alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Стрелки навигации */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-6 h-6 text-primary" />
                  </button>
                  
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </button>

                  {/* Индикаторы */}
                  <div className="flex justify-center space-x-2 mt-4">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide
                            ? 'bg-primary scale-125'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Основной текст */}
                <div className="bg-white rounded-lg p-8 space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-primary mb-4">Библиотека Тихорецкого техникума железнодорожного транспорта</h2>
                    
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold text-primary mb-2">Наш адрес:</p>
                          <p className="text-foreground">352120, Краснодарский край, г. Тихорецк ул. Красноармейская, 53.</p>
                          <p className="text-foreground">телефон: 8(86196) 6-20-03 (доб. 154)</p>
                        </div>
                        <div>
                          <p className="font-semibold text-primary mb-2">Мы ждем Вас</p>
                          <p className="text-foreground">ежедневно с 8.00 до 17.00</p>
                          <p className="text-foreground">суббота с 8.00 до 13.00</p>
                          <p className="text-foreground">выходной – воскресенье</p>
                          <p className="text-foreground">Санитарный день – последний рабочий день каждого месяца.</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-primary mb-3">Вас обслужат</h3>
                      <div className="space-y-2 text-foreground">
                        <p>Библиотекарь – Бурлакова Екатерина Валерьевна</p>
                        <p>Заведующая библиотекой: Костромина Елена Александровна</p>
                        <p>Курирует работу библиотеки: Шитикова Наталья Юрьевна</p>
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-gray max-w-none space-y-4">
                    <p className="text-foreground leading-relaxed">
                      Библиотека является структурным подразделением ТТЖТ – филиала РГУПС, располагающим организованным библиотечным фондом изданий для предоставления их во временное пользование обучающимся, педагогическим, другим работникам техникума и обеспечения учебного, учебно-методического, научно-исследовательского, воспитательного, административного процессов в техникуме. Библиотека является центром распространения знаний, духовного и интеллектуального общения, культуры.
                    </p>

                    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                      <h3 className="font-semibold text-primary mb-4">Библиотека в своей деятельности руководствуется:</h3>
                      <ul className="space-y-2 text-foreground text-sm">
                        <li>• Конституцией Российской Федерации;</li>
                        <li>• Федеральными законами «О библиотечном деле», « Об образовании в Российской Федерации», «Об информации, информационных технологиях и защите информации», «О противодействии экстремистской деятельности», «О персональных данных» и иными Федеральными законами Российской Федерации, нормативными правовыми актами государственных органов управления образованием по вопросам, отнесенным к их компетенции;</li>
                        <li>• приказами и распоряжениями директора ТТЖТ – филиала РГУПС;</li>
                        <li>• инструктивно – методическими материалами Центральной библиотечно-информационной комиссии Минобразования России (далее ЦБИК);</li>
                        <li>• Уставом ФГБОУ ВО РГУПС;</li>
                        <li>• Правилами внутреннего распорядка ТТЖТ – филиала РГУПС;</li>
                        <li>• Положением о библиотеке.</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-lg p-6">
                        <h3 className="font-semibold text-primary mb-4">Цель работы библиотеки:</h3>
                        <p className="text-foreground">Библиотечное и информационно-библиографическое обслуживание пользователей библиотеки.</p>
                      </div>

                      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-lg p-6">
                        <h3 className="font-semibold text-primary mb-4">Задачи библиотеки:</h3>
                        <ul className="space-y-2 text-foreground text-sm">
                          <li>1. Полное и оперативное библиотечное и информационно - библиографическое обслуживание студентов, преподавателей, сотрудников и других категорий читателей ссуза.</li>
                          <li>2. Формирование библиотечного фонда в соответствии с профилем ссуза, образовательными профессиональными программами и информационными потребностями читателей.</li>
                          <li>3. Организация и ведение справочно – библиографического аппарата в автоматизированном и традиционном режимах.</li>
                          <li>4. Формирование библиотечно-информационной культуры, навыков независимого библиотечного пользователя: обучение современным методам поиска, отбору и критической оценке информации.</li>
                          <li>5. Совершенствование работы библиотеки на основе внедрения современных технологий и компьютеризации библиотечно-информационных процессов, формирования комфортной библиотечной среды.</li>
                          <li>6. Координация деятельности с подразделениями ссуза и общественными организациями, взаимодействие с библиотеками других систем и ведомств для более полного удовлетворения потребностей пользователей в литературе.Внедрение новых информационных технологий.</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                      <h3 className="font-semibold text-primary mb-4">Услуги, оказываемые библиотекой:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="font-medium text-foreground mb-2">1. Обслуживание читателей на абонементе и в читальном зале.</p>
                          <p className="text-foreground text-sm">Организация информационного и справочно-библиографического обслуживания.</p>
                          
                          <p className="font-medium text-foreground mb-2 mt-4">2. Оказание справочно – библиографической помощи:</p>
                          <ul className="text-foreground text-sm space-y-1">
                            <li>• выполнение библиографических справок;</li>
                            <li>• составление информационных и рекомендательных списков;</li>
                            <li>• тематический обзор литературы;</li>
                            <li>• проведение индивидуальных и групповых библиотечно-библиографических занятий;</li>
                            <li>• ответы на запросы пользователей.</li>
                          </ul>
                        </div>
                        
                        <div>
                          <p className="font-medium text-foreground mb-2">3. Оформление тематических книжных выставок и буклетов.</p>
                          <p className="font-medium text-foreground mb-2">4. Проведение массовых мероприятий и занятий по основам библиотечно- библиографических знаний.</p>
                          <p className="font-medium text-foreground mb-2">5. Проведение «Дней специалиста», «Дней информации», «Предметных цикловых недель».</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border border-border rounded-lg p-6">
                      <p className="text-foreground leading-relaxed mb-4">
                        Библиотека техникума имеет богатый фонд документов печати и электронную базу полнотекстовых электронных ресурсов. Общее количество печатных изданий составляет 74454 экз. Читателями библиотеки являются около 2 тыс. пользователей. За 2024 год зарегистрировано 5481 посещение, 10702 книговыдача.
                      </p>

                      <h3 className="font-semibold text-primary mb-4">Информация о доступе к информационным системам и информационно-телекоммуникационным сетям, об электронных образовательных ресурсах, к которым обеспечивается доступ обучающихся.</h3>
                      
                      <p className="text-foreground leading-relaxed mb-4">
                        Библиотека ТТЖТ на сегодняшний день может предложить своим пользователям не только традиционные печатные документы на бумажном носителе, но и электронные ресурсы, которые можно использовать как полноценное добавление к книгам и периодическим изданиям, а порой и вовсе заменять их.
                      </p>

                      <p className="text-foreground leading-relaxed mb-4">
                        Студенты и преподаватели, а так же лица с ОВЗ пользуются электронными библиотечными системами: «АйПиЭрбукс» – 228 наименований; УМЦ ЖДТ – более 600 наименований; «Юрайт» - более 7 тысяч наименований. В библиотеке ТТЖТ создан и ведется электронный каталог, который содержит более 15 тысяч библиографических записей.
                      </p>

                      <p className="text-foreground leading-relaxed mb-4">
                        Читатели в течение всего рабочего дня имеют доступ к сети «Интернет» в стенах читального зала. Доступ открыт с 5 компьютеров. Кроме того, помещение библиотеки, учебные корпуса подключены к беспроводной сети WiFi, что позволяет читателям (в том числе и лицам с ОВЗ) пользоваться ЭБС с планшетов, ноутбуков и смартфонов. Использование данного информационного поля дает возможность более полноценно и качественно готовиться к занятиям, лабораторным и практическим работам, находить информацию для разработки курсовых и дипломных проектов.
                      </p>

                      <p className="text-foreground leading-relaxed mb-4">
                        Сотрудники библиотеки ведут активную работу по внедрению, освоению и активизации новых информационных библиотечных технологий, которые не вытесняют, а дополняют и расширяют традиционные формы и методы в обслуживании читателей и доведении информации до пользователей.
                      </p>

                      <p className="text-foreground leading-relaxed mb-4">
                        Так же в библиотеке широко используются и электронные аналоги печатных изданий, обучающие – контролирующие программы по различным дисциплинам.
                      </p>

                      <p className="text-foreground leading-relaxed">
                        С 2019 года ТТЖТ – филиал РГУПС подключен к электронной базе данных периодических изданий Pablic.ru (инструкция по регистрации и использованию БД журналов и газет располагается во вкладке «Онлайн библиотека»)Зав.библиотекой Костромина Елена Александровна
                      </p>
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

export default Library;