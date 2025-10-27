import { Link } from 'react-router-dom';
import { Users, Shield, Trophy, MessageSquare, AlertTriangle, FileText, Video } from 'lucide-react';

const InfoBlocks = () => {
  const infoBlocks = [
    {
      id: 1,
      title: 'Профессионалы',
      icon: <Users className="w-8 h-8" />,
      href: '/professionals',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'Доступная среда',
      icon: <Shield className="w-8 h-8" />,
      href: '/accessible-environment',
      gradient: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: 'Конкурсы',
      icon: <Trophy className="w-8 h-8" />,
      href: '/contests',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      id: 4,
      title: 'Обращения граждан',
      icon: <MessageSquare className="w-8 h-8" />,
      href: '/citizen-appeals',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      id: 5,
      title: 'Сообщить о коррупции',
      icon: <AlertTriangle className="w-8 h-8" />,
      href: '/corruption-report',
      gradient: 'from-red-500 to-red-600'
    },
    {
      id: 6,
      title: 'Документы',
      icon: <FileText className="w-8 h-8" />,
      href: '/documents',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 7,
      title: 'Видео',
      icon: <Video className="w-8 h-8" />,
      href: 'https://rutube.ru/channel/25410608/',
      gradient: 'from-pink-500 to-pink-600',
      external: true
    }
  ];

  return (
    <section className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {infoBlocks.map((block) => (
          block.external ? (
            <a
              key={block.id}
              href={block.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`info-block bg-gradient-to-br ${block.gradient} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {block.icon}
                </div>
                <h3 className="font-semibold text-sm leading-tight">{block.title}</h3>
              </div>
            </a>
          ) : (
            <Link
              key={block.id}
              to={block.href}
              className={`info-block bg-gradient-to-br ${block.gradient} text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
            >
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {block.icon}
                </div>
                <h3 className="font-semibold text-sm leading-tight">{block.title}</h3>
              </div>
            </Link>
          )
        ))}
      </div>
    </section>
  );
};

export default InfoBlocks;