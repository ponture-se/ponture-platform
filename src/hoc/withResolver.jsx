import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { withRouter, Redirect } from "react-router-dom";
import { customerLogin } from "api/main-api";
import { useGlobalState, useLocale } from "hooks";
import { Wrong } from "components/Commons/ErrorsComponent";
import NotFoundUser from "Pages/NotFoundUser";
//
const widthResolver = WrappedComponent => {
  return withRouter(props => {
    const [{ verifyInfo, userInfo }, dispatch] = useGlobalState();
    const { t } = useLocale();
    const token = Cookies.get("@ponture-customer-portal/token");
    const [loading, toggleLoading] = useState(token && userInfo ? false : true);
    const [error, setError] = useState();

    function refresh() {
      window.location.reload();
    }
    useEffect(() => {
      if (!token || !userInfo) {
        const obj = {
          id: verifyInfo.id,
          errors: verifyInfo.error,
          progressStatus: verifyInfo.progressStatus,
          signature: verifyInfo.signature,
          userInfo: verifyInfo.userInfo,
          ocspResponse: verifyInfo.ocspResponse,
          LookupPersonAddressStatus: verifyInfo.LookupPersonAddressStatus,
          status: verifyInfo.status
        };
        customerLogin()
          .onOk(result => {
            dispatch({
              type: "SET_USER_INFO",
              payload: result
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
    }, []);
    return !verifyInfo ? (
      <Redirect
        to={{
          pathname: "/app/login",
          state: { from: props.location }
        }}
      />
    ) : loading ? (
      <div className="loaderBox">
        <div className="loader" />
        Loading ...
      </div>
    ) : error ? (
      error.type === "notFound" ? (
        <NotFoundUser />
      ) : (
        <div className="rosolverError animated fadeIn">
          <Wrong />
          <span className="title">{error.title}</span>
          <span className="info">{error.msg}</span>
          <button className="btn --primary" onClick={refresh}>
            Refresh
          </button>
        </div>
      )
    ) : (
      <WrappedComponent {...props} />
    );
  });
};

export default widthResolver;
