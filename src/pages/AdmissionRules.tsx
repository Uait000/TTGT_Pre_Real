import MainLayout from '@/components/MainLayout'; 
import { FileText } from 'lucide-react';
import uslov from '@/assets/file/usloviia_priema_platno_2025 (1).pdf';
import doop from '@/assets/file/dopolneniia_pp_spo_2025.pdf';
import pravila from '@/assets/file/pravila_priema_spo_2025.pdf';
import book from '@/assets/pictures/books-bookstore-book-reading-159711.jpeg';

const AdmissionRules = () => {
    const documents = [
        {
            title: 'Правила приема на обучение по образовательным программам среднего профессионального образования в ФГБОУ ВО РГУПС',
            url: pravila
        },
        {
            title: 'Дополнения в Правила приема на обучение по образовательным программам среднего профессионального образования в ФГБОУ ВО РГУПС от 01.04.2025',
            url: doop
        },
        {
            title: 'Условия приёма на обучение по договорам об оказании платных образовательных услуг по программам среднего профессионального образования',
            url: uslov
        }
    ];

    return (
        <MainLayout>

            
            <div className="bg-white rounded-lg shadow-sm border border-border p-8">
                <h1 className="text-3xl font-bold text-primary mb-8 text-center">Правила приема</h1>
                
                <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl border border-border/50 p-8">
                    <div className="w-full aspect-[16/6] bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg overflow-hidden shadow-lg mb-8">
                        <img
                            src={book}
                            alt="Правила приема"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="bg-white rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-semibold text-primary mb-6 text-center">Нормативные документы</h2>
                        
                        <div className="space-y-6">
                            {documents.map((doc, index) => (
                                <a
                                    key={index}
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start space-x-4 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border border-border/50 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                                >
                                    <FileText className="w-6 h-6 text-primary group-hover:text-primary-hover transition-colors flex-shrink-0 mt-1" />
                                    <span className="text-foreground font-medium group-hover:text-primary transition-colors leading-relaxed text-lg">
                                        {doc.title}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AdmissionRules;