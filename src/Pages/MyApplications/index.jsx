import React, { useEffect, useState } from "react";
import { useGlobalState, useLocale } from "hooks";
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
  const [{ verifyInfo, userInfo }] = useGlobalState();
  const { t } = useLocale();
  const [viewAppModalVisibility, toggleViewApp] = useState();
  const [selectedApp, setApp] = useState();
  const [loading, toggleLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  useEffect(() => {
    let didCancel = false;
    if (!userInfo) {
      toggleLoading(false);
      // setError({
      //   title: "", 
      //   message: ""
      // });
    } else
      getMyApplications()
        .onOk(result => {
          if (!didCancel) {
            toggleLoading(false);
            setData([
              {
                opportunityID: "0064E00000DRDxmQAH",
                opportunityNumber: "LO0000000073",
                Name: "CFA International AB",
                opportunityStage: "Not Funded/ Closed lost",
                createdAt: "2019-08-18 17:25:26",
                RecordType: "Business Loan",
                amortizationPeriod: 12.0,
                amount: 3500000.0,
                orgNumber: "330299-1234",
                closeDate: "2019-08-18 17:25:26",
                CompanyRegistrationDate: "2014-12-22",
                need: [
                  {
                    apiName: "general_liquidity",
                    title: "Generell likviditet"
                  }
                ],
                lastAvailableRevenue: 6000,
                creditSafeScore: 2,
                bankVerified: true,
                activeCompany: true,
                companyVerified: true
              }
            ]);
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
              title: t("UN_AUTHORIZED"),
              message: t("UN_AUTHORIZED_MSG")
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
        .call(userInfo.personalNumber);
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
            key={app.opportunityID}
            item={app}
            onViewOffersClicked={handleViewOffers}
          />
        ))
      )}
    </div>
  );
};

export default MyApplications;
