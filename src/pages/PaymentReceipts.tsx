// src/pages/PaymentReceipts.tsx
import { useState, useEffect } from 'react';
import MainLayout from '@/components/MainLayout'; 
import { FileText, Download, Banknote } from 'lucide-react';
import { paymentReceiptsApi } from '@/api/payment-receipts';
import type { PaymentReceipt } from '@/types/payment-receipts';
import { BASE_URL } from '@/api/config';
import { iconComponents } from '@/utils/icons';

// Статические файлы (оставляем для обратной совместимости)
import Rekvizity from '@/assets/file/rekviz_bank_scheta.pdf';

const PaymentReceipts = () => {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const data = await paymentReceiptsApi.getAll();
      // Фильтруем только опубликованные квитанции
      const publishedReceipts = data.filter(receipt => receipt.is_published);
      setReceipts(publishedReceipts);
    } catch (error) {
      console.error('Ошибка загрузки квитанций:', error);
      setReceipts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const getFileUrl = (receipt: PaymentReceipt) => {
    if (receipt.files && receipt.files.length > 0) {
      return `${BASE_URL}/files/${receipt.files[0].id}`;
    }
    return receipt.file_url;
  };

  const IconComponent = ({ icon }: { icon: string }) => {
    const Icon = iconComponents[icon as keyof typeof iconComponents] || Banknote;
    return <Icon className="w-10 h-10 mb-3 opacity-80" />;
  };

  return (
    <MainLayout>
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
          {/* Реквизиты (статический блок) */}
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

          {/* Динамические квитанции */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Готовые квитанции</h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              </div>
            ) : receipts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                На данный момент нет доступных квитанций
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {receipts.map((receipt) => (
                  <a
                    key={receipt.id}
                    href={getFileUrl(receipt)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group relative block p-6 rounded-2xl overflow-hidden text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${receipt.gradient} transition-transform duration-300 group-hover:scale-110`}></div>
                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex-1">
                        <IconComponent icon={receipt.icon} />
                        <h3 className="text-xl font-bold leading-tight">{receipt.title}</h3>
                      </div>
                      <div className="mt-6 flex items-center justify-end text-sm font-medium opacity-80 group-hover:opacity-100">
                        Скачать <Download className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PaymentReceipts;