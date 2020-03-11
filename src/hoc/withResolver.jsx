import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect } from "react-router-dom";
import { customerLogin } from "api/main-api";
import { useGlobalState, useLocale } from "hooks";
import { Wrong } from "components/Commons/ErrorsComponent";
import NotFoundUser from "Pages/NotFoundUser";

//
const withResolver = WrappedComponent => {
  return withRouter(props => {
    const [
      { verifyInfo, userInfo, lastRole, isAuthenticated },
      dispatch
    ] = useGlobalState();
    let [{ currentRole }] = useGlobalState();
    const { t } = useLocale();
    const token = Cookies.get("@ponture-customer-portal/token");
    const [loading, toggleLoading] = useState(token && userInfo ? false : true);
    const [error, setError] = useState();
    function refresh() {
      window.location.reload();
    }

    useEffect(() => {
      if (!currentRole || currentRole === "customer") {
        //If token or userInfo missed after bankId process before getting into component do login again
        if (!token || !userInfo) {
          //creating object to pass to API for further authentications
          const obj = {
            id: verifyInfo.id,
            errors: verifyInfo.error,
            progressStatus: verifyInfo.progressStatus,
            signature: verifyInfo.signature,
            //verifyInfo: bankId info
            //userInfo: User information that coming from ponture API after successful user authentication
            userInfo: verifyInfo.userInfo,
            ocspResponse: verifyInfo.ocspResponse,
            LookupPersonAddressStatus: verifyInfo.LookupPersonAddressStatus,
            status: verifyInfo.status
          };
          customerLogin()
            .onOk(result => {
              if (window.analytics) {
                window.analytics.identify(verifyInfo.userInfo.personalNumber, {
                  name: verifyInfo.userInfo.name,
                  email: verifyInfo.userInfo.email,
                  plan: verifyInfo.userInfo.plan,
                  logins: verifyInfo.userInfo.logins
                });
              }
              //After verifying user with bankId or userpassLogin API
              dispatch({
                type: "SET_USER_INFO",
                payload: {
                  userInfo: result,
                  currentRole: "customer",
                  isAuthenticated: true
                }
              });
              toggleLoading(false);
            })
            .onServerError(result => {
              setError({
                title: t("INTERNAL_SERVER_ERROR"),
                msg: t("INTERNAL_SERVER_ERROR_MSG")
              });
              toggleLoading(false);
            })
            .onBadRequest(result => {
              setError({
                title: t("BAD_REQUEST"),
                msg: t("BAD_REQUEST_MSG")
              });
              toggleLoading(false);
            })
            .notFound(result => {
              setError({
                type: "notFound"
              });
              toggleLoading(false);
            })
            .onRequestError(result => {
              setError({
                title: t("ON_REQUEST_ERROR"),
                msg: t("ON_REQUEST_ERROR_MSG")
              });
              toggleLoading(false);
            })
            .unKnownError(result => {
              setError({
                title: t("UNKNOWN_ERROR"),
                msg: t("UNKNOWN_ERROR_MSG")
              });
              toggleLoading(false);
            })
            .call(obj);
        }
      }
      if (["agent", "admin"].indexOf(currentRole) > -1) {
        if (token && !userInfo) {
          //if Agent refreshed the page
          //Or user has logged in before but there is a problem with its userInfo data
          const cachedUserInfo = JSON.parse(
            sessionStorage.getItem("@ponture-user-info")
          );
          const name =
            currentRole === "admin"
              ? cachedUserInfo.admin_id
              : cachedUserInfo.name;
          dispatch({
            type: "SET_USER_INFO",
            payload: {
              userInfo: { ...cachedUserInfo, name: name },
              currentRole: currentRole,
              isAuthenticated: true
            }
          });
          toggleLoading(false);
        } else if (!token && !userInfo) {
          //if both userInfo and token not found, then agent authentication not established before
          props.history.push("/app/userlogin");
        } else {
          //Agent is valid and authentication passed successfully
          toggleLoading(false);
        }
      }
    }, []);
    return !isAuthenticated ? (
      <Redirect
        to={{
          pathname:
            ["agent", "admin"].indexOf(lastRole) > -1
              ? "/app/userlogin"
              : "/app/login",
          state: { from: props.location }
        }}
      />
    ) : loading ? (
      <div className="loaderBox">
        <div className="loader" />
        {t("MAIN_SPINNER_LOADING_TEXT")}
      </div>
    ) : error ? (
      error.type === "notFound" ? (
        <NotFoundUser />
      ) : (
        <>
          <div className="rosolverError animated fadeIn">
            <Wrong />
            <span className="title">{error.title}</span>
            <span className="info">{error.msg}</span>
          </div>
        </>
      )
    ) : (
      <WrappedComponent {...props} />
    );
  });
};

export default withResolver;
