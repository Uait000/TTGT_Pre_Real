import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { BookOpen, Calendar, Award } from 'lucide-react'; // Новые иконки
import image1930 from '@/assets/pictures/ttgt_30.jpg'; 
import imageWar from '@/assets/pictures/ttgt_95.jpg';
import imageModern from '@/assets/pictures/Zavyalov.png';

// Компонент Модального окна (Лайтбокс) - Без изменений
const ImageModal = ({ src, alt, onClose }: { src: string | null; alt: string; onClose: () => void; }) => {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 cursor-pointer"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <img 
          src={src} 
          alt={alt} 
          className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl rounded-lg" 
        />
        <button 
          className="absolute -top-2 -right-2 text-white bg-black/30 rounded-full p-1 leading-none hover:bg-black/50 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

// ✅ Новый компонент для карточки на временной шкале
const TimelineItem = ({ year, title, children, imageUrl, imageAlt, openModal, imageOnLeft = false }) => {
  const content = (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-2xl font-bold text-primary mb-3">{title}</h3>
      <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {children}
      </div>
    </div>
  );

  const image = (
    <div 
      className="w-full h-full rounded-2xl shadow-xl overflow-hidden cursor-pointer group"
      onClick={() => openModal(imageUrl, imageAlt)}
    >
      <img 
        src={imageUrl} 
        alt={imageAlt} 
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
      />
    </div>
  );

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
      {/* Точка на шкале */}
      <div className="hidden md:flex justify-center md:col-span-1">
        <div className="absolute top-8 h-full border-l-2 border-primary/30 z-0"></div>
        <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
          <span className="text-white text-lg font-bold">{year}</span>
        </div>
      </div>
      
      {/* Контент */}
      <div className={`md:col-span-4 ${imageOnLeft ? 'md:order-last' : ''}`}>
        {content}
      </div>

      {/* Изображение (если есть) */}
      {imageUrl && (
        <div className={`md:col-span-4 ${imageOnLeft ? 'md:order-first' : ''} ${!imageOnLeft ? 'md:col-start-2' : ''}`}>
          {image}
        </div>
      )}
    </div>
  );
};


