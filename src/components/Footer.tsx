import React from 'react';

const Footer: React.FC = () => {
    
    const usersOnSite = 1; 

    return (
        
        
        <footer className="bg-white border-t border-gray-200 pt-8 pb-4 mt-0"> 
            <div className="container mx-auto px-6"> 
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-gray-200 pb-6 text-gray-700">
                    <div className="space-y-3">
                        <p className="text-xl font-bold text-blue-600 mb-2">
                            Условия использования
                        </p>
                        <p className="text-xs leading-relaxed max-w-4xl text-gray-500">
                            Все права защищены. Полное или частичное копирование материалов запрещено, при согласованном использовании материалов сайта необходима ссылка на ресурс.
                        </p>
                    </div>
                    <div className="space-y-3 text-sm md:text-right">
                        
                        <p className="font-semibold text-gray-600">
                            Кол-во пользователей на сайте: 
                            <span className="text-blue-600 font-bold ml-1">{usersOnSite}</span>
                        </p>
                        
                        <p className="text-xs text-gray-500 pt-2">
                            © 2025. Информационно-вычислительный центр 2008.
                        </p>
                    </div>
                </div>
                <div className="text-center pt-3 text-xs text-gray-400">
                    ТТЖТ – филиал РГУПС.
                </div>
                
            </div>
        </footer>
    );
};

export default Footer;