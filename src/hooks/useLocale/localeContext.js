import React, { useState } from "react";
import useLayout from "./../useLayout";
import sv from "./locales/sv";
import fa from "./locales/fa";
//
const LocaleContext = React.createContext([{}, () => {}]);
//
const langs = {
  fa: {
    appLocale: fa,
    currentLang: "fa",
    direction: "rtl"
  },
  sv: {
    appLocale: sv,
    currentLang: "sv",
    direction: "ltr"
  }
};

const LocaleProvider = props => {
  const l = langs[props.lang];
  useLayout(l ? l.direction : langs["sv"].direction);

  const [state, setState] = useState(() => {
    return l ? l : langs["sv"];
  });
  return (
    <LocaleContext.Provider value={[state, setState]}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export { LocaleContext, LocaleProvider };
