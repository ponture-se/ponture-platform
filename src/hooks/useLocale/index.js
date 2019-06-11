import { useContext } from 'react'
import { LocaleContext } from './localeContext'
import en from './locales/en'
import sv from './locales/sv'

const useLocale = () => {
  const [state, setState] = useContext(LocaleContext)

  function setLocale (locale) {
    switch (locale) {
      case 'en':
        setState(state => ({
          ...state,
          appLocale: en,
          currentLang: locale,
          direction: 'ltr'
        }))
        break
      case 'sv':
        setState(state => ({
          ...state,
          appLocale: sv,
          currentLang: locale,
          direction: 'ltr'
        }))
        break
      default:
        setState(state => ({
          ...state,
          appLocale: sv,
          currentLang: locale,
          direction: 'ltr'
        }))
        break
    }
  }

  return {
    setLocale,
    appLocale: state.appLocale ? state.appLocale : undefined,
    direction: state.direction ? state.direction : 'ltr',
    currentLang: state.currentLang ? state.currentLang : 'sv'
  }
}

export default useLocale
