import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText, Phone, Mail } from 'lucide-react';

const CorruptionReport = () => {
  const documents = [
    {
      title: 'План мероприятий ТТЖТ - филиала РГУПС по противодействию коррупции и формированию антикоррупционного мировоззрения на 2024-2025 учебный год',
      url: '#'
    },
    {
      title: 'Положение о комиссии по противодействию коррупции ТТЖТ - филиала РГУПС',
      url: '#'
    },
    {
      title: 'Приказ "О комиссии по противодействию коррупции и урегулированию конфликта интересов ТТЖТ - филиала РГУПС"',
      url: '#'
    },
    {
      title: 'Изменения в приказ "О комиссии по противодействию коррупции и урегулированию конфликта интересов ТТЖТ - филиала РГУПС"',
      url: '#'
    },
    {
      title: 'Запрет на дарение подарков',
      url: '#'
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
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Сообщить о коррупции</h1>
              
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                {/* Hero image */}
                <div className="w-full aspect-[16/6] bg-gradient-to-br from-red-100 to-red-200 rounded-lg overflow-hidden shadow-lg mb-8">
                  <img
                    src="https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg"
                    alt="Противодействие коррупции"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="bg-white rounded-lg p-8 shadow-sm space-y-6">
                  <div className="prose prose-gray max-w-none">
                    <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 p-6 rounded-lg mb-6">
                      <h2 className="text-xl font-bold text-red-700 mb-4">Определение коррупции</h2>
                      <p className="text-foreground leading-relaxed mb-4">
                        В соответствии с пунктом 1 статьи 1 Федерального закона от 25 декабря 2008 года No 273-ФЗ «О противодействии коррупции» <strong>КОРРУПЦИЯ</strong> – это:
                      </p>
                      <p className="text-foreground leading-relaxed mb-4">
                        – злоупотребление служебным положением, дача взятки, получение взятки, злоупотребление полномочиями, коммерческий подкуп либо иное незаконное использование физическим лицом своего должностного положения вопреки законным интересам общества и государства в целях получения выгоды в виде денег, ценностей, иного имущества или услуг имущественного характера, иных имущественных прав для себя или для третьих лиц либо незаконное предоставление такой выгоды указанному лицу другими физическими лицами;
                      </p>
                      <p className="text-foreground leading-relaxed">
                        – совершение деяний, указанных выше, от имени или в интересах юридического лица.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                      <h2 className="text-xl font-bold text-blue-700 mb-4">Противодействие коррупции</h2>
                      <p className="text-foreground leading-relaxed mb-4">
                        В соответствии с пунктом 2 статьи 1 Федерального закона от 25 декабря 2008 года No 273-ФЗ «О противодействии коррупции» противодействием коррупции является:
                      </p>
                      <p className="text-foreground leading-relaxed mb-4">
                        деятельность федеральных органов государственной власти, органов государственной власти субъектов Российской Федерации, органов местного самоуправления, институтов гражданского общества, организаций и физических лиц в пределах их полномочий:
                      </p>
                      <ul className="space-y-2 text-foreground text-sm">
                        <li>а) по предупреждению коррупции, в том числе по выявлению и последующему устранению причин коррупции (профилактика коррупции);</li>
                        <li>б) по выявлению, предупреждению, пресечению, раскрытию и расследованию коррупционных правонарушений (борьба с коррупцией);</li>
                        <li>в) по минимизации и (или) ликвидации последствий коррупционных правонарушений.</li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 p-6 rounded-lg mb-6">
                      <p className="text-foreground leading-relaxed">
                        <strong>Обращаем внимание</strong> на то, что статьей 306 Уголовного кодекса Российской Федерации предусмотрена уголовная ответственность за заведомо ложный донос о совершении преступления.
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-6">
                      <h2 className="text-xl font-bold text-primary mb-4">Контактная информация</h2>
                      <p className="text-foreground leading-relaxed mb-4">
                        Если вы считаете, что вам стали известны факты коррупции в Тихорецком техникуме железнодорожного транспорта – филиал РГУПС, можете сообщить об этом:
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-primary" />
                          <span className="text-foreground font-semibold">8(86196) 6-20-03 доб.101</span>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-border/50">
                          <p className="text-foreground mb-2">
                            В соответствии с приказом ТТЖТ – филиала РГУПС от 31 августа 2023 г. № 161/од председателем комиссии по противодействию коррупции назначена:
                          </p>
                          <p className="text-primary font-semibold mb-2">Ярошевская Ольга Николаевна</p>
                          <p className="text-muted-foreground text-sm mb-3">заместитель директора по воспитательной работе</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <Phone className="w-4 h-4 text-primary" />
                              <span className="text-foreground">8(86196) 6-20-03, доп. 127</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-primary" />
                              <span className="text-foreground">zamvr@ttgt.org</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm">
                      <h2 className="text-xl font-semibold text-primary mb-6">Нормативные документы</h2>
                      <div className="space-y-4">
                        {documents.map((doc, index) => (
                          <a
                            key={index}
                            href={doc.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                          >
                            <FileText className="w-5 h-5 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0" />
                            <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                              {doc.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
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

export default CorruptionReport;