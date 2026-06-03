import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..'); // Go up one directory to root

// Constants
const HOST = 'deenhq.com';
const KEY = 'c0617b7b15a64b22a014902b3dfb7b39'; // Generate a random 32 character hex key
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(ROOT_DIR, 'public', 'sitemap.xml');

// Generate the key file required by IndexNow
const keyFilePath = path.join(ROOT_DIR, 'public', `${KEY}.txt`);
fs.writeFileSync(keyFilePath, KEY);
console.log(`Generated IndexNow key file at public/${KEY}.txt`);

// Parse URLs from sitemap.xml
let sitemapContent;
try {
  sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
} catch (error) {
  console.error('Error reading sitemap.xml:', error);
  process.exit(1);
}

// Simple regex to extract URLs from <loc> tags
const urlRegex = /<loc>(.*?)<\/loc>/g;
const urlList = [];
let match;
while ((match = urlRegex.exec(sitemapContent)) !== null) {
  urlList.push(match[1]);
}

if (urlList.length === 0) {
  console.error('No URLs found in sitemap.xml');
  process.exit(1);
}

console.log(`Found ${urlList.length} URLs in sitemap.xml to submit:`);
urlList.forEach(url => console.log(`- ${url}`));

// Prepare IndexNow payload
const payload = {
  host: HOST,
  key: KEY,
  keyLocation: KEY_LOCATION,
  urlList: urlList
};

// Submit to IndexNow API (using Bing's endpoint which propagates to others like Yandex)
async function submitToIndexNow() {
  const endpoint = 'https://api.indexnow.org/indexnow';
  
  try {
    console.log(`\nSubmitting to IndexNow API (${endpoint})...`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Successfully submitted URLs to IndexNow!');
    } else if (response.status === 202) {
       console.log('✅ Successfully submitted URLs to IndexNow (Accepted for processing)!');
    } else {
      console.error(`❌ Failed to submit to IndexNow. Status: ${response.status}`);
      const text = await response.text();
      console.error(`Response: ${text}`);
    }
  } catch (error) {
    console.error('❌ Error submitting to IndexNow:', error);
  }
}

submitToIndexNow();
