// src/components/Ticker.tsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Marquee from 'react-fast-marquee';
import { Megaphone, Calendar, Clock, Users, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { fetchPublicTickerSettings } from '@/api/tickerApi';

export const Ticker: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['ticker'],
    queryFn: fetchPublicTickerSettings,
    refetchInterval: 1000 * 60 * 2, // Обновлять каждые 2 минуты
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  // Защита от дублирования
  React.useEffect(() => {
    const existingTickers = document.querySelectorAll('[data-ticker-unique]');
    if (existingTickers.length > 0) {
      console.log('🚫 Duplicate ticker detected, skipping render');
      return;
    }
  }, []);

  console.log('🎯 Ticker state:', { 
    data, 
    isLoading, 
    isError,
    shouldShow: data && data.is_enabled && data.text,
    hasLink: data?.link,
    linkText: data?.link_text,
    format: data?.format
  });

  // Не показывать если загрузка, ошибка, или тикер выключен
  if (isLoading || isError || !data || !data.is_enabled || !data.text) {
    console.log('🚫 Ticker hidden - conditions:', {
      isLoading, isError, hasData: !!data, isEnabled: data?.is_enabled, hasText: !!data?.text
    });
    return null;
  }

  // Функция для проверки валидности URL
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  console.log('🔄 Ticker: rendering with data:', data);

  return (
    <div 
      data-ticker-unique="true" 
      className="relative bg-gradient-to-r from-orange-500 to-red-500 shadow-lg ticker-highlight"
      style={{
        boxShadow: '0 0 25px rgba(255, 107, 0, 0.7)',
        border: '3px solid #ff8e00',
        animation: 'pulse 2s infinite'
      }}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-yellow-300/20 rounded-full"></div>
        {/* Glowing dots */}
        <div className="absolute top-2 left-1/3 w-3 h-3 bg-yellow-300/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-1/4 w-2 h-2 bg-yellow-300/30 rounded-full animate-pulse delay-300"></div>
      </div>

      <div className="relative z-10">
        <Marquee 
          speed={50} 
          gradient={false} 
          pauseOnHover={true}
          className="py-4" // Увеличил отступ сверху и снизу
        >
          <div className="flex items-center space-x-10 px-8"> {/* Увеличил отступы */}
            {/* Main Icon */}
            <div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-full backdrop-blur-sm shadow-lg">
              <Megaphone className="w-6 h-6 text-white" /> {/* Увеличил иконку */}
            </div>
            
            {/* Announcement Badge - БОЛЬШЕ И ЯРЧЕ */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/90 to-cyan-500/90 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg border border-white/30">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-white uppercase tracking-wider">
                🔥 ВАЖНОЕ ОБЪЯВЛЕНИЕ
              </span>
            </div>

            {/* Content */}
            <div className="flex items-center space-x-8">
              {/* Main Text - СДЕЛАЛ БОЛЬШЕ */}
              <span className="text-xl font-extrabold text-white whitespace-nowrap tracking-wide">
                {data.text}
              </span>

              {/* Icons for date/time/format - ПЕРЕДЕЛАЛ В ЯРКИЕ БЛОКИ */}
              <div className="flex items-center space-x-5">
                {/* DATE BLOCK - ГОЛУБОЙ */}
                {data.date && (
                  <div className="flex items-center space-x-2 bg-gradient-to-br from-sky-400 to-blue-500 px-4 py-2 rounded-lg shadow-lg border-2 border-white/40 transform hover:scale-105 transition-transform duration-200">
                    <Calendar className="w-5 h-5 text-white" /> {/* Увеличил иконку */}
                    <span className="text-base font-bold text-white whitespace-nowrap">
                      {data.date}
                    </span>
                  </div>
                )}
                
                {/* TIME BLOCK - СИНИЙ */}
                {data.time && (
                  <div className="flex items-center space-x-2 bg-gradient-to-br from-blue-500 to-indigo-600 px-4 py-2 rounded-lg shadow-lg border-2 border-white/40 transform hover:scale-105 transition-transform duration-200">
                    <Clock className="w-5 h-5 text-white" /> {/* Увеличил иконку */}
                    <span className="text-base font-bold text-white whitespace-nowrap">
                      {data.time}
                    </span>
                  </div>
                )}
                
                {/* FORMAT BLOCK - ФИОЛЕТОВЫЙ */}
                {data.format && (
                  <div className="flex items-center space-x-2 bg-gradient-to-br from-purple-500 to-violet-600 px-4 py-2 rounded-lg shadow-lg border-2 border-white/40 transform hover:scale-105 transition-transform duration-200">
                    <Users className="w-5 h-5 text-white" /> {/* Увеличил иконку */}
                    <span className="text-base font-bold text-white uppercase tracking-wide">
                      {data.format === "очный" ? "ОЧНЫЙ ФОРМАТ" : "ОНЛАЙН ФОРМАТ"}
                    </span>
                  </div>
                )}

                {/* Link for online format - ЯРКО-ЗЕЛЕНЫЙ */}
                {data.format === "заочный" && data.link && isValidUrl(data.link) && (
                  <a
                    href={data.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 px-5 py-2 rounded-lg shadow-lg border-2 border-white/40 transform hover:scale-105 transition-all duration-200 group animate-pulse-slow"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <LinkIcon className="w-5 h-5 text-white" /> {/* Увеличил иконку */}
                    <span className="text-base font-extrabold text-white whitespace-nowrap">
                      {data.link_text || "ПРИСОЕДИНИТЬСЯ ОНЛАЙН"}
                    </span>
                    <ExternalLink className="w-4 h-4 text-white ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* Separator - СДЕЛАЛ БОЛЬШЕ */}
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-white/60 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-white/40 rounded-full"></div>
              <div className="w-2 h-2 bg-white/30 rounded-full"></div>
            </div>

            {/* Repeat content for seamless loop */}
            <div className="flex items-center space-x-6 opacity-90">
              <span className="text-lg font-bold text-white whitespace-nowrap">
                {data.text}
              </span>
              
              {/* Блок для онлайн формата в повторяющемся контенте */}
              {data.format === "заочный" && data.link && isValidUrl(data.link) && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-green-500/40 to-emerald-500/40 rounded-full backdrop-blur-sm border border-white/30">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                  <span className="text-sm font-bold text-white">ОНЛАЙН ДОСТУП</span>
                </div>
              )}
            </div>
          </div>
        </Marquee>
      </div>

      {/* Shine effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine pointer-events-none"></div>



 

      <style jsx>{`
        @keyframes pulse {
          0% {
            box-shadow: 0 0 25px rgba(255, 107, 0, 0.7);
          }
          50% {
            box-shadow: 0 0 35px rgba(255, 107, 0, 0.9);
          }
          100% {
            box-shadow: 0 0 25px rgba(255, 107, 0, 0.7);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(100%) skewX(-15deg);
          }
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Ticker;