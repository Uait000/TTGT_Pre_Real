import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout';
import { Card } from '@/components/ui/card';
import { settingsApi } from '@/api/settings';

// Дефолтные импорты
import lc_1 from '@/assets/pictures/Licen1.jpg';
import lc_2 from '@/assets/pictures/Licen2.jpg';
import lc_3 from '@/assets/pictures/ttzht_prilog1.jpg';
import lc_4 from '@/assets/pictures/ttzht_prilog2.jpg';
import qr_lc from '@/assets/pictures/qr_lic_2024.jpg';

const License = () => {
    const [data, setData] = useState({
        docs: [lc_1, lc_2, lc_3, lc_4],
        qr_code: qr_lc,
        description: `<p>Лицензия на осуществление образовательной деятельности выдается лицензирующим органом на основании заявления соискателя лицензии и прилагаемых к нему документов.</p><p>Лицензия подтверждает право образовательной организации на ведение образовательной деятельности по указанным в ней образовательным программам.</p>`
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const settings = await settingsApi.getPageData('license_page');
                if (settings) {
                    setData(prevData => ({
                        ...prevData,
                        ...settings,
                        docs: (settings.docs && settings.docs.length > 0) ? settings.docs : prevData.docs,
                        qr_code: settings.qr_code || prevData.qr_code,
                        description: settings.description || prevData.description
                    }));
                }
            } catch (error) {
                console.error('Error loading license data:', error);
            }
        };
        loadData();
    }, []);

    return (
        <MainLayout>
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Лицензия</h1>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {data.docs.map((doc, idx) => (
                        <Card key={idx} className="p-6">
                            <h2 className="text-xl font-semibold text-primary mb-4">Документ о лицензии №{idx + 1}</h2>
                            <div 
                                className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300" 
                                onClick={() => window.open(doc, '_blank')}
                            >
                                <img 
                                    src={doc} 
                                    alt={`Лицензия страница ${idx + 1}`}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        </Card>
                    ))}
                </div>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold text-primary mb-4 text-center">QR-код для проверки</h2>
                    <div className="flex justify-center">
                        <div 
                            className="w-64 h-64 bg-white rounded-lg shadow-lg border border-border overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300" 
                            onClick={() => window.open(data.qr_code, '_blank')}
                        >
                            <img 
                                src={data.qr_code} 
                                alt="QR код лицензии"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                    </div>
                </Card>

                <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6">
                    {/* Добавлен класс rich-text-content */}
                    <div 
                        className="prose prose-gray max-w-none rich-text-content" 
                        dangerouslySetInnerHTML={{ __html: data.description }} 
                    />
                </div>
            </div>
        </MainLayout>
    );
};

export default License;