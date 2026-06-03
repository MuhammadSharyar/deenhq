import { useState, useEffect } from 'react';
import { get, set, del } from 'idb-keyval';

export function useQuranAudio(surahNumber: number) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const storageKey = `quran_audio_${surahNumber}`;
  const remoteUrl = `https://server8.mp3quran.net/afs/${String(surahNumber).padStart(3, '0')}.mp3`;

  useEffect(() => {
    let urlToRevoke: string | null = null;
    setIsDownloading(false);
    setError(null);

    const checkStorage = async () => {
      try {
        const blob = await get<Blob>(storageKey);
        if (blob) {
          const url = URL.createObjectURL(blob);
          urlToRevoke = url;
          setAudioUrl(url);
          setIsDownloaded(true);
        } else {
          setAudioUrl(remoteUrl);
          setIsDownloaded(false);
        }
      } catch (err) {
        console.error('Failed to check IndexedDB for audio:', err);
        setAudioUrl(remoteUrl);
        setIsDownloaded(false);
      }
    };

    checkStorage();

    return () => {
      if (urlToRevoke) {
        URL.revokeObjectURL(urlToRevoke);
      }
    };
  }, [surahNumber]);

  const downloadAudio = async () => {
    setIsDownloading(true);
    setError(null);
    try {
      const response = await fetch(remoteUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      
      await set(storageKey, blob);
      
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setIsDownloaded(true);
    } catch (err) {
      console.error('Failed to download audio:', err);
      setError('Failed to download audio. Please check your connection.');
    } finally {
      setIsDownloading(false);
    }
  };

  const deleteAudio = async () => {
    try {
      await del(storageKey);
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(remoteUrl);
      setIsDownloaded(false);
    } catch (err) {
      console.error('Failed to delete audio:', err);
    }
  };

  return {
    audioUrl,
    isDownloaded,
    isDownloading,
    error,
    downloadAudio,
    deleteAudio
  };
}
