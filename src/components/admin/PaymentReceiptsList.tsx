// src/components/admin/PaymentReceiptsList.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Trash2, 
  FileText,
  Eye,
  EyeOff,
  Banknote,
  Loader2
} from 'lucide-react'; // Убрали Plus из импорта
import { paymentReceiptsApi } from '@/api/payment-receipts';
import type { PaymentReceipt } from '@/types/payment-receipts';
import { BASE_URL } from '@/api/config';
import { iconComponents } from '@/utils/icons';

interface PaymentReceiptsListProps {
  onEdit: (receipt: PaymentReceipt) => void;
  onDelete: (receipt: PaymentReceipt) => void;
  onCreate: () => void;
  refreshTrigger: number;
}

const PaymentReceiptsList = ({ onEdit, onDelete, onCreate, refreshTrigger }: PaymentReceiptsListProps) => {
  const [receipts, setReceipts] = useState<PaymentReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReceipts = async () => {
    try {
      setIsLoading(true);
      const data = await paymentReceiptsApi.getAll();
      setReceipts(data);
    } catch (error) {
      console.error('Ошибка загрузки квитанций:', error);
      setReceipts([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [refreshTrigger]);

  const getFileUrl = (receipt: PaymentReceipt) => {
    if (receipt.files && receipt.files.length > 0) {
      return `${BASE_URL}/files/${receipt.files[0].id}`;
    }
    return receipt.file_url;
  };

  const getFileName = (receipt: PaymentReceipt) => {
    if (receipt.files && receipt.files.length > 0) {
      return receipt.files[0].name;
    }
    return receipt.file_name || 'PDF файл';
  };

  const IconPreview = ({ icon, gradient }: { icon: string; gradient: string }) => {
    const IconComponent = iconComponents[icon as keyof typeof iconComponents] || Banknote;
    return (
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white`}>
        <IconComponent size={16} />
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats - УБРАЛИ КНОПКУ ОТСЮДА */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-1">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{receipts.length}</span> квитанций
          </div>
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">
              {receipts.filter(d => d.is_published).length}
            </span> опубликовано
          </div>
        </div>
        
        {/* УБРАЛИ КНОПКУ "Добавить квитанцию" - она теперь только в AdminPanel */}
      </div>

      {/* Receipts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {receipts.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Card className="text-center py-8">
              <CardContent>
                <div className="text-gray-500 text-sm mb-3">
                  Нет квитанций
                </div>
                <Button onClick={onCreate} variant="outline" size="sm">
                  Добавить первую квитанцию
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          receipts.map((receipt) => (
            <Card key={receipt.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  {/* Receipt Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <IconPreview icon={receipt.icon} gradient={receipt.gradient} />
                      <div className="flex items-center space-x-1 text-xs">
                        {receipt.is_published ? (
                          <div className="flex items-center space-x-1 text-green-600">
                            <Eye size={12} />
                            <span>Опубликована</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1 text-gray-500">
                            <EyeOff size={12} />
                            <span>Черновик</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
                      {receipt.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      <FileText size={12} />
                      <span className="max-w-xs truncate">{getFileName(receipt)}</span>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-500">
                      Обновлено: {new Date(receipt.updated_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(receipt)}
                      className="h-8 w-8 p-0"
                      title="Редактировать"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(receipt)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Удалить"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentReceiptsList;