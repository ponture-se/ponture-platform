import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme, useLocale, useLayout } from "./hooks";
import "./styles/app.scss";
import Notifies from "./components/Notifies";
import BusinessLoan from "./Pages/BusinessLoan";

const App = () => {
  const [layout, setLayout] = useState(
    process.env.REACT_APP_DEFAULT_LAYOUT || "ltr"
  );
  useTheme("theme1");
  useLayout(layout);
  useEffect(() => {
    setLayout("ltr");
  }, []);
  return (
    <StateProvider>
      <LocaleProvider>
        <BrowserRouter>
          <Switch>
            <Route
              key="appLoan"
              path="/loan"
              render={props => <BusinessLoan {...props} />}
            />
            <Redirect from="/" to="/loan" exact />
          </Switch>
        </BrowserRouter>
      </LocaleProvider>
      <Notifies />
    </StateProvider>
  );
};

export default App;
