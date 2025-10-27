import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { FileText, School, Car, Home, HeartHandshake, Waves, Download, Banknote } from 'lucide-react';

// ✅ ИСПРАВЛЕНО: Добавлен импорт PDF-файлов из вашего проекта
import Rekvizity from '@/assets/file/rekviz_bank_scheta.pdf';
import Obuchenie from '@/assets/file/2_Kvit_na_oplatu_za_ob.pdf';
import Kursy from '@/assets/file/3_Kvit_na_oplatu_kursov.pdf';
import Avtoshkola from '@/assets/file/4_Kvit_na_oplatu_avtoshkola.pdf';
import Kommunalka from '@/assets/file/6_Kvit_kommun_obshh.pdf';
import Pozhertvovaniya from '@/assets/file/7_Kvit_Dobr_pozertvovaniya.pdf';
import Basseyn from '@/assets/file/8_Kvit_usl_basseyn.pdf';

const PaymentReceipts = () => {
    // ✅ ИСПРАВЛЕНО: Создан массив объектов для удобной работы с данными
    const receiptsData = [
        { title: 'Квитанция на оплату за обучение', file: Obuchenie, icon: School, color: 'from-blue-500 to-indigo-600' },
        { title: 'Квитанция на оплату курсов', file: Kursy, icon: School, color: 'from-sky-500 to-cyan-600' },
        { title: 'Квитанция на оплату автошколы', file: Avtoshkola, icon: Car, color: 'from-emerald-500 to-green-600' },
        { title: 'Квитанция за коммунальные услуги в общежитии', file: Kommunalka, icon: Home, color: 'from-amber-500 to-orange-600' },
        { title: 'Квитанция добровольные пожертвования', file: Pozhertvovaniya, icon: HeartHandshake, color: 'from-rose-500 to-pink-600' },
        { title: 'Квитанция за услуги бассейна', file: Basseyn, icon: Waves, color: 'from-violet-500 to-purple-600' }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            <div className="flex">
                <Sidebar />
                
                <main className="flex-1 min-h-screen">
                    <div className="container mx-auto px-6 py-12">
                        {/* ✅ ИСПРАВЛЕНО: Полностью новый дизайн */}
                        <div className="bg-white rounded-3xl shadow-lg border border-gray-200/80 overflow-hidden">
                            <div className="p-10 md:p-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-b border-gray-200">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-md mb-4">
                                       <Banknote className="w-10 h-10 text-indigo-500" />
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                                        Квитанции на оплату
                                    </h1>
                                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                                        Здесь вы можете скачать актуальные квитанции для оплаты услуг нашего колледжа.
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-1">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Основные реквизиты</h2>
                                    <p className="text-gray-600 mb-6">
                                        Для всех платежей используйте официальные реквизиты колледжа. Вы можете скачать их в виде справки.
                                    </p>
                                    <a
                                      href={Rekvizity}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="group block text-center bg-white rounded-2xl border-2 border-indigo-200 p-6 hover:border-indigo-400 hover:shadow-xl transition-all duration-300"
                                    >
                                        <FileText className="w-12 h-12 text-indigo-500 mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                                        <span className="text-lg font-semibold text-indigo-800">
                                            Справка о реквизитах
                                        </span>
                                        <p className="text-sm text-indigo-600 mt-1">Скачать PDF</p>
                                    </a>
                                </div>

                                <div className="lg:col-span-2">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Готовые квитанции</h2>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {receiptsData.map((receipt) => {
                                            const Icon = receipt.icon;
                                            return (
                                                <a
                                                    key={receipt.title}
                                                    href={receipt.file}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className={`group relative block p-6 rounded-2xl overflow-hidden text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                                                >
                                                    <div className={`absolute inset-0 bg-gradient-to-br ${receipt.color} transition-transform duration-300 group-hover:scale-110`}></div>
                                                    <div className="relative z-10 h-full flex flex-col">
                                                        <div className="flex-1">
                                                            <Icon className="w-10 h-10 mb-3 opacity-80" />
                                                            <h3 className="text-xl font-bold leading-tight">{receipt.title}</h3>
                                                        </div>
                                                        <div className="mt-6 flex items-center justify-end text-sm font-medium opacity-80 group-hover:opacity-100">
                                                            Скачать <Download className="w-4 h-4 ml-2" />
                                                        </div>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                
                <aside className="w-80 bg-white p-6 sticky top-16 h-screen overflow-y-auto hidden xl:block border-l border-gray-200">
                  <SidebarCards />
                </aside>
            </div>
        </div>
    );
};

export default PaymentReceipts;

