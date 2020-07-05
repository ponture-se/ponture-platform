import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import StateProvider from "./hooks/useGlobalState/stateProvider";
import { LocaleProvider } from "./hooks/useLocale/localeContext";
import { LoanProvider } from "./hooks/useLoan";
import { useTheme } from "./hooks";
import "./styles/animate.css";
import "./styles/app.scss";
import { Alert } from "./components/Alert";
import Notifies from "./components/Notifies";
import PrivateRoute from "hoc/PrivateRoute";
import withResolver from "hoc/withResolver";
import AxiosInitializer from "utils/AxiosInitializer";
//
import BusinessLoan from "./Pages/BusinessLoan";
import BusinessLoanOld from "./Pages/BusinessLoanOld";
import BankIdVerification from "./Pages/BankIdVerification";
import CoronaLoan from "./Pages/CoronaLoan";
import Login from "./Pages/Login";
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
                key="login"
                path="/app/login"
                render={(props) => <Login {...props} />}
              />
              <Route
                key="appLoan"
                path="/app/loan1"
                exact
                render={(props) => <BusinessLoanOld {...props} />}
              />
              <Route
                key="appLoan"
                path="/app/loan"
                exact
                render={(props) => (
                  <LoanProvider>
                    <BusinessLoan {...props} headerBottom={true} />
                  </LoanProvider>
                )}
              />
              <Route
                exact
                path="/app/loan/verifybankId/:oppId"
                render={(props) => <BankIdVerification {...props} />}
              />
              <Route
                key="coronaLoan"
                path="/app/coronabrygglan"
                render={(props) => <CoronaLoan {...props} />}
              />
              <PrivateRoute
                key="mainPage"
                path="/app/panel"
                render={(props) => <Main {...props} />}
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
