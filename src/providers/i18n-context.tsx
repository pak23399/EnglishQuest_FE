import { createContext, useContext } from 'react';
import { I18nProviderProps, Language } from '@/i18n/types';
import { I18N_DEFAULT_LANGUAGE } from '@/i18n/config';

export const initialProps: I18nProviderProps = {
  currenLanguage: I18N_DEFAULT_LANGUAGE,
  changeLanguage: (_: Language) => {},
  isRTL: () => false,
};

export const TranslationsContext = createContext<I18nProviderProps>(initialProps);

export const useLanguage = () => useContext(TranslationsContext);
