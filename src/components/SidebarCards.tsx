import { Star, TrendingUp, Trophy, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const SidebarCards = () => {
  // ИСПРАВЛЕНО: Стандартизирована структура всех плашек
  const cards = [
    {
      id: 1,
      title: '95',
      subtitle: 'лет',
      description: '1930 - 2025',
      className: 'sidebar-card sidebar-card-95',
      icon: <TrendingUp className="w-8 h-8 mb-2" />,
      link: '/anniversary-95'
    },
    {
      id: 2,
      title: '85 лет',
      subtitle: 'СПО',
      description: 'Среднее профессиональное образование',
      className: 'sidebar-card sidebar-card-85',
      icon: <Trophy className="w-8 h-8 mb-2" />
    },
    {
      id: 3,
      title: '80',
      subtitle: 'ЛЕТ ПОБЕДА!',
      description: '1945 - 2025',
      className: 'sidebar-card sidebar-card-victory',
      icon: <Star className="w-8 h-8 mb-2" />,
      link: '/victory-80'
    },
    {
      id: 4,
      title: 'СТАРТ В НАУКУ',
      subtitle: 'Научные исследования',
      description: '',
      className: 'sidebar-card sidebar-card-science',
      icon: <Microscope className="w-8 h-8 mb-2" />,
      link: '/start-in-science'
    },
    {
      id: 5,
      title: 'РОССИЯ БЕЛАРУСЬ',
      subtitle: 'Конференция',
      description: 'Вехи общей истории',
      className: 'sidebar-card sidebar-card-conference',
      icon: <Star className="w-8 h-8 mb-2" />,
      link: '/russia-belarus-conference'
    },
    {
      id: 6,
      title: 'СФЕРУМ',
      subtitle: 'МОЯ ШКОЛА',
      description: 'Цифровые платформы',
      className: 'sidebar-card sidebar-card-digital',
      icon: <Microscope className="w-8 h-8 mb-2" />,
      link: '/sferum-myschool'
    },
    {
      id: 7,
      title: 'СВЕДЕНИЯ ОБ ОО',
      subtitle: 'Информация',
      description: 'Образовательная организация',
      className: 'sidebar-card sidebar-card-info',
      icon: <Trophy className="w-8 h-8 mb-2" />,
      link: 'https://www.rgups.ru/filiali/ttgt/',
      external: true
    },
    {
      id: 8,
      title: 'МИНОБРНАУКИ',
      subtitle: 'Министерство',
      description: 'Науки и высшего образования',
      className: 'sidebar-card sidebar-card-ministry',
      icon: <TrendingUp className="w-8 h-8 mb-2" />,
      link: 'https://minobrnauki.gov.ru/',
      external: true
    },
    {
      id: 9,
      title: 'МИНПРОСВЕЩЕНИЯ',
      subtitle: 'Министерство',
      description: 'Просвещения РФ',
      className: 'sidebar-card sidebar-card-education',
      icon: <Star className="w-8 h-8 mb-2" />,
      link: 'https://edu.gov.ru/',
      external: true
    },
    {
      id: 10,
      title: 'РАБОТОДАТЕЛИ',
      subtitle: 'Партнерство',
      description: 'Железнодорожный транспорт',
      className: 'sidebar-card sidebar-card-employers',
      icon: <Microscope className="w-8 h-8 mb-2" />,
      link: '/railway-employers'
    }
  ];

  // ИСПРАВЛЕНО: Единый компонент для рендера плашек с одинаковой структурой
  const CardContent = ({ card }: { card: typeof cards[0] }) => (
    <>
      <div className="flex justify-center mb-3">{card.icon}</div>
      <div className="text-xl font-bold mb-2 leading-tight">{card.title}</div>
      <div className="text-base font-medium mb-2 opacity-95">{card.subtitle}</div>
      {card.description && (
        <div className="text-sm opacity-90 leading-relaxed">{card.description}</div>
      )}
    </>
  );

  return (
    <div className="space-y-4 pb-4">
      {/* ИСПРАВЛЕНО: Заголовок панели */}
      <div className="bg-primary text-white rounded-xl p-5 text-center shadow-md">
        <h3 className="text-lg font-bold">Ресурсы</h3>
      </div>

      {/* ИСПРАВЛЕНО: Единообразный рендер плашек */}
      {cards.map((card) => {
        const cardClasses = `${card.className} flex flex-col items-center justify-center min-h-[180px]`;

        if (card.external) {
          return (
            <a
              key={card.id}
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClasses}
            >
              <CardContent card={card} />
            </a>
          );
        }

        if (card.link) {
          return (
            <Link
              key={card.id}
              to={card.link}
              className={cardClasses}
            >
              <CardContent card={card} />
            </Link>
          );
        }

        return (
          <div
            key={card.id}
            className={cardClasses}
          >
            <CardContent card={card} />
          </div>
        );
      })}
    </div>
  );
};

export default SidebarCards;