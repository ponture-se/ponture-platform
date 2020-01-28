import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalState } from "hooks";
import { getParameterByName } from "./../utils";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [{ isAuthenticated, lastRole }, dispatch] = useGlobalState();
  return isAuthenticated ? (
    <Route {...rest} />
  ) : (
    <Route
      render={props => (
        <>
          {console.log("props route:", props)}
          <Redirect
            to={{
              pathname:
                lastRole === "agent" ||
                getParameterByName("brokerid", props.location.search)
                  ? "/app/agentlogin"
                  : "/app/login",
              state: { from: props.location }
            }}
          />
        </>
      )}
    />
  );
};
export default PrivateRoute;
