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
                ["agent", "admin"].indexOf(lastRole) > -1 ||
                ["agent", "admin"].indexOf(currentRole) > -1
                  ? "/app/userlogin"
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
