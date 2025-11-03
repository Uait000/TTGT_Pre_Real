

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react'; 

const VK_LINK = "https://vk.com/ttjt_official";

const ContactStrip: React.FC = () => {
    return (
        <div className="mb-6"> 
            <div 
                
                className={`bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 
                            rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]`}
            > 
                
                <div className="flex justify-between items-center h-full text-sm font-semibold">
                    <div className="flex space-x-6 items-center flex-wrap">
                        
                        <span className="flex items-center space-x-2">
                            <MapPin className="w-5 h-5" />
                            <span className="hidden sm:inline">г.Тихорецк, ул.Красноармейская, 57</span>
                        </span>
                        
                        <span className="flex items-center space-x-2">
                            <Phone className="w-5 h-5" />
                            <a href="tel:+78619662003" className="hover:underline transition-colors">+7(86196)6-20-03</a>
                        </span>
                        
                        <span className="flex items-center space-x-2">
                            <Mail className="w-5 h-5" />
                            <a href="mailto:ttgt-rgups@yandex.ru" className="hover:underline transition-colors hidden md:inline">ttgt-rgups@yandex.ru</a>
                        </span>
                    </div>

                    <a 
                        href={VK_LINK} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Перейти на страницу ВКонтакте"
                        
                        className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center 
                                   font-bold text-xl transition-transform duration-300 hover:scale-110 hover:shadow-xl ml-4 flex-shrink-0"
                    >
                        VK
                    </a>
                </div>
            </div>
        </div>
    );
};


export default ContactStrip;