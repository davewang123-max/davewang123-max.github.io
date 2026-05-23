import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export function useLanguage() {
  const { i18n } = useTranslation();

  const currentLang = i18n.language as 'en' | 'zh';
  const isEnglish = currentLang === 'en';

  const toggle = useCallback(() => {
    const next = currentLang === 'en' ? 'zh' : 'en';
    i18n.changeLanguage(next);
    localStorage.setItem('lang', next);
    document.documentElement.lang = next;
  }, [currentLang, i18n]);

  return { currentLang, isEnglish, toggle };
}
