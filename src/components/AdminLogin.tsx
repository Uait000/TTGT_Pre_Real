import { useState } from 'react';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; // Предполагаю, что вы хотите использовать useToast для уведомлений

// --- ИЗМЕНЕНИЕ №1: Определяем, какие пропсы компонент принимает ---
interface AdminLoginProps {
  onSuccess: () => void;
}

// --- ИЗМЕНЕНИЕ №2: Принимаем onSuccess как пропс ---
export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [second_name, setsecond_name] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast(); // Используем хук для уведомлений

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authApi.login({ second_name, password });

      if (data.token) {
        authApi.setToken(data.token);
        toast({ // Показываем уведомление об успехе
          title: 'Успешно',
          description: 'Вы вошли в систему.',
        });
        // --- ИЗМЕНЕНИЕ №3: Вызываем функцию родителя, чтобы сообщить об успехе ---
        onSuccess();
      } else {
        throw new Error('Токен не получен');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      setError(errorMessage);
      toast({ // Показываем уведомление об ошибке
        title: 'Ошибка входа',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Компонент теперь отображает ТОЛЬКО форму входа.
  // Логика "что показать после входа" теперь находится в родительском компоненте AdminPanel.
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Вход в админ-панель</CardTitle>
        <CardDescription>Введите фамилию и пароль для входа</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="second_name">Фамилия</Label>
            <Input
              id="second_name"
              type="text"
              value={second_name}
              onChange={(e) => setsecond_name(e.target.value)}
              required
              placeholder="Введите фамилию"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Введите пароль"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Вход...' : 'Войти'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};