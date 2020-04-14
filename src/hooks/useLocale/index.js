import { useContext } from "react";
import { LocaleContext } from "./localeContext";
import fa from "./locales/fa";
import sv from "./locales/sv";

function createStringFromTemplate(template, variables) {
  return template.replace(new RegExp("{([^{]+)}", "g"), function (
    _unused,
    varName
  ) {
    return variables[varName];
  });
}

const useLocale = () => {
  const [state, setState] = useContext(LocaleContext);

  function setLocale(locale) {
    switch (locale) {
      case "en":
        setState((state) => ({
          ...state,
          appLocale: sv,
          currentLang: locale,
          direction: "ltr",
        }));
        break;
      case "fa":
        setState((state) => ({
          ...state,
          appLocale: fa,
          currentLang: locale,
          direction: "rtl",
        }));
        break;
      case "sv":
        setState((state) => ({
          ...state,
          appLocale: sv,
          currentLang: locale,
          direction: "ltr",
        }));
        break;
      default:
        setState((state) => ({
          ...state,
          appLocale: sv,
          currentLang: locale,
          direction: "ltr",
        }));
        break;
    }
  }
  function t(key) {
    return state.appLocale
      ? state.appLocale[key]
        ? state.appLocale[key]
        : key
      : key;
  }
  function tWithVar(key, variables) {
    return createStringFromTemplate(t(key), variables);
  }
  return {
    setLocale,
    appLocale: state.appLocale ? state.appLocale : undefined,
    t,
    tWithVar,
    direction: state.direction ? state.direction : "ltr",
    currentLang: state.currentLang ? state.currentLang : "sv",
  };
};

export default useLocale;
