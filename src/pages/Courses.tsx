import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { ExternalLink } from 'lucide-react';

const Courses = () => {
  const courseItems = [
    { id: 1, name: 'Расписание', image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg', url: '#' },
    { id: 2, name: 'Документы', image: 'https://images.pexels.com/photos/1181534/pexels-photo-1181534.jpeg', url: '#' },
    { id: 3, name: 'Объявление', image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg', url: '#' },
    { id: 4, name: 'Дистанционное обучение', image: 'https://images.pexels.com/photos/1181678/pexels-photo-1181678.jpeg', url: '#' },
    { id: 5, name: 'Об отделении дополнительного профессионального образования', image: 'https://images.pexels.com/photos/1181679/pexels-photo-1181679.jpeg', url: '#' },
    { id: 6, name: 'Контакты', image: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg', url: '#' },
    { id: 7, name: 'Программы профессионального обучения', image: 'https://images.pexels.com/photos/1181681/pexels-photo-1181681.jpeg', url: '#' },
    { id: 8, name: 'Стоимость услуг', image: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg', url: '#' },
    { id: 9, name: 'Заявление', image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg', url: '#' },
    { id: 10, name: 'Договор на обучение', image: 'https://images.pexels.com/photos/256490/pexels-photo-256490.jpeg', url: '#' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Курсы</h1>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courseItems.slice(0, 9).map((item) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-semibold text-foreground mb-4 text-center text-sm leading-tight group-hover:text-primary transition-colors">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                        <span className="text-sm font-medium">Перейти</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>

                {/* Последний элемент на всю ширину */}
                <div className="w-full">
                  <a
                    href={courseItems[9].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-8 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                      <div className="aspect-square bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg overflow-hidden">
                        <img 
                          src={courseItems[9].image} 
                          alt={courseItems[9].name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="lg:col-span-2 text-center lg:text-left">
                        <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {courseItems[9].name}
                        </h3>
                        <div className="flex items-center justify-center lg:justify-start space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                          <span className="font-medium">Перейти</span>
                          <ExternalLink className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Целевая подготовка студентов */}
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                  <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-white rounded-lg p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                  >
                    <div className="text-center">
                      <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors">
                        Целевая подготовка студентов
                      </h3>
                      <div className="flex items-center justify-center space-x-2 text-primary group-hover:text-primary-hover transition-colors">
                        <span className="font-medium">Подробнее</span>
                        <ExternalLink className="w-5 h-5" />
                      </div>
                    </div>
                  </a>
                </div>
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

export default Courses;