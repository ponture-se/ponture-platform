import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme } from "./hooks";
import "./styles/app.scss";
import Notifies from "./components/Notifies";
//
const BusinessLoan = lazy(() => import("./Pages/BusinessLoan"));
const Login = lazy(() => import("./Pages/Login"));

//
const App = () => {
  useTheme("theme1");
  return (
    <StateProvider>
      <LocaleProvider lang={"sv"}>
        <BrowserRouter basename="/app">
          <Suspense fallback={<div />}>
            <Switch>
              <Route
                key="appLoan"
                path="/login"
                render={props => <Login {...props} />}
              />
              <Route
                key="appLoan"
                path="/loan"
                render={props => <BusinessLoan {...props} />}
              />
              <Redirect from="/" to="/loan" exact />
            </Switch>
          </Suspense>
        </BrowserRouter>
      </LocaleProvider>
      <Notifies />
    </StateProvider>
  );
};

export default App;
