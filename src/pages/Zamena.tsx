import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const Zamena = () => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/websocket/`;

      try {
        const socket = new WebSocket(wsUrl);
        wsRef.current = socket;

        socket.onopen = () => {
          console.log('WebSocket подключен');
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            switch (data.type) {
              case 'updateStats':
                const onlineCounter = document.getElementById('online-counter');
                if (onlineCounter) {
                  onlineCounter.innerText = data.online;
                }
                break;

              case 'newPost':
                console.log('New Post received:', data.IncompletePost);
                break;

              case 'removePost':
                console.log('Post Removed:', data.ID);
                break;

              default:
                console.log('Неизвестный тип сообщения:', data.type);
            }
          } catch (error) {
            console.error('Ошибка парсинга WebSocket сообщения:', error);
          }
        };

        socket.onerror = (error) => {
          console.error('WebSocket Error:', error);
        };

        socket.onclose = () => {
          console.log('WebSocket отключен. Попытка переподключения через 5 секунд...');
          setTimeout(connectWebSocket, 5000);
        };
      } catch (error) {
        console.error('Ошибка создания WebSocket:', error);
        setTimeout(connectWebSocket, 5000);
      }
    };

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleDownload = () => {
    window.open('https://ttgt.org/images/pdf/zamena.pdf', '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="content-wrapper">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Замены</h1>

          <div className="download-section bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-600">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Скачать приложение с расписанием
                </h2>
                <p className="text-gray-600 mb-4">
                  Получите быстрый доступ к расписанию и заменам на вашем мобильном устройстве
                </p>
                <Button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md flex items-center gap-2 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Скачать приложение
                </Button>
              </div>

              <div className="qr-placeholder bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="w-40 h-40 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-xs">QR-код</div>
                    <div className="text-xs">для скачивания</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pdf-viewer-section bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Расписание замен
            </h2>
            <div className="pdf-container">
              <iframe
                src="https://ttgt.org/images/pdf/zamena.pdf"
                className="w-full h-[800px] border-0 rounded"
                title="Расписание замен"
              />
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>
              Используйте элементы управления встроенного просмотрщика PDF для увеличения и навигации по документу
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Zamena;
