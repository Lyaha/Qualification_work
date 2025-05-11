import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import ukTranslation from './locales/uk/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  uk: {
    translation: ukTranslation,
  },
  en: {
    translation: enTranslation,
  },
};

i18n
  .use(new LanguageDetector())
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
