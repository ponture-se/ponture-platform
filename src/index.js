import "react-app-polyfill/ie11";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
import "core-js/es/map";
import cssVars from "css-vars-ponyfill";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CacheBuster from "./CacheBuster";
import * as serviceWorker from "./serviceWorker";

cssVars({
  preserveStatic: false,
});
ReactDOM.render(
  <CacheBuster>
    {({ loading, isLatestVersion, refreshCacheAndReload }) => {
      if (loading) return null;
      if (!loading && !isLatestVersion) {
        refreshCacheAndReload();
      }
      return <App />;
    }}
  </CacheBuster>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
