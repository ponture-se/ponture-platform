import React, { useEffect, useState } from "react";
import { useLocale } from "hooks";
import "./styles.scss";
import Item from "./item";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getOffers } from "api/main-api";
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
    const id = props.match.params.id;
    getOffers()
      .onOk(result => {
        if (!didCancel) {
          toggleLoading(false);
          setData([
            {
              Id: "a074E000004RLS4QAO",
              partnerName: "Qred",
              Name: "Qred Product Master",
              CreatedDate: "2019-08-21T12:22:51.000+0000",
              LastModifiedDate: "2019-08-21T16:03:54.000+0000",
              Supplier_Partner_Opportunity: "a084E000004dFJMQA2",
              Active: false,
              Amount: 10004,
              Cost: 4,
              Interest_Rate: 4,
              Monthly_Repayment_Amount: 4,
              Other_Guarantees_Needed: true,
              Personal_Guarantee_Needed: true,
              Repayment_Period: 4,
              Residual_Value: false,
              Start_Fee: 4,
              Total_Repayment_Amount: 4,
              Product_Master: "a0G4E00000CLTUGUA5",
              Offer_Number: "LP-0000000017"
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
      .call(id);

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
          <h2>{t("OFFERS_LOADING_TEXT")}</h2>
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
          <h2>{t("OFFERS_EMPTY_LIST_TITLE")}</h2>
          <span>{t("OFFERS_EMPTY_LIST_MSG")}</span>
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
