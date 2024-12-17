import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationKO from './locales/ko/translation.json';

const resources = {
  // 한국어 번역 파일
  ko: {
    translation: translationKO,
  },
  // 영어 번역 파일
  en: {
    translation: translationEN,
  },
};

// 언어 변경(로컬 환경에서만 제공)
if (window.location.hostname.includes('localhost')) {
  window.addEventListener('keydown', (event) => {
    if (
      event.ctrlKey &&
      (event.altKey || event.metaKey) &&
      event.key.toLowerCase() === 'k'
    ) {
      event.preventDefault();
      i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko');
    }
  });
}

i18n
  .use(LanguageDetector) // 브라우저 언어 자동 감지
  .use(initReactI18next)
  .init(
    {
      resources,
      lng: 'ko', // 기본 설정 언어
      fallbackLng: 'en', // 번역 파일에서 찾을 수 없는 경우 표시할 언어
      debug: true,
      interpolation: {
        escapeValue: false, // 특수 문자가 escape 처리되지 않도록 설정
      },
    },
    (error) => {
      console.error('[i18n Error]: ', error);
    },
  );

export { i18n as default, translationEN, translationKO };
