import { Link } from 'react-router-dom';
import {
  History,
  Users,
  MapPin,
  Award,
  FileCheck,
  BookOpen,
  Briefcase,
  Monitor,
  BarChart,
  Building,
  Car,
  UtensilsCrossed,
  Waves,
  Wrench,
  // --- ДОБАВЛЕНЫ ИКОНКИ ДЛЯ НОВЫХ ССЫЛОК ---
  CalendarDays, // Для расписания
  Replace,      // Для замен
  BookHeadphones // Для электронной библиотеки (чтобы отличать)
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const Sidebar = () => {
  // --- 1. "ОСОБО ЗАМЕТНЫЕ" ССЫЛКИ (КАК НА СКРИНШОТЕ) ---
  const quickAccessItems: SidebarItem[] = [
    { 
      label: 'Электронная библиотека', 
      href: '/e-library', 
      icon: <BookHeadphones className="w-5 h-5" /> 
    },
    { 
      label: 'Расписание', 
      href: '/schedule', // Добавлена ссылка
      icon: <CalendarDays className="w-5 h-5" /> 
    },
    { 
      label: 'Замены', 
      href: '/substitutions', // Добавлена ссылка
      icon: <Replace className="w-5 h-5" /> 
    },
  ];

  // --- 2. ВСЕ ОСТАЛЬНЫЕ ССЫЛКИ СГРУППИРОВАНЫ (ВСЕ ДАННЫЕ СОХРАНЕНЫ) ---
  const groupedItems: { title: string; items: SidebarItem[] }[] = [
    {
      title: 'О техникуме',
      items: [
        { label: 'История', href: '/history', icon: <History className="w-4 h-4" /> },
        { label: 'Администрация', href: '/administration', icon: <Users className="w-4 h-4" /> },
        { label: 'Наши отделения', href: '/departments', icon: <MapPin className="w-4 h-4" /> },
        { label: 'Наша гордость', href: '/pride', icon: <Award className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Студентам',
      items: [
        { label: 'Воспитательная работа', href: '/educational-work', icon: <Users className="w-4 h-4" /> },
        { label: 'Библиотека', href: '/library', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Электронная ИОС', href: '/ios', icon: <Monitor className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Инфраструктура',
      items: [
        { label: 'Общежитие', href: '/dormitory', icon: <Building className="w-4 h-4" /> },
        { label: 'Автошкола', href: '/driving-school', icon: <Car className="w-4 h-4" /> },
        { label: 'Столовая', href: '/cafeteria', icon: <UtensilsCrossed className="w-4 h-4" /> },
        { label: 'Бассейн', href: '/swimming-pool', icon: <Waves className="w-4 h-4" /> },
        { label: 'Мастерские', href: '/workshops', icon: <Wrench className="w-4 h-4" /> },
      ]
    },
    {
      title: 'Информация',
      items: [
        { label: 'Аккредитация', href: '/accreditation', icon: <FileCheck className="w-4 h-4" /> },
        { label: 'Лицензия', href: '/license', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'НОКО', href: '/noko', icon: <BarChart className="w-4 h-4" /> },
        { label: 'Вакансии', href: '/vacancies', icon: <Briefcase className="w-4 h-4" /> },
      ]
    }
  ];

  return (
    // --- ИЗМЕНЕНИЕ: ДОБАВЛЕНЫ КЛАССЫ ДЛЯ СКРЫТИЯ ПОЛОСЫ ПРОКРУТКИ ---
    <aside className="w-64 bg-white border-r border-sidebar-border h-screen sticky top-16 overflow-y-auto scrollbar-width-none [-ms-overflow-style-none] [&::-webkit-scrollbar]:hidden">
      <div className="p-4 flex flex-col h-full">
        
        {/* --- 2. БЛОК "БЫСТРЫЙ ДОСТУП" (ЯРКИЙ И ЗАМЕТНЫЙ) --- */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 px-3 uppercase tracking-wider">Быстрый доступ</h2>
          <nav className="space-y-2">
            {quickAccessItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                // Стиль как на скриншоте: синяя кнопка
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white font-medium bg-primary shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all duration-200 group"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* --- 3. БЛОК ОБЫЧНЫХ ССЫЛОК (С ГРУППАМИ) --- */}
        <nav className="flex-1 mt-6">
          {groupedItems.map((group) => (
            <div key={group.title} className="mb-4">
              {/* Заголовок группы (О ТЕХНИКУМЕ, СТУДЕНТАМ...) */}
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    // Стиль как на скриншоте: простая текстовая ссылка с иконкой
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 group"
                  >
                    <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-500 group-hover:text-primary">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;