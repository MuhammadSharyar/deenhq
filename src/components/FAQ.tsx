import { useState } from 'react';
import { useSeoHead } from '../hooks/useSeoHead';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How are the prayer times calculated?",
    answer: "DeenHQ uses the highly respected 'adhan' calculation library. By default, it uses the Muslim World League convention, but you can change this to ISNA, Egyptian General Authority, or others in the Settings. It calculates exact solar positions based on your latitude and longitude."
  },
  {
    question: "What is the difference between Standard and Hanafi Asr?",
    answer: "In the Standard (Shafi, Maliki, Hanbali) method, Asr begins when an object's shadow is equal to its length plus its noon shadow. In the Hanafi method, Asr begins when the shadow is twice its length plus its noon shadow, resulting in a later Asr time."
  },
  {
    question: "Is my location tracked?",
    answer: "Absolutely not. When you click 'Use Automatic Location', your browser fetches your coordinates once and saves them locally to calculate prayer times. We have no servers to send this data to. If you prefer, you can use the manual search in Settings to set a city without granting GPS permissions."
  },
  {
    question: "Does the Quran Reader work offline?",
    answer: "Yes. When you load the app, a highly optimized JSON file containing the complete Uthmani text of the Quran is cached by your browser's Service Worker. You can disconnect from the internet and continue reading and bookmarking seamlessly."
  },
  {
    question: "How does the midnight reset work for Habits?",
    answer: "Instead of running background timers that drain your battery, DeenHQ checks your device's date the moment you open the app. If it detects a new calendar day has started since you last opened it, it resets your daily habit checklist automatically."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Generate dynamic JSON-LD for the FAQPage
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  useSeoHead({
    title: 'Frequently Asked Questions | DeenHQ',
    description: 'Learn how DeenHQ calculates prayer times, protects your privacy, and manages offline data.',
    schemaObj: faqSchema
  });

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-3xl mx-auto space-y-8 min-h-screen">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-50 dark:bg-teal-900/20 text-primary mb-6">
          <HelpCircle className="w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Everything you need to know about DeenHQ's features and privacy.
        </p>
      </header>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`bg-white dark:bg-slate-900 border rounded-2xl overflow-hidden transition-all duration-200 ${
                isOpen ? 'border-primary shadow-sm' : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex items-center justify-between w-full p-6 text-left focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-800/50 transition-colors"
              >
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white pr-4">
                  {faq.question}
                </h3>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                  {faq.answer}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
