import fs from 'fs';
import path from 'path';
import https from 'https';

const url = 'https://api.alquran.cloud/v1/quran/quran-uthmani';
const destDir = path.join(process.cwd(), 'public', 'data');
const destFile = path.join(destDir, 'quran.json');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

console.log('Downloading Quran JSON...');
https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const parsed = JSON.parse(data);
    if (parsed.code === 200 && parsed.data) {
      // Simplify the JSON to reduce file size
      const surahs = parsed.data.surahs.map((surah: any) => ({
        number: surah.number,
        name: surah.name,
        englishName: surah.englishName,
        englishNameTranslation: surah.englishNameTranslation,
        revelationType: surah.revelationType,
        ayahs: surah.ayahs.map((ayah: any) => ({
          numberInSurah: ayah.numberInSurah,
          text: ayah.text
        }))
      }));
      
      fs.writeFileSync(destFile, JSON.stringify(surahs));
      console.log(`Successfully saved optimized Quran data to ${destFile}`);
    } else {
      console.error('Failed to parse valid Quran data');
    }
  });

}).on('error', (err) => {
  console.error('Error downloading:', err.message);
});
