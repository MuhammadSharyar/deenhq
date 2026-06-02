import { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export interface PrayerData {
  times: PrayerTimes | null;
  nextPrayer: string | null;
  countdown: string | null;
  locationName: string;
}

export function usePrayerTimes() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationName, setLocationName] = useState<string>('Detecting Location...');
  
  const [data, setData] = useState<PrayerData>({
    times: null,
    nextPrayer: null,
    countdown: null,
    locationName: 'Detecting Location...'
  });

  // Fetch location on mount and on settings change
  useEffect(() => {
    const initializeLocation = () => {
      const savedLat = localStorage.getItem('deenhq_lat');
      const savedLng = localStorage.getItem('deenhq_lng');
      const savedName = localStorage.getItem('deenhq_location_name');

      if (savedLat && savedLng) {
        setCoords({ lat: parseFloat(savedLat), lng: parseFloat(savedLng) });
        setLocationName(savedName || 'Saved Location');
      } else {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const newLat = pos.coords.latitude;
              const newLng = pos.coords.longitude;
              localStorage.setItem('deenhq_lat', newLat.toString());
              localStorage.setItem('deenhq_lng', newLng.toString());
              setCoords({ lat: newLat, lng: newLng });
              setLocationName('Current Location');
            },
            (error) => {
              console.warn('Geolocation denied or failed. Using Mecca as fallback.', error);
              setCoords({ lat: 21.4225, lng: 39.8262 });
              setLocationName('Mecca (Fallback)');
            }
          );
        } else {
          setCoords({ lat: 21.4225, lng: 39.8262 });
          setLocationName('Mecca (Fallback)');
        }
      }
    };

    initializeLocation();
    
    // Listen for settings changes
    const handleSettingsChange = () => initializeLocation();
    window.addEventListener('deenhq_settings_changed', handleSettingsChange);
    
    return () => window.removeEventListener('deenhq_settings_changed', handleSettingsChange);
  }, []);

  // Update calculations whenever coords change
  useEffect(() => {
    if (!coords) return;

    const coordinates = new Coordinates(coords.lat, coords.lng);

    const savedMethod = localStorage.getItem('deenhq_method') || 'MuslimWorldLeague';
    let params;
    switch (savedMethod) {
      case 'ISNA': params = CalculationMethod.NorthAmerica(); break;
      case 'Egyptian': params = CalculationMethod.Egyptian(); break;
      case 'UmmAlQura': params = CalculationMethod.UmmAlQura(); break;
      case 'Karachi': params = CalculationMethod.Karachi(); break;
      default: params = CalculationMethod.MuslimWorldLeague(); break;
    }
    
    const savedMadhab = localStorage.getItem('deenhq_madhab');
    if (savedMadhab === 'Hanafi') {
      params.madhab = Madhab.Hanafi;
    } else {
      params.madhab = Madhab.Shafi;
    }

    const updateCountdown = () => {
      const date = new Date();
      const prayerTimes = new PrayerTimes(coordinates, date, params);
      
      let next = prayerTimes.nextPrayer();
      let nextTime = prayerTimes.timeForPrayer(next);
      
      // If all prayers for today have passed, countdown to tomorrow's Fajr
      if (next === 'none' || !nextTime) {
        const tomorrow = new Date(date);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowTimes = new PrayerTimes(coordinates, tomorrow, params);
        next = 'fajr';
        nextTime = tomorrowTimes.fajr;
      }
      
      if (nextTime) {
        const diff = nextTime.getTime() - date.getTime();
        if (diff > 0) {
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setData({
            times: prayerTimes, // Keep today's times for the daily schedule display
            nextPrayer: next,
            countdown: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            locationName,
          });
          return;
        }
      }
      setData({ times: prayerTimes, nextPrayer: 'none', countdown: '00:00:00', locationName });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [coords, locationName]);

  return data;
}
