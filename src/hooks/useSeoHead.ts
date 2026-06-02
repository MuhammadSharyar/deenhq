import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description: string;
  schemaObj?: Record<string, any>;
}

export function useSeoHead({ title, description, schemaObj }: SeoProps) {
  useEffect(() => {
    document.title = title;
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title);

    const schemaScriptId = 'deenhq-schema';
    let script = document.getElementById(schemaScriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    const finalSchema = schemaObj || {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": title,
      "description": description,
      "url": "https://deenhq.com",
      "applicationCategory": "Utility",
      "operatingSystem": "All"
    };

    script.textContent = JSON.stringify(finalSchema);

  }, [title, description, schemaObj]);
}
