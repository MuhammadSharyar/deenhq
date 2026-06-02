import { useState, useEffect } from 'react';

export function useSettings() {
  const [madhab, setMadhab] = useState('Standard');
  const [method, setMethod] = useState('MuslimWorldLeague');

  useEffect(() => {
    const savedMadhab = localStorage.getItem('deenhq_madhab') || 'Standard';
    const savedMethod = localStorage.getItem('deenhq_method') || 'MuslimWorldLeague';
    setMadhab(savedMadhab);
    setMethod(savedMethod);
  }, []);

  const updateMadhab = (newMadhab: string) => {
    setMadhab(newMadhab);
    localStorage.setItem('deenhq_madhab', newMadhab);
    window.dispatchEvent(new Event('deenhq_settings_changed'));
  };

  const updateMethod = (newMethod: string) => {
    setMethod(newMethod);
    localStorage.setItem('deenhq_method', newMethod);
    window.dispatchEvent(new Event('deenhq_settings_changed'));
  };

  const setLocation = (lat: number, lng: number, name: string) => {
    localStorage.setItem('deenhq_lat', lat.toString());
    localStorage.setItem('deenhq_lng', lng.toString());
    localStorage.setItem('deenhq_location_name', name);
    window.dispatchEvent(new Event('deenhq_settings_changed'));
  };

  const triggerAutoLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation(pos.coords.latitude, pos.coords.longitude, 'Current Location');
        },
        (error) => {
          console.error('Geolocation failed', error);
          alert('Unable to fetch location automatically. Please check your browser permissions or use manual search.');
        }
      );
    }
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This will reset your habits, bookmarks, and settings.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return {
    madhab,
    updateMadhab,
    method,
    updateMethod,
    setLocation,
    triggerAutoLocation,
    clearAllData
  };
}
