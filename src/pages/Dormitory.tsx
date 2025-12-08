import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Home, ShieldCheck, Accessibility, Users, Phone } from 'lucide-react';
import { settingsApi } from '@/api/settings';

// Дефолтные импорты
import img1 from '@/assets/pictures/home/phoca_thumb_l_285.jpg';
import img2 from '@/assets/pictures/home/phoca_thumb_l_287.jpg';
import img3 from '@/assets/pictures/home/phoca_thumb_l_289.jpg';
import img4 from '@/assets/pictures/home/phoca_thumb_l_292.jpg';
import img5 from '@/assets/pictures/home/phoca_thumb_l_297.jpg';
import img6 from '@/assets/pictures/home/phoca_thumb_l_298.jpg';
import img7 from '@/assets/pictures/home/phoca_thumb_l_8499.jpg';
import img8 from '@/assets/pictures/home/phoca_thumb_l_8500.jpg';

const InfoSection = ({ icon: Icon, title, children }: { icon: React.ElementType, title: string, children: React.ReactNode }) => (
  <div className="flex flex-col sm:flex-row items-start gap-6">
    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
      <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      {/* Добавлен класс rich-text-content для корректного отображения HTML из редактора */}
      <div className="space-y-4 text-muted-foreground leading-relaxed rich-text-content">
        {children}
      </div>
    </div>
  </div>
);

const Dormitory = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [data, setData] = useState({
        slides: [img1, img2, img3, img4, img5, img6, img7, img8],
        conditions_text: `<p>Студенческое общежитие нашего техникума признано одним из лучших среди техникумов Краснодарского края. В общежитии 396 мест для иногородних студентов дневного обучения.</p><p>Студенты проживают в 2-х и 3-х местных комнатах, укомплектованы необходимой мебелью: кроватями, прикроватными тумбочками , шкафами для хранения одежды, пеналами для хранения посуды и продуктов ,столами, стульями, а так же мягким инвентарём (матрацами, одеялами, подушками и постельным бельём). На каждом этаже располагается по две кухни, душевые и туалетные комнаты, гладильная. Организована работа прачечной, в течении дня (с 9:00час. до 17 час.), имеется изолятор.</p>`,
        security_text: `<p>Согласно Закону Краснодарского края №1539-КЗ «О мерах по профилактике безнадзорности и правонарушений несовершеннолетних в Краснодарском крае» студенты должны находиться в общежитии в 22:00 час. В случаи необходимости выезда из общежития, студент должен согласовать свой отъезд с администрацией техникума и зарегистрироваться в журнале отъезда.</p><p>Для обеспечения личной и общественной безопасности проживающих в общежитии студентов действует пропускная система. На входе в общежитие постоянно находится дежурный по общежитию. Пост дежурного по общежитию обеспечен телефонной и радиосвязью, имеется кнопка экстренного вызова, видеонаблюдение всех этажей и наружное наблюдение. Установлена современная противопожарная сигнализация.</p>`,
        staff_text: `<p>Койко-место в общежитии предоставляется на основании заявления студента. В первую очередь обеспечивает общежитием социально-незащищённые студенты: учащиеся из числа детей-сирот и детей, оставшихся без попечения родителей, неполных, малообеспеченных, многодетных семей и студенты, обучающиеся по целевым направлениям. В общежитии есть wi-fi.</p><p>Круглосуточно со студентами работают воспитатели.</p>`,
        accessibility_text: `<p>Здания общежитий ТТЖТ - филиала РГУПС оборудованы элементами доступа для инвалидов, среди которых: наличие кнопки вызова персонала, установленной на входе в общежитие; наличие широких дверных проемов, двери с механизмом доводчика, комнаты для проживания на первом этаже.</p>`,
        contact_phone: "8 (86196) 6-20-03 доб. 129",
        contact_name: "Алферова Галина Васильевна"
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('dormitory_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        slides: (settings.slides && settings.slides.length > 0) ? settings.slides : prevData.slides,
                        conditions_text: settings.conditions_text || prevData.conditions_text,
                        security_text: settings.security_text || prevData.security_text,
                        staff_text: settings.staff_text || prevData.staff_text,
                        accessibility_text: settings.accessibility_text || prevData.accessibility_text,
                        contact_phone: settings.contact_phone || prevData.contact_phone,
                        contact_name: settings.contact_name || prevData.contact_name
                    }));
                }
            } catch (error) {
                console.error('Error loading dormitory data:', error);
            }
        };
        loadData();
    }, []);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % data.slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + data.slides.length) % data.slides.length);

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-4 md:p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Общежитие</h1>
                
                <div className="relative max-w-4xl mx-auto mb-12">
                    <div className="aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-border/20">
                        <img
                            src={data.slides[currentSlide]}
                            alt="Общежитие слайд"
                            className="w-full h-full object-cover transition-opacity duration-300"
                        />
                    </div>

                    <button onClick={prevSlide} className="absolute left-0 sm:-left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200">
                        <ChevronLeft className="w-6 h-6 text-primary" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-0 sm:-right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 shadow-md hover:shadow-lg transition-all duration-200">
                        <ChevronRight className="w-6 h-6 text-primary" />
                    </button>
                    
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 mt-4">
                        {data.slides.map((src, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`aspect-video rounded-md overflow-hidden border-2 transition-all duration-200 ${index === currentSlide ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                                <img src={src} alt={`thumb ${index}`} className="w-full h-full object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 md:p-10 space-y-10">
                    <InfoSection icon={Home} title="Условия проживания">
                        <div dangerouslySetInnerHTML={{ __html: data.conditions_text }} />
                    </InfoSection>

                    <InfoSection icon={ShieldCheck} title="Правила и безопасность">
                        <div dangerouslySetInnerHTML={{ __html: data.security_text }} />
                    </InfoSection>

                    <InfoSection icon={Users} title="Персонал и доступ">
                        <div dangerouslySetInnerHTML={{ __html: data.staff_text }} />
                    </InfoSection>
                    
                    <InfoSection icon={Accessibility} title="Доступная среда">
                        <div dangerouslySetInnerHTML={{ __html: data.accessibility_text }} />
                    </InfoSection>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
                        <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-4 sm:gap-8">
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-semibold">Телефон: {data.contact_phone}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-primary" />
                                <span className="text-foreground font-semibold">Заведующая: {data.contact_name}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dormitory;