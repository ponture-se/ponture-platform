import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useGlobalState } from "hooks";
const PrivateRoute = ({ component: Component, ...rest }) => {
  const [{ isAuthenticated }, dispatch] = useGlobalState();
  return isAuthenticated ? (
    <Route {...rest} />
  ) : (
    <Route
      render={props => (
        <Redirect
          to={{
            pathname: "/app/login",
            state: { from: props.location }
          }}
        />
      )}
    />
  );
};
export default PrivateRoute;
