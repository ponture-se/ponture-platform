import React, { useEffect, useState } from "react";
import { useLocale } from "hooks";
import "./styles.scss";
import Item from "./item";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getMyApplications } from "api/main-api";
// import ViewApplicationModal from "./../ViewApplication";
//
// import {
//   loadNewApps,
//   resetStore
// } from "services/redux/application/newApps/actions";
//
const MyApplications = props => {
  const { t } = useLocale();
  const [viewAppModalVisibility, toggleViewApp] = useState();
  const [selectedApp, setApp] = useState();
  const [loading, toggleLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    let didCancel = false;
    getMyApplications()
      .onOk(result => {
        if (!didCancel) {
          toggleLoading(false);
          setData(result);
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call();

    return () => {
      didCancel = true;
    };
  }, []);
  function handleViewOffers(app) {
    setApp(app);
    toggleViewApp(true);
  }
  return (
    <div className="myApps">
      {loading ? (
        <div className="page-loading">
          <SquareSpinner />
          <h2>{t("MY_APPS_LOADING_TEXT")}</h2>
        </div>
      ) : error ? (
        <div className="page-list-error animated fadeIn">
          <Wrong />
          <h2>{error && error.title}</h2>
          <span>{error && error.message}</span>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="page-empty-list animated fadeIn">
          <Empty />
          <h2>{t("MY_APPS_EMPTY_LIST_TITLE")}</h2>
          <span>{t("MY_APPS_EMPTY_LIST_MSG")}</span>
        </div>
      ) : (
        data.map(app => (
          <Item
            // key={app.opportunityID}
            item={app}
            onViewOffersClicked={handleViewOffers}
          />
        ))
      )}
    </div>
  );
};

export default MyApplications;
