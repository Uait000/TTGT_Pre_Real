import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText } from 'lucide-react';

const AccessibleEnvironment = () => {
  const documents = [
    {
      title: 'Положение об охране здоровья обучающихся, в том числе инвалидов и лиц с ограниченными возможностями здоровья',
      url: '#'
    },
    {
      title: 'Программа создания безбарьерной среды для инвалидов и лиц с ограниченными возможностями здоровья',
      url: '#'
    },
    {
      title: 'План мероприятий (Дорожная карта) по повышению значений показателей доступности для инвалидов объектов и услуг в сфере образования на 2015-2030 годы ФГБОУ ВО РГУПС',
      url: '#'
    },
    {
      title: 'Паспорт доступности для инвалидов объекта и предоставляемых на нем услуг в сфере образования (корпус 1)',
      url: '#'
    },
    {
      title: 'Паспорт доступности для инвалидов объекта и предоставляемых на нем услуг в сфере образования (общежитие 1)',
      url: '#'
    },
    {
      title: 'Положение об обучении инвалидов и лиц с ограниченными возможностями здоровья',
      url: '#'
    },
    {
      title: 'Рабочая программа учебной дисциплины "Адаптивная физическая культура" для обучающихся с инвалидностью и лиц с ограниченными возможностями здоровья',
      url: '#'
    },
    {
      title: 'Положение об организации и проведении текущего контроля знаний и промежуточной аттестации инвалидов и лиц с ограниченными возможностями здоровья',
      url: '#'
    },
    {
      title: 'Положение об организации практики по образовательным программам высшего и среднего профессионального образования для лиц с ограниченными возможностями здоровья, обучающихся в ФГБОУ ВПО РГУПС и его филиалах',
      url: '#'
    },
    {
      title: 'Методические рекомендации "Организация психолого-педагогического сопровождения обучающихся с ограниченными возможностями здоровья"',
      url: '#'
    }
  ];

  const sections = [
    {
      title: 'Условия для обучения инвалидов и лиц с ограниченными возможностями здоровья',
      documents: documents.slice(0, 5)
    },
    {
      title: 'Адаптированные образовательные программы для инвалидов и лиц с ограниченными возможностями здоровья',
      documents: documents.slice(5, 9)
    },
    {
      title: 'Виды и формы сопровождения обучения',
      documents: documents.slice(9, 10)
    },
    {
      title: 'Наличие специальных технических и программных средств обучения',
      documents: []
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Доступная среда</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Hero image */}
                <div className="w-full aspect-[16/6] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-8">
                  <img
                    src="https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg"
                    alt="Доступная среда"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-8">
                  {sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="bg-white rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-primary mb-6">{section.title}</h2>
                      
                      {section.documents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                          {section.documents.map((doc, index) => (
                            <a
                              key={index}
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                            >
                              <FileText className="w-6 h-6 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0" />
                              <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                                {doc.title}
                              </span>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-lg p-6 text-center">
                          <p className="text-muted-foreground">Информация будет добавлена позже</p>
                        </div>
                      )}
                    </div>
                  ))}
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

export default AccessibleEnvironment;