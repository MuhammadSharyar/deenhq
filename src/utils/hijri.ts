export interface HijriDateParts {
  day: number;
  month: number;
  year: number;
  monthName: string;
}

export function getHijriDateParts(date: Date): HijriDateParts {
  // We use the modern Intl API which is built into JavaScript and ultra-lightweight
  const formatterNumeric = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  });
  
  const formatterName = new Intl.DateTimeFormat('en-US-u-ca-islamic', {
    month: 'long'
  });

  const numericParts = formatterNumeric.formatToParts(date);
  const nameParts = formatterName.formatToParts(date);
  
  const day = parseInt(numericParts.find(p => p.type === 'day')?.value || '1', 10);
  const month = parseInt(numericParts.find(p => p.type === 'month')?.value || '1', 10);
  const year = parseInt(numericParts.find(p => p.type === 'year')?.value || '1', 10);
  const monthName = nameParts.find(p => p.type === 'month')?.value || '';

  return { day, month, year, monthName };
}

export function isWhiteDay(hijriDay: number): boolean {
  // Ayyam al-Bidh (White Days) are the 13th, 14th, and 15th of the lunar month
  return hijriDay === 13 || hijriDay === 14 || hijriDay === 15;
}

export function isSunnahFastingDay(date: Date): boolean {
  // Sunnah to fast on Mondays (1) and Thursdays (4)
  const day = date.getDay();
  return day === 1 || day === 4;
}
