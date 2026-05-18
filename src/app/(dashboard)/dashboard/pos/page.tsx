'use client';

import { useState } from 'react';
import { Card, Button, Input, Switch } from '@/shared/ui';
import { ArrowRightLeft, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import { useAccessStore } from '@/shared/store/useAccessStore';

export default function PosIntegrationPage() {
  const { hasModule } = useAccessStore();
  const [apiKey, setApiKey] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  if (!hasModule('pos-sync')) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-brand-cream">
        <div className="text-center max-w-md">
          <ArrowRightLeft className="h-16 w-16 text-brand-gray/30 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-brand-espresso mb-2">Модуль не увімкнено</h2>
          <p className="text-brand-gray mb-6">Щоб користуватися інтеграціями, увімкніть цей модуль у маркетплейсі.</p>
          <Button variant="brand" onClick={() => window.location.href = '/dashboard/marketplace'}>
            Перейти в Маркетплейс
          </Button>
        </div>
      </div>
    );
  }

  const handleConnect = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsConnected(true);
    }, 1500);
  };

  return (
    <div className="flex h-full flex-col bg-brand-cream p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-espresso flex items-center gap-3">
            <ArrowRightLeft className="h-8 w-8 text-brand-copper" />
            Інтеграція з POS
          </h1>
          <p className="mt-2 text-brand-gray max-w-2xl">
            Підключіть вашу систему обліку для автоматичної синхронізації меню, залишків та замовлень.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Card className="p-6!">
            <h3 className="text-lg font-bold text-brand-espresso mb-4">Poster POS</h3>
            
            {!isConnected ? (
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-lg flex gap-3 text-sm">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>Знайдіть ваш особистий токен (API Key) в налаштуваннях адмін-панелі Poster та вставте його сюди.</p>
                </div>
                
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Input 
                      id="posterToken" 
                      label="API Токен (Poster)" 
                      placeholder="Наприклад: 9845...a1b2c3d4"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                  <Button 
                    variant="brand" 
                    onClick={handleConnect} 
                    disabled={!apiKey || isSyncing}
                  >
                    {isSyncing ? 'Перевірка...' : 'Підключити'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-bold text-green-900">Успішно підключено</h4>
                    <p className="text-sm text-green-700">Остання синхронізація: хвилину тому</p>
                  </div>
                  <Button variant="outline" className="ml-auto border-red-200 text-red-600 hover:bg-red-50" onClick={() => setIsConnected(false)}>
                    Відключити
                  </Button>
                </div>

                <div className="border-t border-brand-gray/10 pt-6 flex flex-col gap-4">
                  <h4 className="font-semibold text-brand-espresso">Налаштування синхронізації</h4>
                  
                  <div className="flex items-center justify-between p-3 border border-brand-gray/10 rounded-lg">
                    <div>
                      <span className="block font-medium text-brand-espresso">Імпорт Меню</span>
                      <span className="text-sm text-brand-gray">Автоматично оновлювати страви з Poster</span>
                    </div>
                    <Switch checked={true} onChange={() => {}} />
                  </div>

                  <div className="flex items-center justify-between p-3 border border-brand-gray/10 rounded-lg">
                    <div>
                      <span className="block font-medium text-brand-espresso">Синхронізація Стопів</span>
                      <span className="text-sm text-brand-gray">Приховувати страви, якщо вони закінчились на складі</span>
                    </div>
                    <Switch checked={true} onChange={() => {}} />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button variant="brand" icon={<Save className="h-4 w-4" />}>
                    Зберегти налаштування
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6! bg-brand-espresso text-brand-cream border-none">
            <h3 className="font-bold text-lg mb-4 text-white">Інструкція</h3>
            <ul className="space-y-4 text-sm text-brand-cream/80 relative">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-bold text-xs">1</span>
                <span>Увійдіть в акаунт Poster POS.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-bold text-xs">2</span>
                <span>Перейдіть у Налаштування → Інтеграції → API.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-bold text-xs">3</span>
                <span>Згенеруйте новий персональний токен.</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-copper text-white font-bold text-xs">4</span>
                <span>Скопіюйте його та вставте в поле зліва.</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}