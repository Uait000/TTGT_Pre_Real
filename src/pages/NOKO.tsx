import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { ExternalLink, FileText, CheckSquare, Film } from 'lucide-react';
import { settingsApi, NokoDocument } from '@/api/settings';
import VNOKO from '@/assets/file/Pol_VNOKO_31.08.2021.pdf';

const DEFAULT_DOCS: NokoDocument[] = [
    { title: 'Положение о проведении внутренней независимой оценки качества образования в ТТЖТ - филиале РГУПС', url: VNOKO },
    { title: 'Отчет о результатах самообследования', url: 'https://rgups.ru/site/assets/files/90788/othet_o_samoobsledovanii_26_03_2024.pdf' }
];

const NOKO = () => {
    const [documents, setDocuments] = useState<NokoDocument[]>(DEFAULT_DOCS);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await settingsApi.getPageData('noko_page');
                
                // Обработка данных: API может вернуть массив или объект {items: [...]}
                let realData: any[] = [];
                
                if (data) {
                    if (Array.isArray(data)) {
                        realData = data;
                    } else if (data.items && Array.isArray(data.items)) {
                        realData = data.items;
                    } else if (typeof data === 'object') {
                        // Попытка извлечь из объекта с числовыми ключами
                        const values = Object.values(data);
                        if (values.length > 0) realData = values;
                    }
                }
                
                if (realData.length > 0) {
                    // Объединяем с дефолтными данными для сохранения структуры
                    // Если документов в базе меньше чем дефолтных, берем из базы.
                    // Если больше - берем все из базы.
                    // Если ссылка пустая, пытаемся взять дефолтную по индексу.
                    
                    const processedDocs = realData.map((item: any, index: number) => {
                        const defaultDoc = DEFAULT_DOCS[index];
                        return {
                            title: item.title,
                            url: item.url || (defaultDoc ? defaultDoc.url : '#')
                        };
                    });
                    setDocuments(processedDocs);
                }
            } catch (error) {
                console.error('Error loading NOKO data:', error);
            }
        };
        loadData();
    }, []);

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-2 text-center">Независимая оценка качества образования</h1>
                <p className="text-center text-muted-foreground mb-10">(НОКО)</p>
                
                <div className="space-y-10">
                    <section className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-8 shadow-sm">
                        <div className="flex items-center mb-6">
                            <CheckSquare className="w-8 h-8 text-blue-600 mr-4 flex-shrink-0" />
                            <h2 className="text-2xl font-semibold text-blue-800">Пройдите опрос о качестве образования</h2>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-6">
                            Обучающиеся и их законные представители просьба пройти опрос о качестве осуществления образовательной деятельности ТТЖТ - филиала РГУПС  по адресу <a href="https://a28476.webask.io/qpfrhskge" target="_blank" className="text-blue-600 font-semibold">https://a28476.webask.io/qpfrhskge</a>. .  Опрос можно пройти только с одного устройства!
В анкете выбрать категорию участника, нажать Далее, подтвердить, что Вам больше 14 лет, нажать Далее, выберите регион Краснодарский край, нажмите Далее, выберите Тихорецкий техникум железнодорожного транспорта - филиал ФГБОУ ВО "Ростовский государственный университет путей сообщения", далее отвечаете на вопросы. 
                        </p>
                    </section>

                    <section className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200 p-8 shadow-sm">
                        <div className="flex items-center mb-6">
                            <FileText className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                            <h2 className="text-2xl font-semibold text-green-800">Нормативные документы</h2>
                        </div>
                        <div className="space-y-4">
                            {documents.map((doc, index) => (
                                <a key={index} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-300 group transform hover:-translate-y-1">
                                    <span className="text-foreground font-medium group-hover:text-green-700 transition-colors">{doc.title}</span>
                                    {doc.url.endsWith('.pdf') ? <FileText className="w-5 h-5 text-gray-400 group-hover:text-green-600"/> : <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-green-600"/>}
                                </a>
                            ))}
                        </div>
                    </section>
                    
                    <a href="https://open.edu.gov.ru/quality-of-education/" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-8 shadow-sm hover:shadow-lg hover:border-purple-400 transition-all duration-300 group transform hover:-translate-y-1">
                        <div className="flex items-center mb-4">
                            <Film className="w-8 h-8 text-purple-600 mr-4 flex-shrink-0" />
                            <h2 className="text-2xl font-semibold text-purple-800 group-hover:text-purple-900 transition-colors">Дополнительные материалы</h2>
                        </div>
                        <p className="text-gray-700 group-hover:text-gray-800 transition-colors flex items-center justify-between">
                            <span>Ролик о проведении независимой оценки качества</span>
                            <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-4" />
                        </p>
                    </a>
                </div>
            </div>
        </MainLayout>
    );
};
export default NOKO;