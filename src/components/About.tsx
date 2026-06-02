import { useSeoHead } from '../hooks/useSeoHead';
import { Shield, Smartphone, Code } from 'lucide-react';

export function About() {
  useSeoHead({
    title: 'About DeenHQ | Privacy-First Islamic Utility',
    description: 'DeenHQ is a 100% offline, privacy-first Islamic utility application offering prayer times, a local Quran reader, and a habits tracker without tracking or ads.',
    schemaObj: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "The Mission Behind DeenHQ: A Privacy-First Islamic App",
      "description": "Why we built a 100% offline Islamic utility application.",
      "author": {
        "@type": "Organization",
        "name": "DeenHQ"
      }
    }
  });

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
          About DeenHQ
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Built on the belief that your spiritual journey is deeply personal and should remain completely private. No ads, no tracking, no compromises.
        </p>
      </header>

      <section className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300">
        <p>
          In today's digital age, most utility applications rely heavily on backend servers, third-party analytics, and advertising networks. While this model works for many industries, we believe Islamic utilities—tools used for deeply personal spiritual practices like tracking prayers, reading the Quran, and managing daily habits—should not be monetized through user data.
        </p>
        <p className="mt-4">
          That is why <strong>DeenHQ</strong> was created. Our mission is to provide a beautiful, modern, and highly functional Islamic application that operates entirely on your device.
        </p>
      </section>

      <div className="grid sm:grid-cols-2 gap-8 my-12">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Shield className="w-10 h-10 text-primary mb-6" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Absolute Privacy</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            There is no backend database. We do not collect your location, your habits, or your reading bookmarks. Everything you do inside DeenHQ stays entirely on your device's local storage.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <Smartphone className="w-10 h-10 text-primary mb-6" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">100% Offline</h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            As a Progressive Web App (PWA), DeenHQ caches its core files (including the complete Uthmani Quran dataset) upon first load. You can read, track, and check times entirely offline.
          </p>
        </div>
      </div>

      <section className="prose prose-slate dark:prose-invert prose-lg max-w-none text-slate-700 dark:text-slate-300">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Open Source & Transparent</h2>
        <p>
          DeenHQ is built as a static application using React and Tailwind CSS. Because there are no backend servers, there is absolutely zero risk of your data being silently uploaded to a third party. If you check your browser's network tab, you'll see that DeenHQ only makes requests to load the initial interface, and optionally a manual location search via the open-source OpenStreetMap network.
        </p>
        <p className="mt-4">
          Whether you use our Digital Tasbih, bookmark a Surah, or configure a complex prayer calculation method—it happens right here on your screen.
        </p>
      </section>

      <footer className="pt-8 mt-12 border-t border-slate-200 dark:border-slate-800 text-center">
        <div className="inline-flex items-center gap-2 text-slate-500 font-medium">
          <Code className="w-5 h-5" />
          Built for the community.
        </div>
      </footer>
    </div>
  );
}
