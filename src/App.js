import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { useTheme } from "./hooks";
import "./styles/app.scss";
import { Alert } from "./components/Alert";
import Notifies from "./components/Notifies";
import PrivateRoute from "hoc/PrivateRoute";
import withResolver from "hoc/withResolver";
import AxiosInitializer from "utils/AxiosInitializer";
//
const BusinessLoan = lazy(() => import("./Pages/BusinessLoan"));
const Login = lazy(() => import("./Pages/Login"));
const MainPage = lazy(() => import("./Pages/MainPage"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Main = withResolver(MainPage);
//
const App = () => {
  useTheme("theme1");
  return (
    <StateProvider>
      <AxiosInitializer>
        <LocaleProvider lang={"sv"}>
          <BrowserRouter>
            <Suspense fallback={<div />}>
              <Switch>
                <Route
                  key="appLoan"
                  path="/app/login"
                  render={props => <Login {...props} />}
                />
                {/* <Route
                  key="appLoan"
                  path="/app/loan"
                  render={props => <BusinessLoan {...props} />}
                /> */}
                <PrivateRoute
                  key="mainPage"
                  path="/app/panel"
                  render={props => <Main {...props} />}
                />
                <Redirect exact from="/app" to="/app/login" />
                {/* <Redirect exact from="/app" to="/app/loan" /> */}
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </LocaleProvider>
        <Notifies />
        <Alert />
      </AxiosInitializer>
    </StateProvider>
  );
};

export default App;
