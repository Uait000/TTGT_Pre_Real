import { useEffect, useRef, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import { zamenaApi } from '@/api/zamena'; 
import { Button } from '@/components/ui/button';
import { Download, FileWarning, RefreshCw, Loader2, Smartphone, Globe } from 'lucide-react'; 
import { motion } from 'framer-motion'; 

const Zamena = () => {
    const wsRef = useRef<WebSocket | null>(null);
    const iframeRef = useRef<HTMLIFrameElement | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null); 
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isMacOS, setIsMacOS] = useState(false);

    // Функция для определения User Agent
    const detectUserAgent = () => {
        const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
        
        // Проверка на iOS
        const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
        setIsIOS(ios);
        
        // Проверка на macOS (но не iOS)
        const mac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(userAgent) && !ios;
        setIsMacOS(mac);
        
        // Проверка на мобильные устройства
        const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        setIsMobile(mobile);
        
        console.log('User Agent Detection:', {
            userAgent,
            isIOS: ios,
            isMacOS: mac,
            isMobile: mobile,
            shouldHideAPK: (ios || mac)
        });
    };

    const updateIframeSource = (newUrl: string | null) => {
        if (newUrl) {
            const urlWithCachebust = `${newUrl}?cachebust=${new Date().getTime()}#toolbar=0&navpanes=0&view=fitH`;
            if (iframeRef.current) {
                iframeRef.current.src = urlWithCachebust;
            }
        } else {
            if (iframeRef.current) {
                iframeRef.current.src = '';
            }
        }
        setPdfUrl(newUrl);
    };

    const fetchInitialUrl = async () => {
        setLoading(true);
        try {
            const data = await zamenaApi.get(); 
            updateIframeSource(data.url); 
        } catch (error) {
            console.error("Ошибка при получении URL замен:", error);
            updateIframeSource(null); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        detectUserAgent(); // Определяем устройство при загрузке
        fetchInitialUrl(); 
        const connectWebSocket = () => {
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${window.location.host}/websocket/`;

            try {
                const socket = new WebSocket(wsUrl);
                wsRef.current = socket;
                
                socket.onopen = () => console.log('WebSocket подключен');
                
                socket.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        switch (data.type) {
                            case 'newPost':
                            case 'updateFile': 
                                console.log('Обновление PDF через WebSocket: принудительная перезагрузка.');
                                fetchInitialUrl(); 
                                break;
                        }
                    } catch (error) { console.error('Ошибка парсинга WebSocket:', error); }
                };
                
                socket.onerror = (error) => console.error('WebSocket Error:', error);
                socket.onclose = () => {
                    setTimeout(connectWebSocket, 5000);
                };
            } catch (error) {
                setTimeout(connectWebSocket, 5000);
            }
        };
        connectWebSocket();
        
        return () => {
            if (wsRef.current) wsRef.current.close();
        };
    }, []);

    const handleDownload = () => {
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        }
    };

    // Показывать кнопку APK только если не iOS и не macOS
    const shouldShowAPKButton = !isIOS && !isMacOS;

    return (
        <MainLayout>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex justify-between items-center mb-8"
            >
                <h1 className="text-3xl md:text-4xl font-bold text-primary">
                    Замены
                </h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <RefreshCw className="w-4 h-4 text-green-500 animate-spin" style={{ animationDuration: '2s' }} />
                    <span>Обновляется в реальном времени</span>
                </div>
            </motion.div>

            {/* Блок с кнопками приложений */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 dark:from-primary dark:to-blue-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8"
            >
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full filter blur-2xl opacity-50" />
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <Smartphone className="w-7 h-7 text-white" />
                            <h2 className="text-2xl font-bold text-white">
                                Приложение с расписанием
                            </h2>
                        </div>
                        <p className="text-blue-100 mb-6 max-w-2xl">
                            Скачайте наше приложение, чтобы отслеживать замены и расписание в реальном времени на вашем мобильном устройстве.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Кнопка веб-приложения (всегда показывать) */}
                            <Button
                                onClick={() => window.open('https://schedulettgt-static.website.yandexcloud.net/', '_blank')}
                                className="bg-white/90 text-primary hover:bg-white px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm min-w-[180px] justify-center"
                            >
                                <Globe className="w-4 h-4" />
                                Приложение веб
                            </Button>
                            
                            {/* Кнопка APK - показывать только на Android и Windows/Linux */}
                            {shouldShowAPKButton && (
                                <Button
                                    onClick={() => window.open('https://ttgt-api-isxb.onrender.com/schedule/android/download', '_blank')}
                                    className="bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:from-emerald-600 hover:to-green-700 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-sm min-w-[180px] justify-center"
                                >
                                    <Download className="w-4 h-4" />
                                    Скачать APK
                                </Button>
                            )}
                            
                            {/* Для iOS и macOS показываем информационное сообщение */}
                            {(isIOS || isMacOS) && (
                                <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-3 flex items-center gap-2 min-w-[180px]">
                                    <Smartphone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <span className="text-xs text-amber-100">
                                        Для {isIOS ? 'iOS' : 'macOS'} используйте веб-приложение
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Декоративный элемент с информацией об устройстве */}
                    <div className="hidden md:block">
                        <div className="relative">
                            <div className={`w-40 h-40 ${isIOS || isMacOS ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10' : 'bg-gradient-to-br from-white/10 to-white/5'} rounded-2xl backdrop-blur-sm border ${isIOS || isMacOS ? 'border-amber-500/30' : 'border-white/20'} p-4 flex flex-col items-center justify-center`}>
                                <div className={`w-24 h-24 ${isIOS || isMacOS ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10' : 'bg-gradient-to-br from-white/20 to-white/10'} rounded-lg border ${isIOS || isMacOS ? 'border-amber-500/30' : 'border-white/30'} flex items-center justify-center mb-3`}>
                                    {isIOS ? (
                                        <div className="text-center">
                                            <div className="text-white/80 text-2xl mb-1">🍎</div>
                                            <span className="text-white/60 text-xs">iOS</span>
                                        </div>
                                    ) : isMacOS ? (
                                        <div className="text-center">
                                            <div className="text-white/80 text-2xl mb-1">💻</div>
                                            <span className="text-white/60 text-xs">macOS</span>
                                        </div>
                                    ) : (
                                        <Smartphone className="w-12 h-12 text-white/80" />
                                    )}
                                </div>
                                <span className="text-white/80 text-sm font-medium text-center">
                                    {isIOS ? 'Только веб-приложение' : 
                                     isMacOS ? 'Используйте веб-приложение' : 
                                     'Доступно на Android'}
                                </span>
                            </div>
                            {/* Декоративные точки */}
                            <div className={`absolute -top-2 -right-2 w-4 h-4 ${isIOS || isMacOS ? 'bg-amber-400' : 'bg-yellow-400'} rounded-full animate-pulse`}></div>
                            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-500"></div>
                        </div>
                    </div>
                </div>
            </motion.div>
            
            {/* Блок с iframe */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card rounded-2xl shadow-lg border border-border p-4 md:p-6"
            >
                <div className="pdf-container border-4 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-inner bg-white">
                    {loading || !pdfUrl ? (
                        <div className="flex justify-center items-center h-[800px]">
                            {loading ? (
                                <><Loader2 className="h-8 w-8 animate-spin text-primary" /><span className="ml-2 text-muted-foreground">Загрузка расписания...</span></>
                            ) : (
                                <span className="text-xl text-red-500">❌ Расписание не загружено или не найдено на сервере.</span>
                            )}
                        </div>
                    ) : (
                        <iframe
                            ref={iframeRef} 
                            id="zamena-pdf-iframe"
                            src={pdfUrl + '#toolbar=0&navpanes=0&view=fitH'} 
                            className="w-full h-[800px] border-0" 
                            title="Расписание замен"
                        />
                    )}
                </div>
                <div className="flex items-center gap-3 bg-secondary dark:bg-gray-800 text-muted-foreground border border-border rounded-lg p-3 mt-4 text-xs">
                    <FileWarning className="w-5 h-5 text-primary flex-shrink-0" />
                    <p>Документ отображается в режиме реального времени. При обновлении замен на сервере, он автоматически обновится у вас на странице.</p>
                </div>
            </motion.div>
        </MainLayout>
    );
};

export default Zamena;