const History = () => {
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
  const [modalImageAlt, setModalImageAlt] = useState<string>('');

  const openModal = (src: string, alt: string) => {
    const imageUrl = typeof src === 'string' ? src : (src as any).src || src;
    setModalImageSrc(imageUrl);
    setModalImageAlt(alt);
  };

  const closeModal = () => {
    setModalImageSrc(null);
    setModalImageAlt('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50"> {/* Яркий фон */}
      <Header />
      
      <ImageModal src={modalImageSrc} alt={modalImageAlt} onClose={closeModal} />

      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12"> {/* Новый контейнер */}
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                 <BookOpen className="w-10 h-10 mr-4 text-accent" />
                История техникума
              </h1>
               <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
                 От 1930 года до наших дней: 95 лет на службе образования и транспорта.
               </p>
              
              {/* ✅ РЕДИЗАЙН: Вся история представлена в виде временной шкалы */}
              <div className="relative space-y-16">
                
                {/* 1930: Основание */}
                <TimelineItem 
                  year="1930" 
                  title="Основание техникума" 
                  imageUrl={image1930} 
                  imageAlt="Историческое фото 1930" 
                  openModal={openModal} 
                  imageOnLeft={true}
                >
                  <p>
                    Открытие техникума в городе Тихорецке состоялось в октябре 1930 года. Учебное заведение получило название - Тихорецкий механический техникум Азово-Черноморской железной дороги дирекции Народного комиссариата путей сообщения СССР. Начальником был назначен Макашин В.П.
                  </p>
                  <p>
                    В 30-е годы техникум располагался в двухэтажном здании, на углу улиц Красноармейской и Угольной, в одном здании шли занятия, в другом - было общежитие для иногородних студентов. Обучение проводилось по двум специальностям: «Паровозы и паровозное хозяйство», «Вагоны и вагонное хозяйство».
                  </p>
                </TimelineItem>
                
                {/* 1934-1947: Военные годы */}
                <TimelineItem 
                  year="1934" 
                  title="Военные годы и Восстановление"
                  openModal={openModal}
                  imageOnLeft={false} // Текст будет слева
                >
                   <p>
                    В декабре 1934 году учебное заведение возглавил опытный производственник Сакварелидзе М.А. Техникум успешно развивался, но грянула Великая Отечественная война. С сентября 1941 года Тихорецк подвергался постоянным вражеским налетам. В начале войны почти пятая часть тихоречан ушла на фронт.
                  </p>
                  <p>
                    С 5 августа 1942 года по 30 января 1943 года город Тихорецк подвергся оккупации. Техникум был эвакуирован в Закавказье, затем в Ставрополь. Студенты, выпускники и сотрудники техникума уходили на фронт в числе первых. Многие из них навсегда остались на местах сражений: Волков Андрей - погиб под Сталинградом, Лопатин Анатолий – в двадцать три года командовал полком, погиб в Германии, удостоен звания Героя Советского Союза (посмертно). Храбро сражались на фронтах братья Ивановы: Алексей - боевой летчик и Виктор - участник обороны Северного Кавказа. Отличились воспитанники техникума: Виктор Нашивочников - защищал перевалы главного Кавказского хребта, Николай Бутов - сопровождал эшелоны с боевой техникой и боеприпасами и многие другие.
                  </p>
                  <p>
                     В 1947 году техникум под руководством Артеменко А.Г. был возвращён в город Тихорецк и продолжил свою деятельность в здании школы № 35, ныне это первый учебный корпус, и получил название - Тихорецкий техникум железнодорожного транспорта Министерства путей сообщения СССР.
                  </p>
                   <p>
                     После Великой Отечественной войны в техникуме работали фронтовики – это Александрова Т.М., Александров В.П., Борисов И.А., Бутов Н.В., Волкова М.А., Гаврилей К.Ф., Гаврилов Д.А., Доброскокин Н.А., Дрыгин М.Ф., Карпунин В.Ф., Котельников В.И., Плотников В.П., Плужников А.Г., Селихов В.И., Сергиенко П.В. Коллектив преподавателей и студентов своими силами восстанавливал материальную базу, которая состояла в послевоенное время из 10 кабинетов и учебно-производственных мастерских.
                  </p>
                </TimelineItem>

                 {/* 1970-2000-е: Рост */}
                <TimelineItem 
                  year="70-е" 
                  title="Рост и Развитие" 
                  imageUrl={imageWar} 
                  imageAlt="Современный вид" 
                  openModal={openModal}
                  imageOnLeft={true}
                >
                  <p>
                    С годами расширялась и укреплялась учебно-лабораторная база техникума. В 70-е годы XX века Северо-Кавказская железная дорога выделила средства на пристройку к учебному корпусу, а также на строительство спортивного зала и учебных мастерских. В 80-е гг. XX в. было построено пятиэтажное здание общежития на 360 мест, плавательный бассейн, второй учебный корпус и с этого времени техникум перешел на кабинетную систему. Значительный вклад в развитие учебного заведения в 70-90-е годы внесли директора: Бутов Н.В., Кочеляев Н.Я., Аленченко Г.А., Сарвилкин Ю.А.
                  </p>
                  <p>
                     В начале ХХ века под руководством директора Арефьева В.М. проведен капитальный ремонт 1-го и 2-го учебных корпусов, открыт 3-й корпус, 2-е общежитие, учебный полигон железнодорожных машин, автодром, комфортабельная столовая и стадион. Кабинеты и лаборатории были оснащены оборудованием и компьютерной техникой.
                  </p>
                </TimelineItem>

                 {/* 2025: Новая эра */}
                <TimelineItem 
                  year="2025" 
                  title="Новая эра: Инновации и Лидерство" 
                  imageUrl={imageModern} 
                  imageAlt="Завьялов Андрей Александрович" 
                  openModal={openModal}
                  imageOnLeft={false} // Текст слева
                >
                   <p>
                    С июня 2025 года ТТЖТ-филиал РГУПС возглавил <strong>Андрей Александрович Завьялов</strong>, кандидат философских наук. Инновационная деятельность педагогического коллектива под руководством Завьяллова А.А. направлена на повышение качества преподавательского состава, создание современной материально-технической базы, внедрение современных информационных технологий и социального партнёрства.
                  </p>
                  <p>
                    Это позволяет техникуму ежегодно осуществлять обучение по 11 лицензированным специальностям: «Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин и оборудования (по отраслям)»; «Техническая эксплуатация подвижного состава железных дорог»; «Автоматика и телемеханика на транспорте (на железнодорожном транспорте)»; «Организация перевозок и управление на транспорте (по видам)»; «Строительство железных дорог, путь и путевое хозяйство»; «Строительство и эксплуатация зданий и сооружений»; «Компьютерные системы и комплексы»; «Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)»; «Сварочное производство»; «Электроснабжение»; «Экономика и бухгалтерский учет (по отраслям)».
                  </p>
                   <p>
                    На современном этапе техникум состоит из 4-х учебных корпусов, 2-х студенческих общежитий, учебно-производственных мастерских, учебного полигона, автодрома, библиотеки, комфортабельной столовой, большого спортивного комплекса, включающего стадион, плавательный бассейн, спортивный и тренажерный залы.
                  </p>
                </TimelineItem>

                {/* --- Секция Достижения --- */}
                <section className="relative pt-8">
                  {/* Иконка */}
                  <div className="hidden md:flex justify-center md:col-span-1">
                    <div className="absolute top-8 h-full border-l-2 border-primary/30 z-0" style={{top: '5rem'}}></div>
                    <div className="relative z-10 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white">
                      <Award className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  {/* Карточка */}
                   <div className="md:ml-[calc(50%+1.5rem)] bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200 rounded-2xl p-8 shadow-lg">
                      <h2 className="text-3xl font-bold text-green-800 mb-4 text-center md:text-left">Современность и достижения</h2>
                       <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4 text-justify">
                        <p>
                          По результатам рейтинговой оценки деятельности филиалов и структурных подразделений среднего профессионального образования государственных университетов путей сообщения Росжелдора более 10 лет ТТЖТ-филиал РГУПС занимает лидирующие места, 2023 и 2024 год – первое место среди образовательных организаций железнодорожного транспорта России.
                        </p>
                        <p>
                          На базе техникума ежегодно проходит большое количество мероприятий... В конференциях принимают участие студенты техникумов, колледжей и университетов из городов Беларуси, Казахстана и России.
                        </p>
                         <p>
                          С 2014 года в техникуме формируются студенческие трудовые отряды, которые становятся победителями в ежегодном краевом конкурсе среди студенческих трудовых отрядов.
                        </p>
                        <p className="font-semibold text-green-800">
                          Вот уже 95 лет Тихорецкий техникум железнодорожного транспорта – филиал ФГБОУ ВО РГУПС выпускает высококлассных специалистов. Количество выпускников с момента основания ТТЖТ-филиала РГУПС по программам СПО – свыше 26 000 человек, по программам дополнительного профессионального обучения более 30 000 человек. И славная история техникума продолжается!
                        </p>
                      </div>
                   </div>
                </section>

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

export default History;