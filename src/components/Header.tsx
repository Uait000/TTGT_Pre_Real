import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import instr from '../assets/file/Instr_LK_Abiturienta.pdf';
import centry from '../assets/file/Centry_Prit_2022-2023.pdf';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleDropdownToggle = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const menuItems = [
    {
      label: 'Главная',
      href: '/',
      submenu: []
    },
    {
      label: 'Сведения об образовательной организации',
      href: 'https://www.rgups.ru/filiali/ttgt/',
      submenu: []
    },
    {
      label: 'Студентам',
      href: '#',
      submenu: [
        { label: 'Замены', href: '#' },
        { label: 'Правила внутреннего распорядка', href: '/internal-rules' },
        { label: 'Расписание занятий', href: '/schedule' },
        { label: 'Расписание звонков', href: '/bell-schedule' },
        { label: 'Размещение учебных аудиторий', href: '/classroom-layout' },
        { label: 'Памятка', href: '/memo' },
        { label: 'Расписание экзаменов', href: '/exam-schedule' },
        { label: 'Квитанции об оплате', href: '/payment-receipts' },
        { label: 'Образовательный кредит', href: '/education-credit' },
        { label: 'ГИА', href: '/state-exam' }
      ]
    },
    {
      label: 'Поступающим',
      href: '#',
      submenu: [
        { label: 'Личный кабинет', href: 'https://abitura.ttgt.org/abitur/profile/#/' },
        // --- ИСПРАВЛЕНИЕ: Прямая ссылка на файл в папке public ---
        { label: 'Инструкция к ЛК', href: instr },
        { label: 'Контрольные цифры приема', href: '/applicants/admission-numbers' },
        { label: 'Центр притяжения ', href: centry },
        { label: 'Отборочная комиссия', href: '/applicants/selection-committee' },
        { label: 'Список лиц подавших документы', href: 'https://rgups.ru/abitur/informirovanie/filial-rgups-v-tikhoretcke/' },
        { label: 'День открытых дверей', href: '/applicants/open-day' },
        { label: 'Специальности обучения', href: '/applicants/specialties' },
        { label: 'Правила приема', href: '/applicants/admission-rules' },
        { label: 'Карьерные карты', href: '/applicants/career-maps' }
      ]
    },
    {
      label: 'Курсы',
      href: '/courses',
      submenu: []
    },
    {
      label: 'Абитуриенту',
      href: 'https://rgups.ru/abitur/',
      submenu: [
      ]
    },
    {
      label: 'Форум',
      href: 'https://11klassniki.ru/spo/ttzht',
      submenu: []
    },
    {
      label: 'Дистанционное обучение',
      href: 'http://дистанционное24.рф',
      external: true,
      submenu: []
    }
  ];

  const navItemBaseClasses = "nav-item flex flex-col items-center justify-center text-center px-4 text-sm font-medium transition-colors hover:text-primary h-full";

  const renderSubMenuItem = (subItem: { label: string; href: string }, closeMenu?: () => void) => {
    // --- ИСПРАВЛЕНИЕ: Улучшенная логика для определения типа ссылки ---
    // Ссылки на файлы (pdf и др.) и внешние сайты (http) будут тегом <a>
    // Внутренние маршруты (начинаются с /) будут тегом <Link>
    const isExternalOrFile = typeof subItem.href === 'string' && (
      subItem.href.startsWith('http') || 
      subItem.href.match(/\.[0-9a-z]+$/i)
    );

    if (isExternalOrFile) {
      return (
        <a
          key={subItem.label}
          href={subItem.href}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          {subItem.label}
        </a>
      );
    } else {
      return (
        <Link
          key={subItem.label}
          to={subItem.href}
          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
          onClick={closeMenu}
        >
          {subItem.label}
        </Link>
      );
    }
  };

  const renderMobileSubMenuItem = (subItem: { label: string; href: string }) => {
    const isExternalOrFile = typeof subItem.href === 'string' && (
      subItem.href.startsWith('http') || 
      subItem.href.match(/\.[0-9a-z]+$/i)
    );
    const closeMenu = () => setIsMobileMenuOpen(false);

    if (isExternalOrFile) {
      return (
            <a
                key={subItem.label}
                href={subItem.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={closeMenu}
            >
                {subItem.label}
            </a>
      );
    } else {
       return (
            <Link
                key={subItem.label}
                to={subItem.href}
                className="block px-8 py-2 text-sm text-muted-foreground hover:text-foreground"
                onClick={closeMenu}
            >
                {subItem.label}
            </Link>
        );
    }
};

  return (
    <header className="bg-white shadow-md border-b border-border sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="relative flex justify-center items-center h-20 w-full">
          
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <img 
              src="https://s2.radikal.cloud/2025/09/30/educenter-logo18562125e990d0a1.png" 
              alt="Логотип" 
              className="h-20 w-20 rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <h1 className="text-sm font-bold text-foreground leading-tight">
                Тихорецкий техникум железнодорожного транспорта
              </h1>
              <h2 className="text-xs text-muted-foreground leading-tight">
                филиала РГУПС
              </h2>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 h-full ml-10">
            {menuItems.map((item) => (
              <div key={item.label} className="relative group h-full flex items-center">
                {item.submenu.length > 0 ? (
                  <div className="relative h-full flex items-center">
                    <button
                      className={`${navItemBaseClasses} cursor-pointer`}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <span className='leading-tight'>{item.label}</span> 
                      <ChevronDown className="w-3 h-3 mt-1 flex-shrink-0" />
                    </button>
                    
                    {openDropdown === item.label && (
                      <div 
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-80 bg-white border border-border rounded-lg shadow-lg z-50 text-left"
                        onMouseEnter={() => setOpenDropdown(item.label)}
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="py-2">
                          {item.submenu.map((subItem) => renderSubMenuItem(subItem))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navItemBaseClasses}
                  >
                    <span className='leading-tight'>{item.label}</span>
                  </a>
                ) : (
                  <Link 
                    to={item.href} 
                    className={navItemBaseClasses}
                  >
                    <span className='leading-tight'>{item.label}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden absolute right-4 inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          >
            {isMobileMenuOpen ? (
              <X className="block h-6 w-6" />
            ) : (
              <Menu className="block h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border">
            <div className="py-2 space-y-1">
              {menuItems.map((item) => (
                <div key={item.label}>
                  {item.submenu.length > 0 ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.label)}
                        className="w-full flex items-center justify-between px-4 py-2 text-sm text-foreground hover:bg-accent"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {openDropdown === item.label && (
                        <div className="bg-accent/50">
                          {item.submenu.map((subItem) => renderMobileSubMenuItem(subItem))}
                        </div>
                      )}
                    </div>
                  ) : item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="block px-4 py-2 text-sm text-foreground hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

