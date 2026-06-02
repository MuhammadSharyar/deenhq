import { useState, useEffect, useCallback } from 'react';
import { Coordinates, Qibla } from 'adhan';
export function useQibla() {
  const [qiblaBearing, setQiblaBearing] = useState<number>(0);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    const updateQibla = () => {
      const savedLat = localStorage.getItem('deenhq_lat');
      const savedLng = localStorage.getItem('deenhq_lng');
      if (savedLat && savedLng) {
        const coordinates = new Coordinates(parseFloat(savedLat), parseFloat(savedLng));
        const bearing = Qibla(coordinates);
        setQiblaBearing(bearing);
      } else {
        // Fallback to Mecca
        setQiblaBearing(0);
      }
    };

    updateQibla();
    window.addEventListener('deenhq_settings_changed', updateQibla);
    return () => window.removeEventListener('deenhq_settings_changed', updateQibla);
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    let heading = null;
    
    // iOS DeviceOrientationEvent has webkitCompassHeading
    if ('webkitCompassHeading' in event) {
      heading = (event as any).webkitCompassHeading;
    } 
    // Android (absolute)
    else if (event.absolute && event.alpha !== null) {
      heading = 360 - event.alpha;
    }

    if (heading !== null) {
      setDeviceHeading(heading);
    }
  }, []);

  const requestPermission = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        if (permissionState === 'granted') {
          setPermissionGranted(true);
          window.addEventListener('deviceorientation', handleOrientation, true);
        } else {
          setPermissionGranted(false);
        }
      } catch (err) {
        console.error(err);
        setPermissionGranted(false);
      }
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
      window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
      // Fallback for some browsers
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  useEffect(() => {
    if (!window.DeviceOrientationEvent) {
      setIsSupported(false);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
    };
  }, [handleOrientation]);

  return {
    qiblaBearing,
    deviceHeading,
    isSupported,
    permissionGranted,
    requestPermission,
    pointingToQibla: deviceHeading !== null ? Math.abs(deviceHeading - qiblaBearing) < 5 || Math.abs(deviceHeading - qiblaBearing) > 355 : false
  };
}
