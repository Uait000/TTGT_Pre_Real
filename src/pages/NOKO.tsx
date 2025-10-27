import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import InfoBlocks from '@/components/InfoBlocks';
import { ExternalLink, FileText, CheckSquare, Film } from 'lucide-react'; // Добавлены иконки
import VNOKO from '@/assets/file/Pol_VNOKO_31.08.2021.pdf';

const NOKO = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 min-h-screen">
          <div className="container mx-auto px-6 py-8">
            <InfoBlocks />
            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
              <h1 className="text-3xl font-bold text-primary mb-2 text-center">Независимая оценка качества образования</h1>
              <p className="text-center text-muted-foreground mb-10">(НОКО)</p>
              
              {/* ✅ ИЗМЕНЕНИЕ 1: Новый дизайн страницы с секциями */}
              <div className="space-y-10">

                {/* --- Секция опроса --- */}
                <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                  <div className="flex items-center mb-6">
                    <CheckSquare className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-semibold text-blue-800">Пройдите опрос о качестве образования</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Уважаемые обучающиеся и их законные представители! Просьба пройти опрос о качестве осуществления образовательной деятельности ТТЖТ - филиала РГУПС по ссылке:
                    <a 
                      href="https://a28476.webask.io/qpfrhskge" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 font-semibold ml-1 break-all inline-flex items-center"
                    >
                      https://a28476.webask.io/qpfrhskge <ExternalLink className="w-4 h-4 ml-1 flex-shrink-0" />
                    </a>.
                    <br/>
                    <span className="font-medium text-red-600">Опрос можно пройти только с одного устройства!</span>
                  </p>

                  <div className="bg-white rounded-lg p-6 border border-blue-100">
                    <h3 className="font-semibold text-blue-700 mb-4">Инструкция по прохождению опроса:</h3>
                    <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
                      <li>В анкете выбрать категорию участника, нажать Далее.</li>
                      <li>Подтвердить, что Вам больше 14 лет, нажать Далее.</li>
                      <li>Выберите регион <span className="font-medium">Краснодарский край</span>, нажмите Далее.</li>
                      <li>Выберите <span className="font-medium">Тихорецкий техникум железнодорожного транспорта - филиал ФГБОУ ВО "Ростовский государственный университет путей сообщения"</span>.</li>
                      <li>Далее отвечаете на вопросы анкеты.</li>
                    </ol>
                  </div>
                </section>

                {/* --- Секция документов --- */}
                <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-8 shadow-sm">
                   <div className="flex items-center mb-6">
                     <FileText className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-semibold text-green-800">Нормативные документы</h2>
                  </div>
                  <div className="space-y-4">
                    {/* ✅ ИСПРАВЛЕНИЕ 2: Подключен локальный PDF */}
                    <a
                      href={VNOKO}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group transform hover:-translate-y-1"
                    >
                      <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">Положение о проведении внутренней независимой оценки качества образования в ТТЖТ - филиале РГУПС</span>
                      <FileText className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-4" />
                    </a>

                    {/* ✅ ИСПРАВЛЕНИЕ 3: Подключена внешняя ссылка на PDF */}
                    <a
                      href="https://rgups.ru/site/assets/files/90788/othet_o_samoobsledovanii_26_03_2024.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group transform hover:-translate-y-1"
                    >
                      <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">Отчет о результатах самообследования</span>
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-4" />
                    </a>
                  </div>
                </section>

                {/* --- Секция видео ролика --- */}
                {/* ✅ ИСПРАВЛЕНИЕ 4: Секция сделана кликабельной ссылкой */}
                <a
                  href="https://open.edu.gov.ru/quality-of-education/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-300 group transform hover:-translate-y-1"
                >
                   <div className="flex items-center mb-4">
                     <Film className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
                    <h2 className="text-2xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">Дополнительные материалы</h2>
                  </div>
                  <p className="text-gray-700 group-hover:text-gray-800 transition-colors flex items-center justify-between">
                    <span>Ролик о проведении независимой оценки качества условий осуществления образовательной деятельности организациями</span>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-4" />
                  </p>
                </a>

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

export default NOKO;