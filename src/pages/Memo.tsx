import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ExternalLink, FileText, Snowflake, ClipboardCheck } from 'lucide-react'; // Добавлены иконки
import pamtka from '@/assets/file/pamtka.pdf';
import pamytka from '@/assets/file/Pamyatka_EGE_2024.pdf';
import mesta from '@/assets/file/Mesta_Reg_EGE_2024.pdf';

const Memo = () => {
  return (
    <div className="min-h-screen bg-gray-50"> {/* Фон страницы */}
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-12">
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-12 text-center tracking-tight flex items-center justify-center">
                <ClipboardCheck className="w-10 h-10 mr-4 text-accent" />
                Памятки и документы
              </h1>
              
              {/* ✅ Новый дизайн секций */}
              <div className="space-y-10">

                {/* --- Секция "Безопасность на водоемах" (Яркая) --- */}
                <section className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-xl border border-blue-200 p-8 shadow-lg">
                  <div className="flex items-center mb-5">
                    <Snowflake className="w-10 h-10 text-blue-600 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-bold text-blue-800">
                      О ПРАВИЛАХ ПОВЕДЕНИЯ И МЕРАХ БЕЗОПАСНОСТИ НА ВОДОЕМАХ В ЗИМНИЙ ПЕРИОД
                    </h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                    Пожалуйста, ознакомьтесь с важной информацией о правилах безопасности в зимний период.
                  </p>
                  
                  {/* ✅ ИСПРАВЛЕНИЕ: Подключен PDF 'pamtka' */}
                  <a
                    href={pamtka}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Скачать памятку
                  </a>
                </section>

                {/* --- Секция "Памятка ЕГЭ" --- */}
                <section className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border border-green-200 p-8 shadow-inner">
                  <h2 className="text-2xl font-bold text-green-800 mb-4">Памятка участникам ЕГЭ</h2>
                  <p className="text-gray-700 leading-relaxed mb-6 text-base">
                    Министерство образования, науки и Молодежной политики Краснодарского края напоминает, что согласно пункту 14 Порядка обучающиеся СПО имеют право сдавать ЕГЭ, в том числе при наличии у них действующих результатов ЕГЭ прошлых лет.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ✅ ИСПРАВЛЕНИЕ: Подключен PDF 'pamytka' */}
                    <a
                      href={pamytka}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:bg-white hover:border-green-400 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">Подробнее (Памятка ЕГЭ)</span>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </a>
                    
                    {/* ✅ ИСПРАВЛЕНИЕ: Подключен PDF 'mesta' */}
                    <a
                      href={mesta}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200 hover:bg-white hover:border-green-400 hover:shadow-md transition-all duration-300 group"
                    >
                      <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">Места регистрации на сдачу ЕГЭ</span>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                    </a>
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

export default Memo;