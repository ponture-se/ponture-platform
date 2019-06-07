import { useContext } from 'react'
import { LocaleContext } from './localeContext'
import en from './locales/en'
import fa from './locales/fa'

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
      case 'fa':
        setState(state => ({
          ...state,
          appLocale: fa,
          currentLang: locale,
          direction: 'rtl'
        }))
        break
      default:
        setState(state => ({
          ...state,
          appLocale: en,
          currentLang: locale,
          direction: 'ltr'
        }))
        break
    }
  }

  return {
    setLocale,
    appLocale: state.appLocale ? state.appLocale : {},
    direction: state.direction ? state.direction : 'rtl',
    currentLang: state.currentLang ? state.currentLang : 'fa'
  }
}

export default useLocale
