import React from "react";
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
import BusinessLoan from "./Pages/BusinessLoan";
import Login from "./Pages/Login";
import UserLogin from "./Pages/UserLogin";
import MainPage from "./Pages/MainPage";
import NotFound from "./Pages/NotFound";
const Main = withResolver(MainPage);
//
const App = () => {
  useTheme("theme1");
  return (
    <StateProvider>
      <LocaleProvider lang={"sv"}>
        <AxiosInitializer>
          <BrowserRouter>
            <Switch>
              <Route
                key="appLoan"
                path="/app/login"
                render={props => <Login {...props} />}
              />
              <Route
                key="appLoan"
                path="/app/userlogin/:role"
                render={props =>
                  ["admin", "agent"].indexOf(props.match.params.role) > -1 ? (
                    <UserLogin {...props} />
                  ) : (
                    <Route component={NotFound} />
                  )
                }
              />
              <Route
                key="appLoan"
                path="/app/loan"
                render={props => <BusinessLoan {...props} />}
              />
              <PrivateRoute
                key="mainPage"
                path="/app/panel"
                render={props => <Main {...props} />}
              />
              <Redirect exact from="/app" to="/app/loan" />
              <Route component={NotFound} />
            </Switch>
          </BrowserRouter>
          <Notifies />
          <Alert />
        </AxiosInitializer>
      </LocaleProvider>
    </StateProvider>
  );
};

export default App;
