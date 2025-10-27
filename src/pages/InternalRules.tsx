import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react'; // Импортируем иконки

const InternalRules = () => {
  
  // Данные для секции "Запрещено"
  const forbiddenRules = [
    { id: 1, text: 'Пропускать и опаздывать на занятия без уважительной причины.' },
    { id: 2, text: 'Употреблять спиртные напитки, наркотические и токсические средства.' },
    { id: 3, text: 'Курить в помещениях техникума и на его территории.' },
    { id: 4, text: 'Употреблять нецензурные выражения.' },
    { id: 5, text: 'Портить оборудование и имущество техникума.' },
    { id: 6, text: 'Употреблять жевательные резинки в помещении.' },
    { id: 7, text: 'Пользоваться переносными радиоприемниками, магнитофонами (плеерами) и сотовыми телефонами во время учебных занятий.' },
  ];

  // Данные для секции "Обязательно"
  const requiredRules = [
    { id: 1, text: 'Соблюдать частоту и порядок в помещениях и на территории техникума.' },
    { id: 2, text: 'Приходить на занятия, имея опрятный внешний вид и одежду, соответствующую учебному заведению (не допускается наличие головного убора в помещениях, одежды спортивного или пляжного стиля, в том числе шорты, спортивные брюки, пляжные тапочки и т.п.).' },
  ];

  return (
    <div className="min-h-screen bg-gray-50"> {/* Фон страницы */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center tracking-tight flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 mr-4 text-accent" />
                Правила внутреннего распорядка
              </h1>
              <p className="text-center text-lg text-muted-foreground mb-16 max-w-3xl mx-auto">
                Соблюдение этих правил — основа уважения к себе и окружающим, а также залог успешного и безопасного обучения.
              </p>

              {/* ✅ Новый дизайн в 2 колонки */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* --- Колонка "Запрещено" (Красная) --- */}
                <section className="bg-gradient-to-br from-red-50 to-pink-100 rounded-xl border border-red-200 p-8 shadow-inner">
                  <h2 className="text-3xl font-bold text-red-700 mb-8 flex items-center">
                    <XCircle className="w-8 h-8 mr-3 flex-shrink-0" />
                    I. Студентам запрещено:
                  </h2>
                  <div className="space-y-4">
                    {forbiddenRules.map((rule) => (
                      <div 
                        key={rule.id} 
                        className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg border border-red-100 shadow-sm"
                      >
                        <span className="text-red-600 font-bold text-xl">{rule.id}.</span>
                        <p className="text-gray-700 leading-relaxed">{rule.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* --- Колонка "Обязательно" (Зеленая) --- */}
                <section className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-8 shadow-inner">
                  <h2 className="text-3xl font-bold text-green-700 mb-8 flex items-center">
                    <CheckCircle className="w-8 h-8 mr-3 flex-shrink-0" />
                    II. Студенты обязаны:
                  </h2>
                  <div className="space-y-4">
                    {requiredRules.map((rule) => (
                      <div 
                        key={rule.id}
                        className="flex items-start space-x-4 p-4 bg-white/70 rounded-lg border border-green-100 shadow-sm"
                      >
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        <p className="text-gray-700 leading-relaxed">{rule.text}</p>
                      </div>
                    ))}
                  </div>
                </section>

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

export default InternalRules;