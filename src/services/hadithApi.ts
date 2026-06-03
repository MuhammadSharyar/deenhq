export interface HadithInfo {
  metadata: {
    name: string;
    sections: Record<string, string>;
    section_details: Record<string, {
      hadithnumber_first: number;
      hadithnumber_last: number;
      arabicnumber_first: number;
      arabicnumber_last: number;
    }>;
  };
}

export interface HadithItem {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades?: { name: string; grade: string }[];
  reference?: { book: number; hadith: number };
}

export interface HadithSectionResponse {
  metadata: {
    name: string;
    section: Record<string, string>;
    section_detail: Record<string, {
      hadithnumber_first: number;
      hadithnumber_last: number;
      arabicnumber_first: number;
      arabicnumber_last: number;
    }>;
  };
  hadiths: HadithItem[];
}

const BASE_URL = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1';

export async function fetchAllBooksInfo(): Promise<Record<string, HadithInfo>> {
  const response = await fetch(`${BASE_URL}/info.json`);
  if (!response.ok) throw new Error('Failed to fetch books info');
  return response.json();
}

export async function fetchHadithSection(edition: string, sectionId: string): Promise<HadithSectionResponse> {
  const response = await fetch(`${BASE_URL}/editions/${edition}/sections/${sectionId}.min.json`);
  if (!response.ok) throw new Error('Failed to fetch hadith section');
  return response.json();
}

export const SUPPORTED_BOOKS = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', author: 'Imam al-Bukhari' },
  { id: 'muslim', name: 'Sahih Muslim', author: 'Imam Muslim' },
  { id: 'abudawud', name: 'Sunan Abu Dawud', author: 'Imam Abu Dawud' },
  { id: 'tirmidhi', name: 'Jami` at-Tirmidhi', author: 'Imam at-Tirmidhi' },
  { id: 'nasai', name: 'Sunan an-Nasai', author: 'Imam an-Nasai' },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', author: 'Imam Ibn Majah' }
];
