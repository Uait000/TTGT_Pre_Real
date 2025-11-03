// src/pages/Victory80.tsx

import { useState } from 'react';
import MainLayout from '@/components/MainLayout'; // ИМПОРТИРУЕМ MainLayout
// Удалены: import Header, Sidebar, SidebarCards, InfoBlocks

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronDown, ChevronRight, ChevronLeft, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// --- ИМПОРТ ИЗОБРАЖЕНИЙ ---
// Архив (block-3)
import archive1 from '@/assets/pictures/80old/archive1.jpg';
import archive2 from '@/assets/pictures/80old/archive2.jpg';
import archive3 from '@/assets/pictures/80old/archive3.jpg';
// Книги (block-4, post-5)
import book1 from '@/assets/pictures/80old/book1.jpg';
import book2 from '@/assets/pictures/80old/book2.jpg';
import book3 from '@/assets/pictures/80old/book3.jpg';
import book4 from '@/assets/pictures/80old/book4.jpg';
import book5 from '@/assets/pictures/80old/book5.jpg';
import book6 from '@/assets/pictures/80old/book6.jpg';
import book7 from '@/assets/pictures/80old/book7.jpg';
// Диктант (block-4, post-4)
import dictation1 from '@/assets/pictures/80old/dictation1.jpg';
import dictation2 from '@/assets/pictures/80old/dictation2.jpg';
import dictation3 from '@/assets/pictures/80old/dictation3.jpg';
import dictation4 from '@/assets/pictures/80old/dictation4.jpg';
import dictation5 from '@/assets/pictures/80old/dictation5.jpg';
import dictation6 from '@/assets/pictures/80old/dictation6.jpg';
import dictation7 from '@/assets/pictures/80old/dictation7.jpg';
import dictation8 from '@/assets/pictures/80old/dictation8.jpg';
import dictation9 from '@/assets/pictures/80old/dictation9.jpg';
import dictation10 from '@/assets/pictures/80old/dictation10.jpg';
// Экскурсии (block-4, post-6)
import excursions1 from '@/assets/pictures/80old/excursions1.jpg';
import excursions2 from '@/assets/pictures/80old/excursions2.jpg';
import excursions3 from '@/assets/pictures/80old/excursions3.jpg';
import excursions4 from '@/assets/pictures/80old/excursions4.jpg';
import excursions5 from '@/assets/pictures/80old/excursions5.jpg';
import excursions6 from '@/assets/pictures/80old/excursions6.jpg';
import excursions7 from '@/assets/pictures/80old/excursions7.jpg';
// Урок в музее (block-4, post-1)
import museum_lesson1 from '@/assets/pictures/80old/museum_lesson1.jpg';
import museum_lesson2 from '@/assets/pictures/80old/museum_lesson2.jpg';
import museum_lesson3 from '@/assets/pictures/80old/museum_lesson3.jpg';
import museum_lesson4 from '@/assets/pictures/80old/museum_lesson4.jpg';
import museum_lesson5 from '@/assets/pictures/80old/museum_lesson5.jpg';
import museum_lesson6 from '@/assets/pictures/80old/museum_lesson6.jpg';
import museum_lesson7 from '@/assets/pictures/80old/museum_lesson7.jpg';
import museum_lesson8 from '@/assets/pictures/80old/museum_lesson8.jpg';
import museum_lesson9 from '@/assets/pictures/80old/museum_lesson9.jpg';
import museum_lesson10 from '@/assets/pictures/80old/museum_lesson10.jpg';
import museum_lesson11 from '@/assets/pictures/80old/museum_lesson11.jpg';
import museum_lesson12 from '@/assets/pictures/80old/museum_lesson12.jpg';
// Круглый стол (block-4, post-2)
import round_table1 from '@/assets/pictures/80old/round_table1.jpg';
import round_table2 from '@/assets/pictures/80old/round_table2.jpg';
import round_table3 from '@/assets/pictures/80old/round_table3.jpg';
import round_table4 from '@/assets/pictures/80old/round_table4.jpg';
import round_table5 from '@/assets/pictures/80old/round_table5.jpg';
import round_table6 from '@/assets/pictures/80old/round_table6.jpg';
import round_table7 from '@/assets/pictures/80old/round_table7.jpg';
import round_table8 from '@/assets/pictures/80old/round_table8.jpg';
// Судьба солдата (block-2)
import soldier1 from '@/assets/pictures/80old/soldier1.jpg';
import soldier2 from '@/assets/pictures/80old/soldier2.jpg';
import soldier3 from '@/assets/pictures/80old/soldier3.jpg';
import soldier4 from '@/assets/pictures/80old/soldier4.jpg';
// История оживает (block-4, post-3)
import story_comes_alive1 from '@/assets/pictures/80old/story_comes_alive1.jpg';
import story_comes_alive2 from '@/assets/pictures/80old/story_comes_alive2.jpg';
import story_comes_alive3 from '@/assets/pictures/80old/story_comes_alive3.jpg';
import story_comes_alive4 from '@/assets/pictures/80old/story_comes_alive4.jpg';
import story_comes_alive5 from '@/assets/pictures/80old/story_comes_alive5.jpg';
// --- КОНЕЦ ИМПОРТА ИЗОБРАЖЕНИЙ ---

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

    // --- БЛОК "БЕССМЕРТНЫЙ ПОЛК" 
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


    const lopatinImages = [soldier1, soldier2, soldier3, soldier4];
    const archiveImages = [archive1, archive2, archive3];
    const museumLessonImages = [museum_lesson1, museum_lesson2, museum_lesson3, museum_lesson4, museum_lesson5, museum_lesson6, museum_lesson7, museum_lesson8, museum_lesson9, museum_lesson10, museum_lesson11, museum_lesson12];
    const roundTableImages = [round_table1, round_table2, round_table3, round_table4, round_table5, round_table6, round_table7, round_table8];
    const historyAlivesImages = [story_comes_alive1, story_comes_alive2, story_comes_alive3, story_comes_alive4, story_comes_alive5];
    const dictantImages = [dictation1, dictation2, dictation3, dictation4, dictation5, dictation6, dictation7, dictation8, dictation9, dictation10];
    const bookImages = [book1, book2, book3, book4, book5, book6, book7];
    const excursionsImages = [excursions1, excursions2, excursions3, excursions4, excursions5, excursions6, excursions7];


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
        // Оборачиваем уникальный контент в MainLayout
        <MainLayout>
            {/* MainLayout уже добавит: ContactStrip, InfoBlocks и обернет контент в container mx-auto. */}
            
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
                                      Родился Анатолий Алексеевич Лопатин 27 ноября 1920 года в селе Чилгир Яшкульского района Калмыкии... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      По направлению Тихорецкого райвоенкомата Лопатин А.А. в декабре 1939 г. уехал в Краснодарское пехотное училище... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      В боях — с июля 1942 г. Командовал взводом, ротой, затем батальоном, был трижды ранен... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      В 1944 году майор Анатолий Алексеевич Лопатин, в двадцать три года, принял командование 463-м стрелковым полком... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      16 апреля 1945 года его полк прорвал оборону противника... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      Весной 1945 года полк майора Лопатина А.А. вёл наступление в Германии... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      Похоронен в Германии... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      27 июня 1945 года Анатолию Алексеевичу Лопатину... присвоено звание Героя Советского Союза (посмертно)... (полный текст)
                                    </p>
                                    <p className="mb-4">
                                      Награды Анатолия Алексеевича Лопатина... (полный текст)
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
                                    <p className="mb-4">Выпускная фотография студентов IV курса Тихорецкого механического техникума путей сообщения... (полный текст)</p>
                                    <p className="mb-4">На фотографии второй слева в третьем ряду – Александр Григорьевич Кондратьев... (полный текст)</p>
                                    <p className="mb-4">Александр родился в 1919 году... (полный текст)</p>
                                    <p className="mb-4">Был призван в армию в 1940 году... (полный текст)</p>
                                    <p>С фронта он писал своим родным письма... (полный текст)</p>
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

                                        <button onClick={() => prevSlide('museum', museumLessonImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>

                                        <button onClick={() => nextSlide('museum', museumLessonImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>

                                        <div className="flex justify-center space-x-2 mt-4">
                                            {museumLessonImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideMuseumCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideMuseumCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">В рамках месячника оборонно-массовой и военно-патриотической работы... (полный текст)</p>
                                        <p className="mb-4">В экспозиционном зале Тихорецкого историко-краеведческого музея... (полный текст)</p>
                                        <p className="mb-4">В годы Великой Отечественной войны тихорецкие железнодорожники... (полный текст)</p>
                                        <p className="mb-4">В грозное время с октября 1941 по 1943 годы Северо – Кавказская железная дорога... (полный текст)</p>
                                        <p className="mb-4">Студенты техникума продолжают исследовательскую работу о событиях Великой Отечественной войне... (полный текст)</p>
                                        <p className="mb-4">Экспозиционный центр ТТЖТ выражает благодарность сотрудникам Тихорецкого историко-краеведческого музея за помощь в поисковой работе!</p>
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
                                        {/* Кнопки и индикаторы */}
                                        <button onClick={() => prevSlide('roundTable', roundTableImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>
                                        <button onClick={() => nextSlide('roundTable', roundTableImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>
                                        <div className="flex justify-center space-x-2 mt-4">
                                            {roundTableImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideRoundTableCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideRoundTableCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">В честь памятной даты отечественной истории... (полный текст)</p>
                                        <p className="mb-4">Говорили о событиях Великой Отечественной войны... (полный текст)</p>
                                        <p className="mb-4">Анатолий Васильевич Бондарев, выпускник техникума 1983 года... (полный текст)</p>
                                        <p className="mb-4">Геннадий Александрович Беркус отметил, что памятная дата 15 февраля... (полный текст)</p>
                                        <p className="mb-4">Игорь Юрьевич Терлецкий рассказал о своём участии в СВО... (полный текст)</p>
                                        <p className="mb-4">Ольга Николаевна Ярошевская, заместитель директора по воспитательной работе... (полный текст)</p>
                                        <p>Завершилась памятная встреча записью в Книге Почётных гостей и фотографией на память.</p>
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
                                        {/* Кнопки и индикаторы */}
                                        <button onClick={() => prevSlide('history', historyAlivesImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>
                                        <button onClick={() => nextSlide('history', historyAlivesImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>
                                        <div className="flex justify-center space-x-2 mt-4">
                                            {historyAlivesImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideHistoryCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideHistoryCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">В музее история оживает, визуализируется... (полный текст)</p>
                                        <p className="mb-4">Студенты Тихорецкого техникума железнодорожного транспорта побывали на экскурсии... (полный текст)</p>
                                        <p>Экскурсия в музей – лучшее закрепление материала, пройденного на уроках истории.</p>
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
                                        {/* Кнопки и индикаторы */}
                                        <button onClick={() => prevSlide('dictant', dictantImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>
                                        <button onClick={() => nextSlide('dictant', dictantImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>
                                        <div className="flex justify-center space-x-2 mt-4">
                                            {dictantImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideDictantCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideDictantCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">«Диктант Победы» — это масштабная просветительская акция... (полный текст)</p>
                                        <p className="mb-4">Торжественная церемония открытия состоялась 25 апреля... (полный текст)</p>
                                        <p className="mb-4">Традиционно акция «Диктант Победы» прошла офлайн... (полный текст)</p>
                                        <p className="mb-4">Студенты ТТЖТ-филиала РГУПС, группы Р-2-1, приняли участие в акции... (полный текст)</p>
                                        <p className="mb-4">Все участники Диктанта Победы получили дипломы участника.</p>
                                        <p>Благодарим всех, принявших участие в патриотической акции!</p>
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
                                        {/* Кнопки и индикаторы */}
                                        <button onClick={() => prevSlide('book', bookImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>
                                        <button onClick={() => nextSlide('book', bookImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>
                                        <div className="flex justify-center space-x-2 mt-4">
                                            {bookImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideBookCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideBookCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">Презентация книги «Великая Отечественная война» состоялась в Тихорецком историко-краеведческом музее... (полный текст)</p>
                                        <p className="mb-4">Людмила Ивановна рассказала о боевом пути Мацюк Григория Терентьевича... (полный текст)</p>
                                        <p className="mb-4">Людмила Ивановна подарила книгу «Великая Отечественная война» музею нашего техникума с дарственной подписью.</p>
                                        <p className="mb-4">На презентации книги выступил и друг автора книги Кривошеев Александр Яковлевич... (полный текст)</p>
                                        <p>Музей истории техникума выражает благодарность семье ветерана войны Мацюка Г.Т... (полный текст)</p>
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
                                        {/* Кнопки и индикаторы */}
                                        <button onClick={() => prevSlide('excursions', excursionsImages.length)} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronLeft className="w-6 h-6 text-primary" />
                                        </button>
                                        <button onClick={() => nextSlide('excursions', excursionsImages.length)} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border border-border rounded-full p-3 hover:shadow-lg transition-all duration-200">
                                            <ChevronRight className="w-6 h-6 text-primary" />
                                        </button>
                                        <div className="flex justify-center space-x-2 mt-4">
                                            {excursionsImages.map((_, index) => (
                                                <button key={index} onClick={() => setCurrentSlideExcursionsCarousel(index)} className={`w-3 h-3 rounded-full transition-all duration-200 ${ index === currentSlideExcursionsCarousel ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400' }`} />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="prose max-w-none text-foreground leading-relaxed">
                                        <p className="mb-4">В ЭКСПОцентре ТТЖТ-филиала РГУПС проходят экскурсии... (полный текст)</p>
                                        <p className="mb-4">Плужников Анатолий Григорьевич - мастер производственного обучения, участник штурма Берлина... (полный текст)</p>
                                        <p className="mb-4">Не только на фронте ковалась Победа, но и в тылу... (полный текст)</p>
                                        <p className="mb-4">Экскурсии совместно с руководителем музея проводят студенты Александр Зотов... (полный текст)</p>
                                        <p>Нынешнее поколение студентов воспитывается на примерах доблести и героизма... (полный текст)</p>
                                    </div>
                                </div>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            
            {/* Модальное окно для увеличения */}
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
        </MainLayout>
    );
};

export default Victory80;