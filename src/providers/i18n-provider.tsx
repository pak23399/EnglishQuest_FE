import {
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  I18N_CONFIG_KEY,
  I18N_DEFAULT_LANGUAGE,
  I18N_LANGUAGES,
} from '@/i18n/config';
import { type Language, type LanguageCode } from '@/i18n/types';
import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import { IntlProvider } from 'react-intl';
import { getData, setData } from '@/lib/storage';
import { TranslationsContext } from './i18n-context';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/de';
import '@formatjs/intl-relativetimeformat/locale-data/es';
import '@formatjs/intl-relativetimeformat/locale-data/fr';
import '@formatjs/intl-relativetimeformat/locale-data/ja';
import '@formatjs/intl-relativetimeformat/locale-data/zh';

const getInitialLanguageCode = (): LanguageCode => {
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');

  // Check if langParam matches a supported language in I18N_LANGUAGES
  if (langParam) {
    const matchedLanguage = I18N_LANGUAGES.find(
      (lang) => lang.code === langParam,
    );
    if (matchedLanguage) {
      setData(I18N_CONFIG_KEY, matchedLanguage);
      return matchedLanguage.code;
    }
  }

  const storedLanguage = getData(I18N_CONFIG_KEY) as Language | undefined;
  return storedLanguage?.code ?? I18N_DEFAULT_LANGUAGE.code;
};

const I18nProvider = ({ children }: PropsWithChildren) => {
  const [currentLanguageCode, setCurrentLanguageCode] = useState<LanguageCode>(
    getInitialLanguageCode()
  );

  const currenLanguage = I18N_LANGUAGES.find(l => l.code === currentLanguageCode) || I18N_DEFAULT_LANGUAGE;

  const changeLanguage = (language: Language) => {
    setData(I18N_CONFIG_KEY, language);
    setCurrentLanguageCode(language.code);
  };

  useEffect(() => {
    document.documentElement.setAttribute('dir', currenLanguage.direction);
  }, [currenLanguage]);

  const isRTL = () => {
    return currenLanguage.direction === 'rtl';
  };



  return (
    <TranslationsContext.Provider
      value={{
        isRTL,
        currenLanguage,
        changeLanguage,
      }}
    >
      <IntlProvider
        messages={currenLanguage.messages}
        locale={currenLanguage.code}
        defaultLocale={I18N_DEFAULT_LANGUAGE.code}
      >
        <RadixDirectionProvider dir={currenLanguage.direction}>
          {children}
        </RadixDirectionProvider>
      </IntlProvider>
    </TranslationsContext.Provider>
  );
};

export { I18nProvider };
