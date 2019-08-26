import React, { Suspense, lazy } from "react";
import { Switch } from "react-router-dom";
import PrivateRoute from "hoc/PrivateRoute";
//
import "./styles.scss";
import Header from "./header";
const MyApplications = lazy(() => import("../MyApplications")); //
const ViewOffers = lazy(() => import("../ViewOffers")); //

const MainPage = props => {
  return (
    <div className="mainPage">
      <Header />
      <div className="mainPage__content">
        <Suspense fallback={<div />}>
          <Switch>
            <PrivateRoute
              exact
              key="myApplications"
              path="/myApplications"
              render={props => <MyApplications {...props} />}
            />
            <PrivateRoute
              exact
              key="viewOffers"
              path="/viewOffers/:id"
              render={props => <ViewOffers {...props} />}
            />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default MainPage;
