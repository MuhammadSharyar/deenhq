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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quran" element={<Quran />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/qibla" element={<Qibla />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/names" element={<Names />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
