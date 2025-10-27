import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Victory80 = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentSlideLopatinCarousel, setCurrentSlideLopatinCarousel] = useState(0);
  const [currentSlideArchiveCarousel, setCurrentSlideArchiveCarousel] = useState(0);
  const [currentSlideMuseumCarousel, setCurrentSlideMuseumCarousel] = useState(0);
  const [currentSlideRoundTableCarousel, setCurrentSlideRoundTableCarousel] = useState(0);
  const [currentSlideHistoryCarousel, setCurrentSlideHistoryCarousel] = useState(0);
  const [currentSlideDictantCarousel, setCurrentSlideDictantCarousel] = useState(0);
  const [currentSlideBookCarousel, setCurrentSlideBookCarousel] = useState(0);
  const [currentSlideExcursionsCarousel, setCurrentSlideExcursionsCarousel] = useState(0);

  const teachersImages = [
    'https://i.ibb.co/5ghv2M3M/phoca-thumb-l-8223.jpg',
    'https://i.ibb.co/rGSNfLz9/phoca-thumb-l-8224.jpg',
    'https://i.ibb.co/QFm8P9Wr/phoca-thumb-l-8225.jpg',
    'https://i.ibb.co/YB3bNTSb/phoca-thumb-l-8226.jpg',
    'https://i.ibb.co/PsbjhPpV/phoca-thumb-l-8227.jpg', 
    'https://i.ibb.co/r2dqxxH5/phoca-thumb-l-8228.jpg',
    'https://i.ibb.co/GfR457tZ/phoca-thumb-l-8229.jpg', 
    'https://i.ibb.co/qFBLCm1h/phoca-thumb-l-8230.jpg',
    'https://i.ibb.co/d0y7gDhH/phoca-thumb-l-8231.jpg',
    'https://i.ibb.co/rffsxtpL/phoca-thumb-l-8232.jpg',
    'https://i.ibb.co/93tQ3Rtt/phoca-thumb-l-8233.jpg',
    'https://i.ibb.co/Rpcg7dxG/phoca-thumb-l-8234.jpg',//
    'https://i.ibb.co/ksTNt6Tr/phoca-thumb-l-8235.jpg',
    'https://i.ibb.co/C3YWjdLs/phoca-thumb-l-8236.jpg',
    'https://i.ibb.co/GyGS32t/phoca-thumb-l-8237.jpg',
    'https://i.ibb.co/qYb64dMB/phoca-thumb-l-8238.jpg',
    'https://i.ibb.co/0RWkhcPn/phoca-thumb-l-8512.jpg'
  ];
  const graduatesImages = [
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302984/phoca_thumb_l_8239_ua5lyh.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302984/phoca_thumb_l_8240_lucoqa.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302984/phoca_thumb_l_8241_udsa0f.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8242_o0cu7a.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302984/phoca_thumb_l_8243_uewtfr.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8244_eskpot.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8245_d8nww4.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8246_i1e20t.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8247_mj39ob.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8248_digfbr.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8249_lx7qid.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8250_ubzju0.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760302983/phoca_thumb_l_8251_s6r1mc.jpg',
    'https://res.cloudinary.com/dzbqwcdwc/image/upload/v1760303444/phoca_thumb_l_8255_wcxiuj.jpg'
  ];

  const lopatinImages = [
    '/victory/lopatin-1.jpg',
    '/victory/lopatin-2.jpg',
    '/victory/lopatin-3.jpg',
    '/victory/lopatin-4.jpg'
  ];

  const archiveImages = [
    '/victory/archive-1.jpg',
    '/victory/archive-2.jpg',
    '/victory/archive-3.jpg'
  ];

  const museumLessonImages = Array.from({ length: 12 }, (_, i) => `/victory/museum-lesson/lesson-${i + 1}.jpg`);

  const roundTableImages = Array.from({ length: 8 }, (_, i) => `/victory/round-table/round-${i + 1}.jpg`);

  const historyAlivesImages = Array.from({ length: 5 }, (_, i) => `/victory/history-alives/history-${i + 1}.jpg`);

  const dictantImages = Array.from({ length: 10 }, (_, i) => `/victory/dictant/dictant-${i + 1}.jpg`);

  const bookImages = Array.from({ length: 7 }, (_, i) => `/victory/book/book-${i + 1}.jpg`);

  const excursionsImages = Array.from({ length: 7 }, (_, i) => `/victory/excursions/excursion-${i + 1}.jpg`);

  const nextSlide = (carouselName: string, imagesLength: number) => {
    if (carouselName === 'lopatin') {
      setCurrentSlideLopatinCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'archive') {
      setCurrentSlideArchiveCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'museum') {
      setCurrentSlideMuseumCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'roundTable') {
      setCurrentSlideRoundTableCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'history') {
      setCurrentSlideHistoryCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'dictant') {
      setCurrentSlideDictantCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'book') {
      setCurrentSlideBookCarousel((prev) => (prev + 1) % imagesLength);
    } else if (carouselName === 'excursions') {
      setCurrentSlideExcursionsCarousel((prev) => (prev + 1) % imagesLength);
    }
  };

  const prevSlide = (carouselName: string, imagesLength: number) => {
    if (carouselName === 'lopatin') {
      setCurrentSlideLopatinCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'archive') {
      setCurrentSlideArchiveCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'museum') {
      setCurrentSlideMuseumCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'roundTable') {
      setCurrentSlideRoundTableCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'history') {
      setCurrentSlideHistoryCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'dictant') {
      setCurrentSlideDictantCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'book') {
      setCurrentSlideBookCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    } else if (carouselName === 'excursions') {
      setCurrentSlideExcursionsCarousel((prev) => (prev - 1 + imagesLength) % imagesLength);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">80 лет Великой Победы</h1>

              <Accordion type="single" collapsible className="space-y-4">
                {/* Блок 1: Бессмертный полк ТТЖТ */}
                <AccordionItem value="block-1" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">Бессмертный полк ТТЖТ</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-8">
                      {/* Пост 1: Преподаватели */}
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">Участники Великой Отечественной войны - преподаватели</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {teachersImages.map((img, index) => (
                            <div
                              key={index}
                              className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-border"
                              onClick={() => setSelectedImage(img)}
                            >
                              <img
                                src={img}
                                alt={`Преподаватель - участник ВОВ ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Пост 2: Выпускники */}
                      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">Участники Великой Отечественной войны - выпускники</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {graduatesImages.map((img, index) => (
                            <div
                              key={index}
                              className="aspect-[3/4] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-border"
                              onClick={() => setSelectedImage(img)}
                            >
                              <img
                                src={img}
                                alt={`Выпускник - участник ВОВ ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Блок 2: Судьба солдата */}
                <AccordionItem value="block-2" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">Судьба солдата</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                      <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-4">
                          <p><strong>Автор:</strong> Воярж Е.В.</p>
                          <p><strong>Создано:</strong> 25 февраля 2025</p>
                        </div>
                      </div>

                      <div className="relative max-w-4xl mx-auto mb-6">
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                             onClick={() => setSelectedImage(lopatinImages[currentSlideLopatinCarousel])}>
                          <img
                            src={lopatinImages[currentSlideLopatinCarousel]}
                            alt="Лопатин Анатолий Алексеевич"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <button
                          onClick={() => prevSlide('lopatin', lopatinImages.length)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                        >
                          <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>

                        <button
                          onClick={() => nextSlide('lopatin', lopatinImages.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                        >
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </button>

                        <div className="flex justify-center space-x-2 mt-4">
                          {lopatinImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlideLopatinCarousel(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentSlideLopatinCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="prose max-w-none text-foreground leading-relaxed">
                        <p className="mb-4">
                          Родился Анатолий Алексеевич Лопатин 27 ноября 1920 года в селе Чилгир Яшкульского района Калмыкии, в семье крестьянина. Русский. Там он рос, учился в школе. В 1935 г. его семья переехала в г. Будённовск. Анатолий приехал в Тихорецк, поступил разметчиком на паровозоремонтный завод имени В.В. Воровского и одновременно учился в Тихорецком механическом техникуме Азово-Черноморской железной дороги дирекции Народного комиссариата путей сообщения СССР (современное название - Тихорецкий техникум железнодорожного транспорта – филиал ФГБОУ ВО РГУПС), который окончил в 1938 г.
                        </p>

                        <p className="mb-4">
                          По направлению Тихорецкого райвоенкомата Лопатин А.А. в декабре 1939 г. уехал в Краснодарское пехотное училище, которое окончил в 1941 г. Впоследствии прошёл обучение на курсах «Выстрел» в 1942 году и на курсах усовершенствования офицерского состава (КУОС) в 1943 году. Член ВКП(б) с 1943 года.
                        </p>

                        <p className="mb-4">
                          В боях — с июля 1942 г. Командовал взводом, ротой, затем батальоном, был трижды ранен. Принимал участие оборонительных боях на Южном фронте, отличился при форсировании рек Молочная, Днепр, Южный Буг, Днестр в 1943-1944 гг.
                        </p>

                        <p className="mb-4">
                          В 1944 году майор Анатолий Алексеевич Лопатин, в двадцать три года, принял командование 463-м стрелковым полком 118 стрелковой Мелитопольской дивизии 1-го Украинского фронта.
                        </p>

                        <p className="mb-4">
                          16 апреля 1945 года его полк прорвал оборону противника, форсировал реку Шпрею и захватил плацдарм на её западном берегу. Майор Лопатин умело руководил боевыми действиями полка в сложных условиях. Полк захватил 3 батареи, сжёг 3 самоходные установки и подбил два танка, уничтожили большое количество живой силы противника.
                        </p>

                        <p className="mb-4">
                          Весной 1945 года полк майора Лопатина А.А. вёл наступление в Германии. 22 апреля полк занял город Финстервальд. Именно в этот день Анатолий Алексеевич погиб на окраине города Зальхаузена.
                        </p>

                        <p className="mb-4">
                          Похоронен в Германии, провинция Саксония, в районе Торгау, город Анабург, на площади Маркт.
                        </p>

                        <p className="mb-4">
                          27 июня 1945 года Анатолию Алексеевичу Лопатину, командиру 463-го стрелкового Висленского полка 118 стрелковой Мелитопольской дивизии 1-го Украинского фронта Указом Президиума Верховного Совета СССР от 27.06. 1945 г. № 1368 присвоено звание Героя Советского Союза (посмертно).
                        </p>

                        <p className="mb-4">
                          Награды Анатолия Алексеевича Лопатина - Героя Советского Союза: Орден Ленина, Орден Александра Невского (дважды), Орден Отечественной войны II-ой степени, медали «Золотая Звезда» и «За отвагу».
                        </p>

                        <p>
                          В 2010 году на здании ТТЖТ-филиала РГУПС установлена Памятная доска Герою Советского Союза Лопатину Анатолию Алексеевичу.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Блок 3: Из музейного архива */}
                <AccordionItem value="block-3" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">Из музейного архива</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6">
                      <div className="mb-6">
                        <div className="text-sm text-muted-foreground mb-4">
                          <p><strong>Автор:</strong> Воярж Е.В.</p>
                          <p><strong>Создано:</strong> 17 марта 2025</p>
                        </div>
                      </div>

                      <div className="relative max-w-4xl mx-auto mb-6">
                        <div className="aspect-[16/10] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                             onClick={() => setSelectedImage(archiveImages[currentSlideArchiveCarousel])}>
                          <img
                            src={archiveImages[currentSlideArchiveCarousel]}
                            alt="Из музейного архива"
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <button
                          onClick={() => prevSlide('archive', archiveImages.length)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                        >
                          <ChevronLeft className="w-6 h-6 text-primary" />
                        </button>

                        <button
                          onClick={() => nextSlide('archive', archiveImages.length)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                        >
                          <ChevronRight className="w-6 h-6 text-primary" />
                        </button>

                        <div className="flex justify-center space-x-2 mt-4">
                          {archiveImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlideArchiveCarousel(index)}
                              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                index === currentSlideArchiveCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="prose max-w-none text-foreground leading-relaxed">
                        <p className="mb-4">
                          Выпускная фотография студентов IV курса Тихорецкого механического техникума путей сообщения (ныне ТТЖТ-филиал РГУПС) сделана 30.IV.1939 года. До Великой Отечественной войны оставалось 2 года. Как сложилась жизнь этих ребят?
                        </p>

                        <p className="mb-4">
                          На фотографии второй слева в третьем ряду – Александр Григорьевич Кондратьев (1919 – 1942 гг.)
                        </p>

                        <p className="mb-4">
                          Александр родился в 1919 году, уроженец города Тихорецка, выпускник Тихорецкой школы № 34. В 1939 году окончил Тихорецкий механический техникум путей сообщения, после техникума – курсы в Батайской авиашколе.
                        </p>

                        <p className="mb-4">
                          Был призван в армию в 1940 году Тихорецким РВК. На войне был сержантом, лётчиком 739-го истребительного авиаполка 16-й Воздушной армии. 23 сентября 1942 г. не вернулся с боевого задания по прикрытию советских войск под Сталинградом, был убит.
                        </p>

                        <p>
                          С фронта он писал своим родным письма, которые сохранились по сей день. Также сохранились его фотографии, которые были переданы в Тихорецкий историко – краеведческий музей в 80-е годы ХХ века городским штабом «Факел» по увековечиванию памяти тихоречан, погибших и пропавших без вести в годы Великой Отечественной войны.
                        </p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Блок 4: Сохраняя память */}
                <AccordionItem value="block-4" className="border border-border rounded-lg">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <h2 className="text-2xl font-bold text-primary">Сохраняя память</h2>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                    <div className="space-y-8">
                      {/* Пост 1: Урок в музее о войне */}
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">УРОК В МУЗЕЕ О ВОЙНЕ</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Воярж Е.В.</p>
                            <p><strong>Создано:</strong> 17 февраля 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(museumLessonImages[currentSlideMuseumCarousel])}>
                            <img
                              src={museumLessonImages[currentSlideMuseumCarousel]}
                              alt="Урок в музее о войне"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('museum', museumLessonImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('museum', museumLessonImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {museumLessonImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideMuseumCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideMuseumCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            В рамках месячника оборонно-массовой и военно-патриотической работы, приуроченного к празднованию Дня защитника Отечества и Году защитника Отечества состоялись тематические экскурсии об освобождении города Тихорецка и Тихорецкого района от немецко-фашистских захватчиков.
                          </p>

                          <p className="mb-4">
                            В экспозиционном зале Тихорецкого историко-краеведческого музея «Тихорецк в годы Великой Отечественной войны» студенты 1-х курсов узнали о подвигах железнодорожников и воинах-освободителях, названиях улиц и памятниках военной эпохи в Тихорецке.
                          </p>

                          <p className="mb-4">
                            В годы Великой Отечественной войны тихорецкие железнодорожники за счет добровольных взносов построили 2 бронепоезда «Тихорецкий железнодорожник» и «Николай Щорс», кроме того, построили 16 бронеплощадок, 14 бронеплатформ ПВО и отремонтировали 4 бронепоезда.
                          </p>

                          <p className="mb-4">
                            В грозное время с октября 1941 по 1943 годы Северо – Кавказская железная дорога оказалась районом кровопролитных боевых действий. Здесь сражались 17 отдельных дивизионов бронепоездов из 32, участвовавших на всех фронтах Великой Отечественной. Бронепоезда использовались как для боевой разведки, так и для совместных действий с пехотой и конницей. Дерзкий выезд на открытые огневые позиции и огонь по врагу в упор — такова основная тактика бронепоездов. Добычей советских бронепоездов были живая сила врага, артиллерийские орудия, бронемашины, танки, случалось, сбивали и самолеты. Построенные тихоречанами бронепоезда уже осенью 1941 г. принимали участие в боях под Ростовом-на-Дону, летом 42-го в составе 8-го отдельного дивизиона бронепоездов они встали на пути немцев, рвавшихся в сальские степи.
                          </p>

                          <p className="mb-4">
                            Студенты техникума продолжают исследовательскую работу о событиях Великой Отечественной войне. После экскурсии, каждый студент получил задание, написать эссе о Тихорецке в годы Великой Отечественной войны.
                          </p>

                          <p>
                            Экспозиционный центр ТТЖТ выражает благодарность сотрудникам Тихорецкого историко-краеведческого музея за помощь в поисковой работе!
                          </p>
                        </div>
                      </div>

                      {/* Пост 2: Круглый стол */}
                      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">КРУГЛЫЙ СТОЛ С ВОИНАМИ – ИНТЕРНАЦИОНАЛИСТАМИ И УЧАСТНИКАМИ СВО</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Воярж Е.В.</p>
                            <p><strong>Создано:</strong> 17 февраля 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(roundTableImages[currentSlideRoundTableCarousel])}>
                            <img
                              src={roundTableImages[currentSlideRoundTableCarousel]}
                              alt="Круглый стол с воинами"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('roundTable', roundTableImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('roundTable', roundTableImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {roundTableImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideRoundTableCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideRoundTableCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            В честь памятной даты отечественной истории - Дня памяти россиян, исполнявших служебный долг за пределами Отечества, в музее ТТЖТ состоялся круглый стол, на который были приглашены А.В. Бондарев, Г.А. Беркус - участники боевых действий в республике Афганистан и И.Ю. Терлецкий - участник Специальной военной операции. На мероприятии присутствовали учебные групп КС-1-1, Р-2-1 и члены патриотического объединения «Память» Экспоцентра техникума.
                          </p>

                          <p className="mb-4">
                            Говорили о событиях Великой Отечественной войны, об истории афганской войны и о ситуации на СВО.
                          </p>

                          <p className="mb-4">
                            Анатолий Васильевич Бондарев, выпускник техникума 1983 года, рассказывал о службе в армии. вспоминал своих боевых товарищей, их подвиги. С особым чувством Бондарев А.В. и Воярж Е.В. вспоминали Коляниченко Константина, отдавшего свою жизнь, спасая товарищей в Афганистане. Елена Владимировна показала студентам диплом с отличием Константина, его зачётную книжку, фотографии и письма, хранящиеся в музее техникума.
                          </p>

                          <p className="mb-4">
                            Геннадий Александрович Беркус отметил, что памятная дата 15 февраля установлена, чтобы напомнить о военнослужащих, которые в условиях сложной обстановки в Афганистане стойко и мужественно противостояли силам международного терроризма и наркобизнеса, а также в память о более 15 тысячах советских солдат и офицеров, не вернувшихся с афганской войны. И поэтому воины-интернационалисты встречаются с молодёжью, а 15 февраля все собираются на митинг у памятника афганцам и вспоминают своих боевых товарищей.
                          </p>

                          <p className="mb-4">
                            Игорь Юрьевич Терлецкий рассказал о своём участии в СВО и подчеркнул, что Россия и сегодня продолжает нести особую ответственность за сохранение безопасности во всём мире.
                          </p>

                          <p className="mb-4">
                            Ольга Николаевна Ярошевская, заместитель директора по воспитательной работе, особо подчеркнула необходимость противодействия идеологии терроризма и экстремизма на территории России.
                          </p>

                          <p>
                            Завершилась памятная встреча записью в Книге Почётных гостей и фотографией на память.
                          </p>
                        </div>
                      </div>

                      {/* Пост 3: В музее история оживает */}
                      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">В МУЗЕЕ ИСТОРИЯ ОЖИВАЕТ</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Администратор</p>
                            <p><strong>Создано:</strong> 18 марта 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(historyAlivesImages[currentSlideHistoryCarousel])}>
                            <img
                              src={historyAlivesImages[currentSlideHistoryCarousel]}
                              alt="В музее история оживает"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('history', historyAlivesImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('history', historyAlivesImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {historyAlivesImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideHistoryCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideHistoryCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            В музее история оживает, визуализируется. По средствам музейных предметов, документальных источников и фотографий военных лет происходит погружение в эпоху. Участники экскурсии становятся свидетелями произошедших событий, что вызывает у ребят эмоции и чувство сопричастности.
                          </p>

                          <p className="mb-4">
                            Студенты Тихорецкого техникума железнодорожного транспорта побывали на экскурсии по теме «Наш край в годы Великой Отечественной войны» в Экспоцентре ТТЖТ-филиала РГУПС и в Тихорецком историко-краеведческом музее.
                          </p>

                          <p>
                            Экскурсия в музей – лучшее закрепление материала, пройденного на уроках истории.
                          </p>
                        </div>
                      </div>

                      {/* Пост 4: Диктант Победы */}
                      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">ДИКТАНТ ПОБЕДЫ – 2025</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Воярж Е.В.</p>
                            <p><strong>Создано:</strong> 07 мая 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(dictantImages[currentSlideDictantCarousel])}>
                            <img
                              src={dictantImages[currentSlideDictantCarousel]}
                              alt="Диктант Победы"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('dictant', dictantImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('dictant', dictantImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {dictantImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideDictantCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideDictantCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            «Диктант Победы» — это масштабная просветительская акция, приуроченная к празднованию Дня Победы. В этом году атмосфера вокруг мероприятия особая, ведь в мае весь мир отметит 80-летний юбилей Победы над фашизмом.
                          </p>

                          <p className="mb-4">
                            Торжественная церемония открытия состоялась 25 апреля на центральной площадке Международной патриотической акции «Диктант Победы», прямая трансляция велась для 2 миллионов участников в России и 84 странах.
                          </p>

                          <p className="mb-4">
                            Традиционно акция «Диктант Победы» прошла офлайн на региональных площадках по всей России и за рубежом, а также онлайн на официальном сайте акции диктантпобеды.рф в формате тестирования. Участники отвечали на вопросы разного уровня сложности, связанные с историей Великой Отечественной войны. В 2025 году впервые часть вопросов посвящена специальной военной операции.
                          </p>

                          <p className="mb-4">
                            Студенты ТТЖТ-филиала РГУПС, группы Р-2-1, приняли участие в акции на площадке Тихорецкого историко-краеведческого музея. Елена Владимировна Воярж, кандидат исторических наук, преподаватель истории ТТЖТ-филиала РГУПС, поздравила участников акции с приближающейся датой – 80-летием Победы советского народа в Великой Отечественной войне и подчеркнула, что основная задача диктанта - объединить всех граждан России, ведь наше благополучие напрямую связано с единством нации, уважением к своему прошлому и доверием друг к другу.
                          </p>

                          <p className="mb-4">
                            Все участники Диктанта Победы получили дипломы участника.
                          </p>

                          <p>
                            Благодарим всех, принявших участие в патриотической акции!
                          </p>
                        </div>
                      </div>

                      {/* Пост 5: Книга о войне и об отце */}
                      <div className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">КНИГА О ВОЙНЕ И ОБ ОТЦЕ</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Воярж Е.В.</p>
                            <p><strong>Создано:</strong> 07 мая 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(bookImages[currentSlideBookCarousel])}>
                            <img
                              src={bookImages[currentSlideBookCarousel]}
                              alt="Книга о войне и об отце"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('book', bookImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('book', bookImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {bookImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideBookCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideBookCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            Презентация книги «Великая Отечественная война» состоялась в Тихорецком историко-краеведческом музее. Автор книги Чумбасов Владимир Григорьевич. Он писал рукопись в течении нескольких лет о своём отце Мацюк Григории Терентьевиче основываясь на воспоминаниях героя войны, а также используя документы военных лет. Владимира Григорьевича нет в живых, но его супруга Чумбасова Людмила Ивановна, а также дети и внучка приняли активное участие в публикации рукописи.
                          </p>

                          <p className="mb-4">
                            Людмила Ивановна рассказала о боевом пути Мацюк Григория Терентьевича, участнике боевых действий на озере Хасан в 1938 году, участнике Великой Отечественной войны. Мацюк Г.Т. награждён орденами Красной Звезды (дважды), Красное Знамя (трижды), орденами Отечественной войны I и II степени, многочисленными медалями. Гвардии полковник Мацюк Григорий Терентьевич участник участвовал в Сталинградской битве, в освобождении Варшавы и Праги.
                          </p>

                          <p className="mb-4">
                            Людмила Ивановна подарила книгу «Великая Отечественная война» музею нашего техникума с дарственной подписью.
                          </p>

                          <p className="mb-4">
                            На презентации книги выступил и друг автора книги Кривошеев Александр Яковлевич, который обратил внимание студентов, собравшихся на мероприятии, на необходимость изучения истории своей страны и своей семьи.
                          </p>

                          <p>
                            Музей истории техникума выражает благодарность семье ветерана войны Мацюка Г.Т. за тёплую встречу, воспоминания и подаренную книгу, а также руководству Тихорецкого историко-краеведческого музея за организацию мероприятия.
                          </p>
                        </div>
                      </div>

                      {/* Пост 6: Экскурсии о подвигах */}
                      <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">ЭКСКУРСИИ О ПОДВИГАХ ВЫПУСКНИКОВ И ПРЕПОДАВАТЕЛЕЙ ТТЖТ</h3>

                        <div className="mb-6">
                          <div className="text-sm text-muted-foreground mb-4">
                            <p><strong>Автор:</strong> Воярж Е.В.</p>
                            <p><strong>Создано:</strong> 20 мая 2025</p>
                          </div>
                        </div>

                        <div className="relative max-w-4xl mx-auto mb-6">
                          <div className="aspect-[16/10] bg-gradient-to-br from-accent/10 to-primary/10 rounded-xl overflow-hidden shadow-lg cursor-pointer"
                               onClick={() => setSelectedImage(excursionsImages[currentSlideExcursionsCarousel])}>
                            <img
                              src={excursionsImages[currentSlideExcursionsCarousel]}
                              alt="Экскурсии о подвигах"
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <button
                            onClick={() => prevSlide('excursions', excursionsImages.length)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronLeft className="w-6 h-6 text-primary" />
                          </button>

                          <button
                            onClick={() => nextSlide('excursions', excursionsImages.length)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200"
                          >
                            <ChevronRight className="w-6 h-6 text-primary" />
                          </button>

                          <div className="flex justify-center space-x-2 mt-4">
                            {excursionsImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => setCurrentSlideExcursionsCarousel(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                                  index === currentSlideExcursionsCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="prose max-w-none text-foreground leading-relaxed">
                          <p className="mb-4">
                            В ЭКСПОцентре ТТЖТ-филиала РГУПС проходят экскурсии раскрывающие страницы военных биографий преподавателей и выпускников техникума. Обучающиеся могут ознакомиться с документами, фотографиями, письмами, воспоминаниями участников Великой Отечественной войны.
                          </p>

                          <p className="mb-4">
                            Плужников Анатолий Григорьевич - мастер производственного обучения, участник штурма Берлина; Селихов Виктор Иванович - заведующий библиотекой техникума, разведчик, участник боев за Сталинград; Борисов Иван Алексеевич - работал лаборантом техникума, в составе железнодорожных войск дошел до Кенигсберга, участвовал в войне с Японией; Гаврилов Дмитрий Алексеевич - преподаватель специальных дисциплин, участвовал в войне с Японией; Дрыгин Максим Федорович - работал в техникуме столяром, участник боев на Северном Кавказе; Александров Владимир Петрович - завуч техникума, участвовал в боях от Москвы до Берлина и от степей Монголии до Порт-Артура; Волкова Мария Алексеевна - техническая служащая, вместе с танковыми частями прошла боевой путь от Краснодара, освобождая Украину, до Германии; Доброскокин Николай Алексеевич - преподаватель техникума, участник Сталинградской битвы, встретил Победу в поверженной Германии; Сергиенко Петр Васильевич - лаборант техникума, ветеран Вооруженных сил с 1941 по 1945 год защищал Родину на ряде фронтов; Бутов Николай Васильевич – директор техникума, охранял железную дорогу, сопровождал эшелоны с боевой техникой и боеприпасами; Александрова (Золотарева) Татьяна Михайловна участвовала в освобождении Краснодара, в знаменитом танковом сражении на Курской дуге, прошла боевой путь через всю Европу до поверженного Берлина и Праги.
                          </p>

                          <p className="mb-4">
                            Не только на фронте ковалась Победа, но и в тылу. Неоценим вклад в Победу тружеников тыла: Щербаль В.Н., Зотова В.Т., Демиденко В.П., Гришиной Т.А., Клыковой Н.И., Инюточкиной Н.И., Чухлатой В.В., Хорольской Л.П., Хмелевской В.А. и других.
                          </p>

                          <p className="mb-4">
                            Экскурсии совместно с руководителем музея проводят студенты Александр Зотов (группа ПМ-2-1) и Яна Костандова (группа Э-1-1)
                          </p>

                          <p>
                            Нынешнее поколение студентов воспитывается на примерах доблести и героизма, а также трудовых подвигов ветеранов.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </main>

        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="w-auto max-h-[90vh] p-0 border-none bg-transparent shadow-none">
          <DialogTitle className="sr-only">Изображение</DialogTitle>
          <div className="relative">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Увеличенное изображение"
                className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Victory80;
