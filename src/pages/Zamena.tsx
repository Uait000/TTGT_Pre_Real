import { useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import SidebarCards from '@/components/SidebarCards';
import { Button } from '@/components/ui/button';
import { Download, QrCode, FileWarning, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion'; 

const Zamena = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
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
              case 'updateStats':
                const onlineCounter = document.getElementById('online-counter');
                if (onlineCounter) onlineCounter.innerText = data.online;
                break;
              case 'newPost':
                console.log('New Post received:', data.IncompletePost);
                if (iframeRef.current) {
                  console.log('Обновление PDF...');
                  iframeRef.current.src = `https://ttgt.org/images/pdf/zamena.pdf?cachebust=${new Date().getTime()}`;
                }
                break;
              case 'removePost':
                console.log('Post Removed:', data.ID);
                break;
              default:
                console.log('Неизвестный тип сообщения:', data.type);
            }
          } catch (error) { console.error('Ошибка парсинга WebSocket:', error); }
        };
        socket.onerror = (error) => console.error('WebSocket Error:', error);
        socket.onclose = () => {
          console.log('WebSocket отключен. Переподключение через 5 сек...');
          setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        console.error('Ошибка создания WebSocket:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };
    connectWebSocket();
    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []); 

  const handleDownload = () => {
    window.open('https://ttgt.org/images/pdf/zamena.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 min-h-screen central-content-area">
          <div className="px-4 md:px-6 py-8 md:py-12">
            
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

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative overflow-hidden bg-gradient-to-br from-primary to-blue-700 dark:from-primary dark:to-blue-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/10 rounded-full filter blur-2xl opacity-50" />
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Скачать приложение с расписанием
                  </h2>
                  <p className="text-blue-100 mb-5">
                    Получите быстрый доступ к расписанию и заменам на вашем мобильном устройстве.
                  </p>
                  <Button
                    onClick={handleDownload}
                    className="bg-white/90 text-primary hover:bg-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg text-base font-semibold"
                  >
                    <Download className="w-5 h-5" />
                    Скачать приложение
                  </Button>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-inner">
                  <div className="w-32 h-32 flex flex-col items-center justify-center text-center text-gray-700">
                    <QrCode className="w-16 h-16 text-primary" />
                    <div className="text-xs mt-2 font-medium">QR-код</div>
                    <div className="text-xs">для скачивания</div>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card rounded-2xl shadow-lg border border-border p-4 md:p-6"
            >
              <div className="pdf-container border-4 border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-inner bg-white">
                <iframe
                  ref={iframeRef} 
                  id="zamena-pdf-iframe"
                  src="https://ttgt.org/images/pdf/zamena.pdf#toolbar=0&navpanes=0&view=fitH"
                  className="w-full h-[800px] border-0" 
                  title="Расписание замен"
                />
              </div>
              <div className="flex items-center gap-3 bg-secondary dark:bg-gray-800 text-muted-foreground border border-border rounded-lg p-3 mt-4 text-xs">
                <FileWarning className="w-5 h-5 text-primary flex-shrink-0" />
                <p>Документ отображается в режиме реального времени. При обновлении замен на сервере, он автоматически обновится у вас на странице.</p>
              </div>
            </motion.div>

          </div>
        </main>
        <aside className="fixed-right-panel hidden lg:block">
          <div className="p-6">
            <SidebarCards />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Zamena;