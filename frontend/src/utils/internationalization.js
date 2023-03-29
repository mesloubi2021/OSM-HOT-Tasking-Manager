import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { polyfill } from './polyfill';

import { setLocale } from '../store/actions/userPreferences';
import * as config from '../config';

// commented values doesn't have a good amount of strings translated
const supportedLocales = [
  // { value: 'ar', label: 'عربى' },
  { value: 'cs', label: 'Čeština' },
  { value: 'de', label: 'Deutsch' },
  { value: 'el', label: 'Ελληνικά' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fa-IR', label: 'فارسی' },
  { value: 'fr', label: 'Français' },
  { value: 'he', label: 'עברית' },
  { value: 'hu', label: 'Magyar' },
  { value: 'id', label: 'Indonesia' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  // { value: 'mg', label: 'Malagasy' },
  // { value: 'ml', label: 'Malayalam' },
  { value: 'nl', label: 'Nederlands' },
  { value: 'pt', label: 'Português' },
  { value: 'pt-BR', label: 'Português (Brasil)' },
  // { value: 'ru', label: 'Русский язык' },
  { value: 'sv', label: 'Svenska' },
  { value: 'sw', label: 'Kiswahili' },
  // { value: 'tl', label: 'Filipino (Tagalog)' },
  { value: 'tr', label: 'Türkçe' },
  { value: 'uk', label: 'Українська' },
  { value: 'zh', label: '繁體中文' },
];

function getSupportedLocale(locale) {
  if (locale) {
    let filtered = supportedLocales.filter((i) => i.value === locale);
    if (filtered.length) {
      return filtered[0];
    }
    // if we don't have the specific language variation, return the generic locale
    filtered = supportedLocales.filter((i) => i.value === locale.substr(0, 2));
    if (filtered.length) {
      return filtered[0];
    }
  }
  return { value: 'en', label: 'English' };
}

async function getTranslatedMessages(locale) {
  let localeCode = getSupportedLocale(locale);
  let val = localeCode;
  if (localeCode.hasOwnProperty('value')) {
    val = localeCode.value;
  }
  switch (val) {
    case 'ar':
      return await import(/* webpackChunkName: "lang-ar" */ '../locales/ar.json');
    case 'cs':
      return await import(/* webpackChunkName: "lang-cs" */ '../locales/cs.json');
    case 'de':
      return await import(/* webpackChunkName: "lang-de" */ '../locales/de.json');
    case 'el':
      return await import(/* webpackChunkName: "lang-el" */ '../locales/el.json');
    case 'es':
      return await import(/* webpackChunkName: "lang-es" */ '../locales/es.json');
    case 'fa-IR':
      return await import(/* webpackChunkName: "lang-fa_IR" */ '../locales/fa_IR.json');
    case 'fr':
      return await import(/* webpackChunkName: "lang-fr" */ '../locales/fr.json');
    case 'he':
      return await import(/* webpackChunkName: "lang-he" */ '../locales/he.json');
    case 'hu':
      return await import(/* webpackChunkName: "lang-hu" */ '../locales/hu.json');
    case 'id':
      return await import(/* webpackChunkName: "lang-id" */ '../locales/id.json');
    case 'it':
      return await import(/* webpackChunkName: "lang-it" */ '../locales/it.json');
    case 'ja':
      return await import(/* webpackChunkName: "lang-ja" */ '../locales/ja.json');
    case 'ko':
      return await import(/* webpackChunkName: "lang-ko" */ '../locales/ko.json');
    case 'mg':
      return await import(/* webpackChunkName: "lang-mg" */ '../locales/mg.json');
    case 'ml':
      return await import(/* webpackChunkName: "lang-ml" */ '../locales/ml.json');
    case 'nl':
      return await import(/* webpackChunkName: "lang-nl_NL" */ '../locales/nl_NL.json');
    case 'pt':
      return await import(/* webpackChunkName: "lang-pt" */ '../locales/pt.json');
    case 'pt-BR':
      return await import(/* webpackChunkName: "lang-pt_BR" */ '../locales/pt_BR.json');
    case 'ru':
      return await import(/* webpackChunkName: "lang-ru" */ '../locales/ru.json');
    case 'sv':
      return await import(/* webpackChunkName: "lang-sv" */ '../locales/sv.json');
    case 'sw':
      return await import(/* webpackChunkName: "lang-sw" */ '../locales/sw.json');
    case 'tl':
      return await import(/* webpackChunkName: "lang-tl" */ '../locales/tl.json');
    case 'tr':
      return await import(/* webpackChunkName: "lang-tr" */ '../locales/tr.json');
    case 'uk':
      return await import(/* webpackChunkName: "lang-uk" */ '../locales/uk.json');
    case 'zh':
      return await import(/* webpackChunkName: "lang-zh_TW" */ '../locales/zh_TW.json');
    case 'en':
    default:
      return await import(/* webpackChunkName: "lang-en" */ '../locales/en.json');
  }
}

/* textComponent is for orderBy <select>, see codesandbox at https://github.com/facebook/react/issues/15513 */
let ConnectedIntl = (props) => {
  const [i18nMessages, setI18nMessages] = useState(null);

  useEffect(() => {
    if (props.locale === null) {
      props.setLocale(getSupportedLocale(navigator.language).value);
    }
    getTranslatedMessages(props.locale).then((messages) => setI18nMessages(messages));
  }, [props]);

  polyfill(props.locale ? props.locale.substr(0, 2) : config.DEFAULT_LOCALE);

  if (i18nMessages === undefined || i18nMessages === null) {
    return <div />;
  }
  return (
    <IntlProvider
      key={props.locale || config.DEFAULT_LOCALE}
      locale={props.locale ? props.locale.substr(0, 2) : config.DEFAULT_LOCALE}
      textComponent={React.Fragment}
      messages={i18nMessages}
    >
      {props.children}
    </IntlProvider>
  );
};

const mapStateToProps = (state) => ({
  locale: state.preferences.locale,
});

ConnectedIntl = connect(mapStateToProps, { setLocale })(ConnectedIntl);

export { ConnectedIntl, supportedLocales, getSupportedLocale, getTranslatedMessages };
