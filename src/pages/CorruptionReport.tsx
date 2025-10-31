import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { 
  FileText, 
  Phone, 
  Mail, 
  Gavel, 
  Shield, 
  AlertTriangle, 
  Download,
  Megaphone,
  BookOpen
} from 'lucide-react';
import corp1 from '@/assets/pictures/corp.jpg';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import planMeropriyatiy from '@/assets/file/corp/Plan_mer_korr_30_08_2024.pdf';
import polozhenieOKomissii from '@/assets/file/corp/Pol_korr.pdf';
import prikazOKomissii from '@/assets/file/corp/Plan_mer_korr_30_08_2024.pdf'; 
import izmeneniyaVPrikaz from '@/assets/file/corp/pr_o_kom_korr_izm_03_09_2024.pdf';
import zapretNaPodarki from '@/assets/file/corp/podarki.pdf';


const CorruptionReport = () => {
  const documents = [
    {
      title: 'План мероприятий ТТЖТ - филиала РГУПС по противодействию коррупции... на 2024-2025 учебный год',
      url: planMeropriyatiy
    },
    {
      title: 'Положение о комиссии по противодействию коррупции ТТЖТ - филиала РГУПС',
      url: polozhenieOKomissii
    },
    {
      title: 'Приказ "О комиссии по противодействию коррупции и урегулированию конфликта интересов..."',
      url: prikazOKomissii
    },
    {
      title: 'Изменения в приказ "О комиссии по противодействию коррупции..."',
      url: izmeneniyaVPrikaz
    },
    {
      title: 'Запрет на дарение подарков',
      url: zapretNaPodarki
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            
            <div className="w-full h-64 md:h-80 relative rounded-xl overflow-hidden mb-12 shadow-lg">
              <img
                src={corp1}
                alt="Противодействие коррупции"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 md:p-10">
                <h1 className="text-4xl lg:text-5xl font-bold text-white" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  Сообщить о коррупции
                </h1>
              </div>
            </div>

            <div className="relative flex flex-col items-start pl-10 md:pl-12">
              
              <div className="absolute left-4 md:left-6 top-1 bottom-1 w-1.5 bg-gradient-to-b from-primary via-blue-700 to-red-500 rounded-full"></div>

              <div className="mb-10 w-full relative">
                <div className="absolute left-[-42px] md:left-[-48px] top-5 z-10 w-10 h-10 bg-primary rounded-full flex items-center justify-center ring-8 ring-background">
                  <Megaphone className="w-5 h-5 text-white" />
                </div>
                <Card className="bg-gradient-to-r from-primary to-blue-700 text-white shadow-xl border-none">
                  <CardHeader>
                    <CardTitle className="text-3xl font-bold">Сообщить о факте коррупции</CardTitle>
                    <CardDescription className="text-primary-foreground/90 text-base">
                      Телефоны доверия и контакты ответственных лиц.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <p className="text-lg font-semibold">Общий телефон доверия:</p>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-6 h-6" />
                        <span className="font-semibold text-2xl tracking-wider">8(86196) 6-20-03 доб.101</span>
                      </div>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5">
                      <p className="text-sm mb-2 text-primary-foreground/80">
                        Председатель комиссии по противодействию коррупции:
                      </p>
                      <p className="font-bold text-xl mb-1">Ярошевская Ольга Николаевна</p>
                      <p className="text-sm mb-4 text-primary-foreground/80">Зам. директора по воспитательной работе</p>
                      
                      <div className="space-y-2 border-t border-white/20 pt-4">
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4" />
                          <span className="font-medium">8(86196) 6-20-03, доп. 127</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4" />
                          <span className="font-medium">zamvr@ttgt.org</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-10 w-full relative">
                <div className="absolute left-[-42px] md:left-[-48px] top-5 z-10 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center ring-8 ring-background">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Что нужно знать</CardTitle>
                    <CardDescription>
                      Определения, виды противодействия и ответственность.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full" defaultValue='item-3'>
                      <AccordionItem value="item-1">
                        <AccordionTrigger className="text-base font-semibold text-red-700">
                          <Gavel className="w-5 h-5 mr-3 text-red-700" />
                          Определение коррупции
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 text-base">
                          <p className="mb-2">
                            В соответствии с ФЗ от 25.12.2008 No 273-ФЗ <strong>КОРРУПЦИЯ</strong> – это:
                          </p>
                          <ul className="list-disc list-inside space-y-2">
                            <li>
                              Злоупотребление служебным положением, дача/получение взятки, злоупотребление полномочиями, коммерческий подкуп... в целях получения выгоды.
                            </li>
                            <li>
                              Cовершение этих деяний от имени или в интересах юридического лица.
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger className="text-base font-semibold text-blue-700">
                           <Shield className="w-5 h-5 mr-3 text-blue-700" />
                          Противодействие коррупции
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 text-base">
                          <p className="mb-2">Деятельность в пределах полномочий по:</p>
                          <ul className="list-disc list-inside space-y-2">
                            <li><strong>Профилактике</strong> (предупреждение, устранение причин).</li>
                            <li><strong>Борьбе</strong> (выявление, пресечение, расследование).</li>
                            <li><strong>Ликвидации последствий</strong> (минимизация).</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3" className="border-b-0">
                        <AccordionTrigger className="text-base font-semibold text-yellow-700">
                          <AlertTriangle className="w-5 h-5 mr-3 text-yellow-700" />
                          Внимание! (Заведомо ложный донос)
                        </AccordionTrigger>
                        <AccordionContent className="pl-8 text-base">
                          <p>
                            Обращаем внимание на то, что <strong>статьей 306 Уголовного кодекса РФ</strong> предусмотрена уголовная ответственность за заведомо ложный донос о совершении преступления.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>


              <div className="w-full relative">
                <div className="absolute left-[-42px] md:left-[-48px] top-5 z-10 w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center ring-8 ring-background">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-2xl">Нормативные документы</CardTitle>
                    <CardDescription>
                      Планы, приказы и положения, регламентирующие антикоррупционную деятельность.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3"> 
                      {documents.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between space-x-3 p-4 rounded-lg border bg-background/50 
                                     transition-all duration-300 ease-in-out group 
                                     hover:shadow-xl hover:border-primary/30 hover:scale-[1.02] hover:-translate-y-1"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <FileText className="w-5 h-5 text-primary/80 group-hover:text-primary transition-colors flex-shrink-0" />
                            <span className="text-foreground font-medium group-hover:text-primary transition-colors text-sm truncate">
                              {doc.title}
                            </span>
                          </div>
                          <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

          </div>
        </main>
        
        <aside className="hidden lg:block w-80 bg-white border-l border-border p-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarCards />
        </aside>
      </div>
    </div>
  );
};

export default CorruptionReport;