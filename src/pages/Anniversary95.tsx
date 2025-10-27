import { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// --- Импорт изображений ---

// Пост 1: История (папка history)
import chel from '@/assets/pictures/history/chel.jpg';
import ded from '@/assets/pictures/history/ded.jpg';
import deda from '@/assets/pictures/history/deda.jpg';
import gorod from '@/assets/pictures/history/gorod.png';
import people from '@/assets/pictures/history/people.jpg';

// Пост 2: Плотников (папка gord)
import plotnikov1 from '@/assets/pictures/gord/Plotnikov1.jpg';
import plotnikov2 from '@/assets/pictures/gord/Plotnikov2.jpg';
import plotnikov3 from '@/assets/pictures/gord/Plotnikov3.jpg';
import plotnikov4 from '@/assets/pictures/gord/Plotnikov4.jpg';

// Пост 3: Бутов (папка gord)
import butov1 from '@/assets/pictures/gord/Butov1.jpg';
import butov2 from '@/assets/pictures/gord/Butov2.jpg';
import butov3 from '@/assets/pictures/gord/Butov3.jpg';
import butov4 from '@/assets/pictures/gord/Butov4.jpg';
import butov5 from '@/assets/pictures/gord/Butov5.jpg';
import butov6 from '@/assets/pictures/gord/Butov6.jpg';
import butov7 from '@/assets/pictures/gord/Butov7.jpg';
import butov8 from '@/assets/pictures/gord/Butov8.jpg';

// Пост 4: Женщины (папка gord)
import women1 from '@/assets/pictures/gord/Women1.jpg';
import women2 from '@/assets/pictures/gord/Women2.jpg';
import women3 from '@/assets/pictures/gord/Women3.jpg';
import women4 from '@/assets/pictures/gord/Women4.jpg';
import women5 from '@/assets/pictures/gord/Women5.jpg';


const Anniversary95 = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentSlidePost1, setCurrentSlidePost1] = useState(0);
    const [currentSlidePost2, setCurrentSlidePost2] = useState(0);
    const [currentSlidePost3, setCurrentSlidePost3] = useState(0);
    const [currentSlidePost4, setCurrentSlidePost4] = useState(0);

    // --- История ---
    const post1Images = [
        chel,
        ded,
        deda,
        gorod,
        people
    ];

    // --- Плотников (Пост 2) ---
    const post2Images = [
        plotnikov1,
        plotnikov2,
        plotnikov3,
        plotnikov4
    ];

    // --- Бутов (Пост 3) ---
    const post3Images = [
        butov1,
        butov2,
        butov3,
        butov4,
        butov5,
        butov6,
        butov7,
        butov8
    ];

    // --- Женщины (Пост 4) ---
    const post4Images = [
        women1,
        women2,
        women3,
        women4,
        women5
    ];

    const nextSlide = (postNumber: number) => {
        if (postNumber === 1) {
            setCurrentSlidePost1((prev) => (prev + 1) % post1Images.length);
        } else if (postNumber === 2) {
            setCurrentSlidePost2((prev) => (prev + 1) % post2Images.length);
        } else if (postNumber === 3) {
            setCurrentSlidePost3((prev) => (prev + 1) % post3Images.length);
        } else if (postNumber === 4) {
            setCurrentSlidePost4((prev) => (prev + 1) % post4Images.length);
        }
    };

    const prevSlide = (postNumber: number) => {
        if (postNumber === 1) {
            setCurrentSlidePost1((prev) => (prev - 1 + post1Images.length) % post1Images.length);
        } else if (postNumber === 2) {
            setCurrentSlidePost2((prev) => (prev - 1 + post2Images.length) % post2Images.length);
        } else if (postNumber === 3) {
            setCurrentSlidePost3((prev) => (prev - 1 + post3Images.length) % post3Images.length);
        } else if (postNumber === 4) {
            setCurrentSlidePost4((prev) => (prev - 1 + post4Images.length) % post4Images.length);
        }
    };

    const renderPostContent = (postNumber: number, title: string, content: JSX.Element, author: string, date: string, images: string[], currentSlide: number) => {
        const hasMultipleSlides = images.length > 1;

        return (
            <article className="bg-background rounded-2xl border border-border/50 border-t-4 border-t-primary shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-8">
                <h2 className="text-3xl font-bold text-primary dark:text-primary-light mb-6 text-center">{title}</h2>

                <div className="mb-6">
                    <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
                        <p><strong>Автор:</strong> {author}</p>
                        <p><strong>Создано:</strong> {date}</p>
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto mb-4">
                    <div
                        className={`w-full h-auto max-h-[600px] bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shadow-inner cursor-pointer flex justify-center items-center group`}
                        onClick={() => setSelectedImage(images[currentSlide])}
                    >
                        <img
                            src={images[currentSlide]}
                            alt={title}
                            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>

                    {hasMultipleSlides && (
                        <>
                            <button
                                onClick={() => prevSlide(postNumber)}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 rounded-full p-2.5 shadow-lg hover:scale-105 transition-all duration-200 z-10"
                            >
                                <ChevronLeft className="w-6 h-6 text-primary" />
                            </button>

                            <button
                                onClick={() => nextSlide(postNumber)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-sm hover:bg-background border border-border/50 rounded-full p-2.5 shadow-lg hover:scale-105 transition-all duration-200 z-10"
                            >
                                <ChevronRight className="w-6 h-6 text-primary" />
                            </button>
                        </>
                    )}
                </div>

                {/* --- Индикаторы-точки (теперь СНАРУЖИ) --- */}
                {hasMultipleSlides && (
                    <div className="flex justify-center space-x-2 mb-6">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (postNumber === 1) setCurrentSlidePost1(index);
                                    else if (postNumber === 2) setCurrentSlidePost2(index);
                                    else if (postNumber === 3) setCurrentSlidePost3(index);
                                    else if (postNumber === 4) setCurrentSlidePost4(index);
                                }}
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                    index === currentSlide ? 'bg-primary w-5' : 'w-2.5 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                )}
                {/* --- Конец блока индикаторов --- */}


                <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                    {content}
                </div>
            </article>
        );
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-950">
            <Header />

            <div className="flex">
                <Sidebar />

                <main className="flex-1 min-h-screen">
                    <div className="container mx-auto px-4 sm:px-6 py-8">
                        {/* Обертка с "плавающим" эффектом для контента */}
                        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-border/10 p-6 sm:p-12">
                            <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 text-center tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 pb-2">
                                95 лет Тихорецкому техникуму<br/>железнодорожного транспорта
                            </h1>

                            <div className="space-y-16 sm:space-y-20">
                                {/* Пост 1: Этапы нашей истории */}
                                {renderPostContent(1, "Этапы нашей истории",
                                    <>
                                        <h3 className="text-lg font-semibold mb-3">ИЗ ВОСПОМИНАНИЙ ВИКТОРА ФЁДОРОВИЧА ИВАНОВА, ВЫПУСКНИКА 1933 ГОДА</h3>
                                        <p className="mb-4">В Экспозиционном центре техникума бережно хранятся документы и фотографии далёких 30-х годов... (полный текст)</p>
                                        <p className="mb-4">Виктор Фёдорович Иванов поступил в наш техникум в 1933 году. К этому времени он окончил семь классов общеобразовательной школы № 35 имени Октябрьской революции (ныне это корпус №1 ТТЖТ-филиала РГУПС)...</p>
                                        <p className="mb-4">Рассказывая о своих преподавателях, Виктор Фёдорович с теплом о них отзывался: «Нам студентам того времени, очень повезло с преподавателями. Это были замечательные люди, обладающие огромным запасом знаний...</p>
                                        <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 mt-6">
                                            <h4 className="font-semibold mb-2">Фотографии из архива Экспоцентра ТТЖТ-филиала РГУПС:</h4>
                                            <ul className="list-disc list-inside space-y-1 text-sm">
                                                <li>удостоверение Иванова В.Ф. «Почётный ветеран железнодорожного транспорта»</li>
                                                <li>учащиеся Тихорецкого механического техникума, 1933 г.</li>
                                                <li>здание Тихорецкого механического техникума</li>
                                                <li>портреты Иванова В.Ф. разных лет</li>
                                            </ul>
                                        </div>
                                    </>,
                                    'Воярж Е.В.', '04 марта 2025', post1Images, currentSlidePost1
                                )}

                                {/* Пост 2: Ими гордимся (Плотников) */}
                                {renderPostContent(2, "Ими гордимся: Плотников Василий Петрович",
                                    <>
                                        <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-4">Плотников Василий Петрович</h3>
                                        <p className="mb-4">Во время войны он воевал, а в мирное время 35 лет преподавал математику. Имя этого человека, воина и педагога - Плотников Василий Петрович.</p>
                                        <p className="mb-4">Василий Плотников родился 27 марта 1919 года в ст. Фастовецкая Тихорецкого района Краснодарского края... (полный текст)</p>
                                        <p className="mb-4">В сентябре 1942 года Плотников В.П. был призван в армию, служил в восьмой отдельной лыжной бригаде третьего Украинского фронта...</p>
                                        <p className="mb-4">В мае 1946 года Плотников В.П. был демобилизован. В сентябре 1948 года поступил на работу в Тихорецкий техникум железнодорожного транспорта преподавателем математики...</p>
                                        <p className="mb-4">Бывшие его воспитанники добрым словом вспоминают своего учителя...</p>
                                        <p>Татарян Артур, студент 4-го курса, группы Р-4-1, правнук Плотникова В.П., хранит память о прадеде и гордится тем, что в техникуме многие знают и помнят Плотникова Василия Петровича.</p>
                                    </>,
                                    'Воярж Е.В.', '05 мая 2025', post2Images, currentSlidePost2
                                )}

                                {/* Пост 3: Ими гордимся (Бутов) */}
                                {renderPostContent(3, "Ими гордимся: Бутов Николай Васильевич",
                                    <>
                                        <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-4">Бутов Николай Васильевич</h3>
                                        <p className="mb-4">Жизненный путь Николая Васильевича Бутова - гордость Тихорецкого техникума железнодорожного транспорта, так как он всю свою жизнь был связан с нашим учебным заведением, и очень много сделал для него!</p>
                                        <p className="mb-4">Родился Николай Бутов в 1916 году в г. Тихорецке. В 1933 году окончил Тихорецкое фабрично-заводское училище (ФЗУ), а в 1936 году ТТЖТ...</p>
                                        <p className="mb-4">Всю войну прослужил в войсках НКВД (МВД), которые сопровождали эшелоны...</p>
                                        <p className="mb-4">В 1946 году Николай Васильевич демобилизовался из армии и вернулся в РИИЖТ...</p>
                                        <p className="mb-4">Николай Васильевич обладал организаторским способностям, под его руководством в 70-х годах осуществлена пристройка...</p>
                                        <p className="mb-4">С июля 1977 года - перешёл на преподавательскую работу...</p>
                                        <p>За свои заслуги Бутов Николай Васильевич награждён орденом «Трудового Красного Знамени»...</p>
                                    </>,
                                    'Воярж Е.В.', '05 мая 2025', post3Images, currentSlidePost3
                                )}
                                
                                {/* Пост 4: Первый выпуск женщин-помощников машинистов */}
                                {renderPostContent(4, "Первый выпуск женщин-помощников машинистов",
                                    <>
                                        <h3 className="text-xl font-bold text-primary dark:text-primary-light mb-4">В 1939 ГОДУ В НАШЕМ ТЕХНИКУМЕ СОСТОЯЛСЯ ПЕРВЫЙ ВЫПУСК ЖЕНЩИН-ПОМОЩНИКОВ МАШИНИСТОВ</h3>
                                        <p className="mb-4">Тихорецкий техникум железнодорожного транспорта – филиал ФГБОУ ВО РГУПС был основан в октябре 1930 года...</p>
                                        <p className="mb-4">В стране быстрыми темпами шла индустриализация...</p>
                                        <p className="mb-4">В годы Великой Отечественной войны многие женщины в Тихорецком паровозном депо...</p>
                                        <p className="mb-4">На общем фото 1-го выпуска женщин помощников машинистов при Тихорецком механическом техникуме, сделанном 6 мая 1939 года...</p>
                                        <p>Ветеран труда Тихорецкого локомотивного депо Анна Кузьминична Подгорная всю свою трудовую жизнь посвятила выбранной профессии...</p>
                                    </>,
                                    'Воярж Е.В.', '04 марта 2025', post4Images, currentSlidePost4
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <aside className="w-80 bg-white dark:bg-gray-900 border-l border-border/50 p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden lg:block">
                    <SidebarCards />
                </aside>
            </div>

            {/* Модальное окно для увеличения */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] w-auto h-auto p-0 flex justify-center items-center bg-transparent border-none shadow-none">
                    <DialogTitle className="sr-only">Увеличенное изображение</DialogTitle>
                    <div className="relative w-full h-full">
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-10 -right-2 sm:top-4 sm:right-4 z-20 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm hover:bg-background dark:hover:bg-gray-900 rounded-full p-2 shadow-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-foreground" />
                        </button>
                        {selectedImage && (
                            <img
                                src={selectedImage}
                                alt="Увеличенное изображение"
                                className="w-full h-full max-w-[90vw] max-h-[90vh] object-contain"
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Anniversary95;