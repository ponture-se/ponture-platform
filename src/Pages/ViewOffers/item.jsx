import React from "react";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import { rejectOffer, acceptOffer } from "api/main-api";
import { toggleAlert } from "components/Alert";
//
const Item = props => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const { app, offer } = props;

  function handleAcceptOfferClicked() {
    toggleAlert({
      title: t("ARE_YOU_SURE"),
      description: t("APP_OFFERS_ACCEPT_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: acceptOffer,
      data: {
        offerId: offer.Id
      },
      onCancel: () => {},
      onSuccess: result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("OFFER_ACCEPTED_SUCCESS")
          }
        });
        if (props.onAcceptSuccess) props.onAcceptSuccess();
      },
      onServerError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("INTERNAL_SERVER_ERROR")
          }
        });
      },
      onBadRequest: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("BAD_REQUEST")
          }
        });
      },
      unAuthorized: error => {
      },
      notFound: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("NOT_FOUND")
          }
        });
      },
      unKnownError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UNKNOWN_ERROR")
          }
        });
      }
    });
  }
  function handleRejectClicked() {
    toggleAlert({
      title: t("ARE_YOU_SURE"),
      description: t("APP_OFFERS_REJECT_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: rejectOffer,
      data: {
        offerId: offer.Id
      },
      onCancel: () => {},
      onSuccess: result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("OFFER_REJECT_SUCCESS")
          }
        });
        if (props.onRejectSuccess) props.onRejectSuccess();
      },
      onServerError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("INTERNAL_SERVER_ERROR")
          }
        });
      },
      onBadRequest: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("BAD_REQUEST")
          }
        });
      },
      unAuthorized: error => {
      },
      notFound: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("NOT_FOUND")
          }
        });
      },
      unKnownError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UNKNOWN_ERROR")
          }
        });
      }
    });
  }
  function handleViewOffer() {
    if (props.onViewOffersClicked) props.onViewOffersClicked(offer);
  }

  return (
    <div className="myOfferItem animated fadeIn">
      <div className="myOfferItem__header">
        <div className="top">
          <span>{app.RecordType}</span>
          <span>{offer.partnerName}</span>
        </div>
        <div className="bottom">
          <span>{app.Name}</span>
          <span>&nbsp;({app.orgNumber})</span>
        </div>
      </div>
      <div className="myOfferItem__body">
        <div className="myOfferItem__bodyRow">
          <span>{t("Product Name")}</span>
          <span>{offer.Name}</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Amount")}</span>
          <span>{separateNumberByChar(offer.Amount)} Kr</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Repayment Period")}</span>
          <span>
            {offer.Repayment_Period} {t("MONTH_S")}
          </span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Interest Rate")}</span>
          <span>{offer.Interest_Rate} %</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Total Repayment Amount")}</span>
          <span>{separateNumberByChar(offer.Total_Repayment_Amount)} kr</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_GUARANTEE_NEEDED")}</span>
          <span>{offer.Other_Guarantees_Type}</span>
        </div>
      </div>
      <div className="myOfferItem__footer">
        <div className="myOfferItem__footer__left">
          {offer.spoStage && offer.spoStage.toLowerCase() === "offer issued" && (
            <>
              <button
                className="btn --success"
                onClick={handleAcceptOfferClicked}
              >
                {t("ACCEPT_OFFER")}
              </button>
              <button className="btn --warning" onClick={handleRejectClicked}>
                <span className="icon-cross" />
                {t("REJECT")}
              </button>
            </>
          )}
        </div>
        <div className="myOfferItem__footer__right">
          <button className="btn --light" onClick={handleViewOffer}>
            {t("VIEW_DETAIL")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default Item;
