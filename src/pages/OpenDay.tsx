import { useState } from 'react'; // Добавляем useState для работы табов
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
// Импортируем иконки для нового дизайна
import { Video, Users, Info, MapPin, Phone, Calendar, CheckCircle } from 'lucide-react';

// Выносим данные из JSX, чтобы код был чище
const remoteDates = [
  { date: '31 октября 2024 года', time: '13:00' },
  { date: '12 декабря 2024 года', time: '13:00' },
  { date: '20 февраля 2025 года', time: '13:00' },
  { date: '03 апреля 2025 года', time: '13:00' },
];

const inPersonDates = [
  { date: '30 ноября 2024 года', time: '10:00' },
  { date: '01 марта 2025 года', time: '10:00' },
  { date: '26 апреля 2025 года', time: '10:00' },
];

const OpenDay = () => {
  // Cостояние для переключения табов: 'remote' или 'in-person'
  const [activeTab, setActiveTab] = useState('remote');

  return (
    <div className="min-h-screen bg-gray-100"> {/* Обновленный фон */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        {/* --- НАЧАЛО: РЕДИЗАЙН ЦЕНТРАЛЬНОГО БЛОКА --- */}
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            
            {/* 1. Яркий заголовок */}
            <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              День открытых дверей
            </h1>
            <h2 className="text-xl lg:text-2xl font-semibold text-gray-700 text-center mb-10">
              Графики проведения 2024/2025 учебный год
            </h2>
            
            <div className="max-w-4xl mx-auto">
              {/* 2. Современный переключатель (табы) */}
              <div className="flex justify-center bg-gray-200 rounded-full p-1.5 mb-8 shadow-inner">
                <button
                  onClick={() => setActiveTab('remote')}
                  className={`w-1/2 py-3 px-6 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeTab === 'remote'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  Дистанционно
                </button>
                <button
                  onClick={() => setActiveTab('in-person')}
                  className={`w-1/2 py-3 px-6 rounded-full text-lg font-bold flex items-center justify-center gap-2 transition-all duration-300 ${
                    activeTab === 'in-person'
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white/70'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Очно
                </button>
              </div>

              {/* 3. Контент табов (вместо таблиц - стильные списки) */}
              <div className="bg-white rounded-2xl shadow-xl p-8 min-h-[350px]">
                {/* --- Контент для "Дистанционно" --- */}
                {activeTab === 'remote' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">В дистанционном формате</h3>
                    <p className="text-gray-600 mb-6">Для удалённых территорий</p>
                    <div className="space-y-4">
                      {remoteDates.map((item, index) => (
                        <div 
                          key={index} 
                          className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-lg text-gray-800 font-medium">{item.date}</span>
                          </div>
                          <div className="bg-primary/10 text-primary font-bold py-1.5 px-4 rounded-full text-base self-start sm:self-center">
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* --- Контент для "Очно" --- */}
                {activeTab === 'in-person' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">В очном формате</h3>
                    <p className="text-gray-600 mb-6">При стабильной санитарно-эпидемиологической обстановки в условиях распространения инфекционных заболеваний</p>
                    <div className="space-y-4">
                      {inPersonDates.map((item, index) => (
                         <div 
                          key={index} 
                          className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm"
                        >
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <Calendar className="w-5 h-5 text-primary" />
                            <span className="text-lg text-gray-800 font-medium">{item.date}</span>
                          </div>
                          <div className="bg-primary/10 text-primary font-bold py-1.5 px-4 rounded-full text-base self-start sm:self-center">
                            {item.time}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. Яркий блок с программой и контактами */}
              <div className="mt-10 bg-gradient-to-br from-primary to-secondary text-white rounded-2xl shadow-xl p-8 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 bg-white/20 p-3 rounded-full">
                    <Info className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold">Приглашаем на нашу программу!</h2>
                </div>

                <p className="text-lg lg:text-xl font-light mb-8">
                  <strong>Приглашаем</strong> – всех тех, кто решает задачу выбора будущей профессии, а также их родителей.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Левая часть: Программа */}
                  <div className="space-y-3 text-lg">
                    <p className="font-semibold text-xl mb-3">В программе:</p>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-white/80 mt-1 flex-shrink-0" />
                        <span>Встреча с руководством техникума, заведующими отделениями и преподавателями;</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-white/80 mt-1 flex-shrink-0" />
                        <span>Знакомство с работой отделений и учебных лабораторий;</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-white/80 mt-1 flex-shrink-0" />
                        <span>Знакомство с техникумом.</span>
                      </li>
                    </ul>
                    <p className="pt-6 text-xl lg:text-2xl font-bold tracking-wide">Приходите и мы поможем Вам сделать правильный выбор!!!</p>
                  </div>

                  {/* Правая часть: Адрес (теперь с более темным, но прозрачным градиентом) */}
                  <div className="bg-gradient-to-br from-black/20 to-black/30 backdrop-blur-sm rounded-xl p-6 space-y-5 border border-white/20">
                    <h3 className="text-xl font-semibold mb-3">Как нас найти</h3>
                    
                    <div className="flex items-start gap-4">
                      <MapPin className="w-6 h-6 flex-shrink-0 mt-1 opacity-90" />
                      <div>
                        <p className="font-semibold">Адрес техникума:</p>
                        <p className="font-light">г. Тихорецк, ул. Красноармейская 57.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <Phone className="w-6 h-6 flex-shrink-0 mt-1 opacity-90" />
                      <div>
                        <p className="font-semibold">За справками обращаться:</p>
                        <p className="font-light">кабинет 101А, телефон 8(86196) 6-20-03 доб.110</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </main>
        {/* --- КОНЕЦ: РЕДИЗАЙН ЦЕНТРАЛЬНОГО БЛОКА --- */}
        
        <aside className="w-80 bg-white border-l border-border p-6 sticky top-16 h-screen overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default OpenDay;