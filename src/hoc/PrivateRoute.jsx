import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalState } from "hooks";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [
    { isAuthenticated, lastRole, currentRole },
    dispatch
  ] = useGlobalState();
  return isAuthenticated ? (
    <Route {...rest} />
  ) : (
    <Route
      render={props => (
        <>
          <Redirect
            to={{
              pathname:
                lastRole === "agent" || currentRole === "agent"
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
