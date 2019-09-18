import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "hoc/PrivateRoute";
import retry from "utils/retryLazyLoad";
//
import "./styles.scss";
import Header from "./header";
const MyApplications = lazy(() => retry(() => import("../MyApplications")));
const ViewOffers = lazy(() => retry(() => import("../ViewOffers")));

const MainPage = props => {
  return (
    <div className="mainPage">
      <Header />
      <div className="mainPage__content">
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute
              key="myApplications"
              path="/app/panel/myApplications"
              render={props => <MyApplications {...props} />}
            />
            <PrivateRoute
              key="viewOffers"
              path="/app/panel/viewOffers/:id"
              render={props => <ViewOffers {...props} />}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;
