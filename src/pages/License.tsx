import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { Card } from '@/components/ui/card';
import lc_1 from '@/assets/pictures/Licen1.jpg';
import lc_2 from '@/assets/pictures/Licen2.jpg';
import lc_3 from '@/assets/pictures/ttzht_prilog1.jpg';
import lc_4 from '@/assets/pictures/ttzht_prilog2.jpg';
import qr_lc from '@/assets/pictures/qr_lic_2024.jpg';

const License = () => {
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
              <h1 className="text-3xl font-bold text-primary mb-8 text-center">Лицензия</h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Документ о лицензии №1</h2>
                  <div 
                    className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(lc_1, '_blank')}
                  >
                    <img 
                      src={lc_1}
                      alt="Документ о лицензии №1"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Документ о лицензии №2</h2>
                  <div 
                    className="aspect-[3/4] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(lc_2, '_blank')}
                  >
                    <img 
                      src={lc_2} 
                      alt="Документ о лицензии №2"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Документ о лицензии №3</h2>
                  <div 
                    className="aspect-[3/4] bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(lc_3, '_blank')}
                  >
                    <img 
                      src={lc_3}
                      alt="Документ о лицензии №3"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Card>
                
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-primary mb-4">Документ о лицензии №4</h2>
                  <div 
                    className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                    onClick={() => window.open(lc_4, '_blank')}
                  >
                    <img 
                      src={lc_4} 
                      alt="Документ о лицензии №4"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </Card>
              </div>
              
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">QR-код для проверки</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <div 
                      className="w-64 h-64 bg-white rounded-lg shadow-lg border border-border overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300"
                      onClick={() => window.open(qr_lc, '_blank')}
                    >
                      <img 
                        src={qr_lc}
                        alt="QR-код для проверки"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-semibold mb-4 text-primary text-lg">Как скачать выписку из «Реестра лицензий образовательных организаций»</p>
                    <ol className="space-y-2 leading-relaxed">
                      <li><strong>1.</strong> Отсканируйте код или перейдите на сайт «Лицензия» (размещена общая информация о лицензии).</li>
                      <li><strong>2.</strong> Находим раздел «Скачать реестровую выписку» (сверху таблицы «Сведения о лицензируемом виде деятельности»)</li>
                      <li><strong>3.</strong> Загружаем файл Реестровая выписка.zip</li>
                      <li><strong>4.</strong> Открываем архивный документ и распечатываем реестровую выписку.</li>
                    </ol>
                  </div>
                </div>
              </Card>
              
              <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-primary mb-4">О лицензии на образовательную деятельность</h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-foreground leading-relaxed">
                    Лицензия на осуществление образовательной деятельности выдается лицензирующим органом 
                    на основании заявления соискателя лицензии и прилагаемых к нему документов.
                  </p>
                  <p className="text-foreground leading-relaxed">
                    Лицензия подтверждает право образовательной организации на ведение образовательной деятельности 
                    по указанным в ней образовательным программам.
                  </p>
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

export default License;