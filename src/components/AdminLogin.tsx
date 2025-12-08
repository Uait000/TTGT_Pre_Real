import { useState } from 'react';
import { authApi } from '@/api/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast'; 
import { useAuth } from '@/context/AuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [second_name, setSecondName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { refreshAuth } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('🔐 Attempting login...');
      const data = await authApi.login({ second_name, password });

      if (data.token && data.admin) {
        console.log('🔐 Login successful, saving token...');
        // Сохраняем токен
        authApi.setToken(data.token);
        
        // Обновляем контекст авторизации
        await refreshAuth();
        
        toast({ 
          title: 'Успешно',
          description: `Вы вошли в систему как ${data.admin.second_name} ${data.admin.first_name}`,
        });
        
        // Переходим в админ-панель
        onSuccess();
      } else {
        throw new Error('Токен не получен');
      }
    } catch (err) {
      console.error('🔐 Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Ошибка входа';
      setError(errorMessage);
      toast({ 
        title: 'Ошибка входа',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
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
              onChange={(e) => setSecondName(e.target.value)}
              required
              placeholder="Введите фамилию"
              disabled={loading}
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded border border-red-200">
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
}