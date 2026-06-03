export interface IslamicEvent {
  name: string;
  month: number;
  day: number;
  description?: string;
}

export const ISLAMIC_EVENTS: IslamicEvent[] = [
  { name: 'Islamic New Year', month: 1, day: 1, description: 'Muharram 1st' },
  { name: 'Ashura', month: 1, day: 10, description: '10th of Muharram' },
  { name: 'Ramadan Begins', month: 9, day: 1, description: 'Month of fasting' },
  { name: 'Eid al-Fitr', month: 10, day: 1, description: 'Festival of Breaking the Fast' },
  { name: 'Day of Arafah', month: 12, day: 9, description: 'Hajj day of Arafah' },
  { name: 'Eid al-Adha', month: 12, day: 10, description: 'Festival of Sacrifice' },
];

export function getUpcomingIslamicEvent(): { event: IslamicEvent; daysUntil: number } | null {
  try {
    const parts = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    }).formatToParts(new Date());

    const currentMonthStr = parts.find(p => p.type === 'month')?.value;
    const currentDayStr = parts.find(p => p.type === 'day')?.value;
    
    if (!currentMonthStr || !currentDayStr) return null;

    const currentMonth = parseInt(currentMonthStr, 10);
    const currentDay = parseInt(currentDayStr, 10);

    let closestEvent = null;
    let minDaysUntil = Infinity;

    const upcomingEvents = [...ISLAMIC_EVENTS];
    
    // Add upcoming White Days (13th of each lunar month)
    if (currentDay < 13) {
      upcomingEvents.push({ name: 'White Days (Ayyam al-Bid)', month: currentMonth, day: 13, description: 'Fasting recommended' });
    } else if (currentMonth < 12) {
      upcomingEvents.push({ name: 'White Days (Ayyam al-Bid)', month: currentMonth + 1, day: 13, description: 'Fasting recommended' });
    } else {
      upcomingEvents.push({ name: 'White Days (Ayyam al-Bid)', month: 1, day: 13, description: 'Fasting recommended' });
    }

    for (const event of upcomingEvents) {
      let monthsDiff = event.month - currentMonth;
      if (monthsDiff < 0) {
        // Event is next year
        monthsDiff += 12;
      } else if (monthsDiff === 0 && event.day < currentDay) {
        // Event passed this month, wait until next year
        monthsDiff += 12;
      }
      
      let daysDiff = event.day - currentDay;
      
      // Calculate total approximate days difference
      // We use 29.53 as the average length of a lunar month
      let totalDaysDiff = (monthsDiff * 29.53) + daysDiff;

      // Ensure positive difference
      if (totalDaysDiff < 0) {
        totalDaysDiff += 354.36; // Add a lunar year
      }

      if (totalDaysDiff < minDaysUntil) {
        minDaysUntil = totalDaysDiff;
        closestEvent = event;
      }
    }

    if (closestEvent) {
      return {
        event: closestEvent,
        daysUntil: Math.round(minDaysUntil)
      };
    }
  } catch (e) {
    console.error('Failed to calculate Islamic events:', e);
  }

  return null;
}
