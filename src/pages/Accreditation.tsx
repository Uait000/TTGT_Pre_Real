import { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { Card } from '@/components/ui/card';
import { settingsApi, AccreditationSettings } from '@/api/settings';

// Импорты для fallback (дефолтные картинки)
import acr_1 from '@/assets/pictures/acr_1.jpg';
import acr_2 from '@/assets/pictures/acr_2.jpg';
import acr_3 from '@/assets/pictures/acr_3.jpg';
import qr1 from '@/assets/pictures/qr_akkr_2024.jpg';

const DEFAULT_ACCREDITATION: AccreditationSettings = {
    docs: [acr_1, acr_2, acr_3],
    qr_code: qr1,
    description: `<p>Государственная аккредитация образовательной деятельности проводится по основным образовательным программам, реализуемым в соответствии с федеральными государственными образовательными стандартами.</p>
                  <p>Свидетельство о государственной аккредитации подтверждает соответствие качества подготовки обучающихся и выпускников требованиям федеральных государственных образовательных стандартов.</p>`
};

const Accreditation = () => {
    const [data, setData] = useState<AccreditationSettings>(DEFAULT_ACCREDITATION);

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('accreditation_page');
                if (settings) {
                    setData({
                        docs: (settings.docs && settings.docs.length > 0) ? settings.docs : DEFAULT_ACCREDITATION.docs,
                        qr_code: settings.qr_code || DEFAULT_ACCREDITATION.qr_code,
                        description: settings.description || DEFAULT_ACCREDITATION.description
                    });
                }
            } catch (error) {
                console.error('Error loading accreditation data:', error);
            }
        };
        loadData();
    }, []);

    // Helper to safely get image src
    const getDocImage = (index: number) => {
        return data.docs[index] || DEFAULT_ACCREDITATION.docs[index];
    };

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-6 md:p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Аккредитация</h1>
                
                {/* ИСПРАВЛЕНА СЕТКА: xl:grid-cols-1 (1 колонка на ноутбуке), 2xl:grid-cols-2 (2 на большом экране) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-8 mb-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-primary mb-4">Документ об аккредитации №1</h2>
                        <div 
                            className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                            onClick={() => window.open(getDocImage(0), '_blank')}
                        >
                            <img 
                                src={getDocImage(0)} 
                                alt="Документ об аккредитации №1"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Card>
                    
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-primary mb-4">Документ об аккредитации №2</h2>
                        <div 
                            className="aspect-[3/4] bg-gradient-to-br from-secondary/10 to-accent/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                            onClick={() => window.open(getDocImage(1), '_blank')}
                        >
                            <img 
                                src={getDocImage(1)} 
                                alt="Документ об аккредитации №2"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Card>
                </div>
                
                {/* ИСПРАВЛЕНА СЕТКА ТУТ ТОЖЕ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2 gap-8">
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-primary mb-4">Документ об аккредитации №3</h2>
                        <div 
                            className="aspect-[3/4] bg-gradient-to-br from-accent/10 to-primary/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
                            onClick={() => window.open(getDocImage(2), '_blank')}
                        >
                            <img 
                                src={getDocImage(2)} 
                                alt="Документ об аккредитации №3"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </Card>
                    
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold text-primary mb-4">QR-код для проверки</h2>
                        <div className="aspect-square bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border-2 border-primary/20 flex items-center justify-center p-4">
                            <div className="w-full">
                                <div 
                                    className="w-48 h-48 bg-white rounded-lg shadow-lg border border-border overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 mb-4 mx-auto"
                                    onClick={() => window.open(data.qr_code, '_blank')}
                                >
                                    <img 
                                        src={data.qr_code} 
                                        alt="QR-код для проверки"
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                                    <p className="font-semibold mb-2 text-center">Как скачать выписку из ГИС</p>
                                    <ol className="text-left space-y-1 text-xs sm:text-sm">
                                        <li>1. Отсканируйте код.</li>
                                        <li>2. Раздел «Скачать реестровую выписку».</li>
                                        <li>3. Загружаем файл .zip</li>
                                        <li>4. Распечатываем выписку.</li>
                                    </ol>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">О государственной аккредитации</h2>
                    <div className="prose prose-gray max-w-none rich-text-content">
                        <div dangerouslySetInnerHTML={{ __html: data.description }} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Accreditation;