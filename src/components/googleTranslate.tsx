'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Google Translate initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en', // Default language of your page
          includedLanguages: 'en,fr,es', // Languages you want to support (English, French, Spanish)
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
    };

    return () => {
      document.body.removeChild(script); // Clean up the script when component unmounts
    };
  }, []);

  return <div id="google_translate_element"></div>;
}
