import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ExternalLink } from 'lucide-react';

const ELibrary = () => {
  const libraries = [
    {
      id: 1,
      name: 'Электронно-библиотечная система IPR SMART',
      url: 'https://www.iprbookshop.ru',
      logo: 'https://www.iprbookshop.ru/assets/templates/bs3/img/logotype.png'
    },
    {
      id: 2,
      name: 'Образовательная платформа Юрайт',
      url: 'https://urait.ru',
      logo: 'https://static.tildacdn.com/tild3939-3534-4232-b938-333233333732/Group_178.png'
    },
    {
      id: 3,
      name: 'Электронная библиотека УМЦ ЖДТ',
      url: 'http://umczdt.ru/books',
      logo: 'https://s1.radikal.cloud/2025/09/21/Group_1394-no-bg-preview-carve.photos649a18fa644fedaf.png'
    },
    {
      id: 4,
      name: 'Национальная электронная библиотека',
      url: 'https://rusneb.ru',
      logo: 'https://s3.radikal.cloud/2025/09/21/snapedit_1758482217896199b49a4d04faa9d.png'
    },
    {
      id: 5,
      name: '«Российская электронная школа»',
      url: 'https://resh.edu.ru',
      logo: 'https://s1.radikal.cloud/2025/09/21/resh_X-Design-no-bg-preview-carve.photos582851f4600aa6df.png'
    },
    {
      id: 6,
      name: '«Знаниум»',
      url: 'https://znanium.ru',
      logo: 'https://radika1.link/2025/09/21/photo-no-bg-preview-carve.photos83868d26f98422bf.png'
    },
    {
      id: 7,
      name: 'Электронная информационно-образовательная среда РГУПС',
      url: 'http://portal.rgups.ru',
      logo: 'https://dlearn.rgups.ru/pluginfile.php/357687/mod_label/intro/RGUPS-logo.png'
    },
    {
      id: 8,
      name: 'Электронно-образовательная среда ТТЖТ',
      url: 'http://tihtgt.ru',
      logo: 'https://s3.radikal.cloud/2025/09/21/RISUNOK16414b1d9382304d3.png'
    },
    {
      id: 9,
      name: 'Издательство Академия',
      url: '#',
      logo: 'https://s3.radikal.cloud/2025/09/21/Akademiy-no-bg-preview-carve.photos01d45adaaec98980.png'
    },
    {
      id: 10,
      name: 'Издательство УМЦ',
      url: '#',
      logo: 'https://s1.radikal.cloud/2025/09/21/Group_1394-no-bg-preview-carve.photos649a18fa644fedaf.png'
    },
    {
      id: 11,
      name: 'Издательство Book.ru',
      url: '#',
      logo: 'https://s2.radikal.cloud/2025/09/21/snapedit_175848423585568b66728fe9c83eb.png'
    }
    
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            {/* Info Blocks */}
            <InfoBlocks />
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Электронная библиотека</h1>
              
              <div className="space-y-6">
                {/* Электронные библиотеки */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {libraries.slice(0, 6).map((library) => (
                      <div key={library.id} className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <div className="aspect-[16/10] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={library.logo} 
                            alt={library.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-foreground mb-4 text-center text-sm leading-tight">{library.name}</h3>
                        <a
                          href={library.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Посетить</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Электронные ресурсы */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Электронные ресурсы</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {libraries.slice(6, 8).map((library) => (
                      <div key={library.id} className="bg-gradient-to-br from-secondary/5 to-accent/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <div className="aspect-[16/10] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={library.logo} 
                            alt={library.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-foreground mb-4 text-center">{library.name}</h3>
                        <a
                          href={library.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Посетить</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Сотрудничество с издательствами */}
                <div>
                  <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Сотрудничество с издательствами</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {libraries.slice(8, 11).map((library) => (
                      <div key={library.id} className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl border border-border/50 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={library.logo} 
                            alt={library.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <h3 className="font-semibold text-foreground mb-4 text-center">{library.name}</h3>
                        <a
                          href={library.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-accent hover:bg-accent/80 text-accent-foreground px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Посетить</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    ))}
                  </div>
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

export default ELibrary;