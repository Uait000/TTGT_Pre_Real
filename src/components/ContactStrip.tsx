import React from 'react';
import { MapPin, Phone, Mail, Eye } from 'lucide-react'; 
import { useAccessibility } from '../context/AccessibilityContext'; 

const VK_LINK = "https://vk.com/ttjt_official";

const ContactStrip: React.FC = () => {
    const { togglePanel } = useAccessibility(); 

    return (
        <div className="mb-6"> 
            <div 
                
                className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 
                            rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
            > 
                
                <div className="flex flex-col sm:flex-row justify-between items-center h-full text-sm font-semibold gap-4 sm:gap-0">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:space-x-6 sm:gap-0">
                        
                        <span className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span className="sm:inline">г.Тихорецк, ул.Красноармейская, 57</span>
                        </span>
                        
                        <span className="flex items-center space-x-2">
                            <Phone className="w-5 h-5" />
                            <a href="tel:+78619662003" className="hover:underline transition-colors">+7(86196)6-20-03</a>
                        </span>
                        
                        <span className="flex items-center space-x-2">
                            <Mail className="w-5 h-5" />
                            <a href="mailto:ttgt-rgups@yandex.ru" className="hover:underline transition-colors">ttgt-rgups@yandex.ru</a>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center sm:ml-4">
                        <a 
                            href={VK_LINK} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            aria-label="Перейти на страницу ВКонтакте"
                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center 
                                        font-bold text-xl transition-transform duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                        >
                            VK
                        </a>
                        
                        {/* 3. "Глазик" с onClick={togglePanel} */}
                        <button
                            onClick={togglePanel}
                            aria-label="Версия для слабовидящих"
                            title="Версия для слабовидящих"
                            className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center 
                                        transition-transform duration-300 hover:scale-110 hover:shadow-xl flex-shrink-0"
                        >
                            <Eye className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactStrip;