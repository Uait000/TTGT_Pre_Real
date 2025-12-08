// src/hooks/useDeviceDetection.ts
import { useState, useEffect } from 'react';

interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isMacOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isLinux: boolean;
  userAgent: string;
  platform: string;
}

const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isMacOS: false,
    isAndroid: false,
    isWindows: false,
    isLinux: false,
    userAgent: '',
    platform: '',
  });

  useEffect(() => {
    const detectDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const platform = navigator.platform || '';
      
      // iOS detection
      const ios = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      
      // Android detection
      const android = /android/i.test(userAgent);
      
      // macOS detection (not iOS)
      const mac = /Macintosh|MacIntel|MacPPC|Mac68K/.test(platform) && !ios;
      
      // Windows detection
      const windows = /Win32|Win64|Windows|Windows NT|WinCE/.test(platform);
      
      // Linux detection
      const linux = /Linux|X11/.test(platform) && !android;
      
      // Mobile detection
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      setDeviceInfo({
        isMobile: mobile,
        isIOS: ios,
        isMacOS: mac,
        isAndroid: android,
        isWindows: windows,
        isLinux: linux,
        userAgent,
        platform,
      });
    };

    detectDevice();
    
    // Также можно добавить обработчик изменения размера окна
    window.addEventListener('resize', detectDevice);
    
    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);

  return deviceInfo;
};

export default useDeviceDetection;