import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export async function schedulePrayerNotifications() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return;
  if (Notification.permission !== 'granted') return;
  if (localStorage.getItem('deenhq_notifications') !== 'true') return;

  try {
    const registration = await navigator.serviceWorker.ready;
    
    // Check if Notification Triggers API is supported
    // @ts-ignore
    if (!('showTrigger' in Notification.prototype)) {
      console.log('Notification Triggers API not supported. Falling back to foreground notifications.');
      return;
    }

    // Get pending notifications and clear them to avoid duplicates
    const notifications = await registration.getNotifications();
    notifications.forEach(n => n.close());

    // Calculate prayer times for the next 2 days
    const savedLat = localStorage.getItem('deenhq_lat');
    const savedLng = localStorage.getItem('deenhq_lng');
    if (!savedLat || !savedLng) return;

    const coordinates = new Coordinates(parseFloat(savedLat), parseFloat(savedLng));

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

    const now = new Date();
    let scheduledCount = 0;

    // Schedule for today and tomorrow
    for (let i = 0; i < 2; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      const pt = new PrayerTimes(coordinates, date, params);
      const prayers = [
        { name: 'Fajr', time: pt.fajr },
        { name: 'Dhuhr', time: pt.dhuhr },
        { name: 'Asr', time: pt.asr },
        { name: 'Maghrib', time: pt.maghrib },
        { name: 'Isha', time: pt.isha }
      ];

      for (const prayer of prayers) {
        if (prayer.time > now) {
          // @ts-ignore
          registration.showNotification(`Time for ${prayer.name}`, {
            body: `It is time to offer ${prayer.name} prayer.`,
            icon: '/pwa-192x192.png',
            badge: '/masked-icon.svg',
            tag: `prayer-${prayer.name}-${date.toDateString()}`,
            // @ts-ignore
            showTrigger: new TimestampTrigger(prayer.time.getTime())
          });
          scheduledCount++;
        }
      }
    }
    console.log(`Successfully scheduled ${scheduledCount} offline prayer notifications.`);
  } catch (err) {
    console.error('Failed to schedule offline notifications:', err);
  }
}
