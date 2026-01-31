import { useState, useEffect } from 'react';
import { translations } from '../translations';
import storage from '../utils/storage';

export const useLanguage = () => {
  const [language, setLanguageState] = useState(storage.getLanguage());
  const [t, setTranslations] = useState(translations[language].ui);

  useEffect(() => {
    const currentTranslations = translations[language]?.ui || translations.en.ui;
    setTranslations(currentTranslations);
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
      storage.setLanguage(lang);
    }
  };

  return {
    language,
    setLanguage,
    t
  };
};

export default useLanguage;
