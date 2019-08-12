import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme } from "./hooks";
import "./styles/app.scss";
import Notifies from "./components/Notifies";
import BusinessLoan from "./Pages/BusinessLoan";

const App = () => {
  useTheme("theme1");
  return (
    <StateProvider>
      <LocaleProvider lang={"sv"}>
        <BrowserRouter basename="/app">
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
