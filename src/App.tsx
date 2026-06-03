import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Tracker } from './components/Tracker';
import { Quran } from './components/Quran';
import { Settings } from './components/Settings';
import { About } from './components/About';
import { FAQ } from './components/FAQ';
import { Qibla } from './components/Qibla';
import { Duas } from './components/Duas';
import { Names } from './components/Names';
import { Hadith } from './components/Hadith';
import { Zakat } from './components/Zakat';
import { More } from './components/More';
import { Journal } from './components/Journal';
import { schedulePrayerNotifications } from './utils/scheduleNotifications';

function App() {
  useEffect(() => {
    schedulePrayerNotifications();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="quran" element={<Quran />} />
          <Route path="settings" element={<Settings />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="qibla" element={<Qibla />} />
          <Route path="duas" element={<Duas />} />
          <Route path="names" element={<Names />} />
          <Route path="hadith" element={<Hadith />} />
          <Route path="zakat" element={<Zakat />} />
          <Route path="more" element={<More />} />
          <Route path="journal" element={<Journal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
