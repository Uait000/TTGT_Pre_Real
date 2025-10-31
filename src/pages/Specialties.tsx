import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { GraduationCap, Clock } from 'lucide-react';

const FormattedDuration = ({ text }: { text: string }) => {
  const cleanText = text.replace('Очная форма обучения:', '').trim();
  const parts = cleanText.split(' на базе ');
  if (parts.length === 2) {
    
    
    return (
      <p className="text-gray-700 text-sm leading-relaxed">
        <strong className="text-gray-900">{parts[0].trim()}</strong>
        <span className="text-gray-600"> на базе </span>
        <span>{parts[1].trim().replace('.', '')}</span> 
      </p>
    );
  }
  
  
  return (
    <p className="text-gray-700 text-sm leading-relaxed">
      {cleanText}
    </p>
  );
};


const Specialties = () => {
  const specialties = [
    {
      name: 'Строительство и эксплуатация зданий и сооружений',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Строительство железных дорог, путь и путевое хозяйство',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 3 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Компьютерные системы и комплексы',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Техническая эксплуатация транспортного радиоэлектронного оборудования (по видам транспорта)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Электроснабжение',
      duration: 'Очная форма обучения: 2 года 10 месяцев на базе основного общего образования; 1 год 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Сварочное производство',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Организация перевозок и управление на транспорте (по видам)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Техническая эксплуатация подъемно-транспортных, строительных, дорожных машин и оборудования (по отраслям)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Техническая эксплуатация подвижного состава железных дорог (электроподвижной состав)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Техническая эксплуатация подвижного состава железных дорог (вагоны)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Строительство железных дорог, путь и путевое хозяйство',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 3 года 10 месяцев на базе среднего общего образования.'
    },
    {
      name: 'Автоматика и телемеханика на транспорте (железнодорожном транспорте)',
      duration: 'Очная форма обучения: 3 года 10 месяцев на базе основного общего образования; 2 года 10 месяцев на базе среднего общего образования.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-4 lg:px-6 py-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Специальности обучения
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {specialties.map((specialty, index) => {
                
                const durationParts = specialty.duration.split(';');
                
                return (
                  <div 
                    key={index} 
                    className="bg-white rounded-2xl shadow-xl p-6 flex flex-col h-full transition-all duration-300 hover:shadow-primary/30 hover:-translate-y-1.5 group"
                  >
                    <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary transition-all duration-300">
                      <GraduationCap className="w-7 h-7 text-primary group-hover:text-white transition-all duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {specialty.name}
                    </h3>
                    <div className="mt-auto pt-6"> 
                      <div className="border-t border-gray-200 pt-5 space-y-3">
                        <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
                          Очная форма обучения
                        </h4>
                        {durationParts.map((part, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <Clock className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <FormattedDuration text={part} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
              
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

export default Specialties;