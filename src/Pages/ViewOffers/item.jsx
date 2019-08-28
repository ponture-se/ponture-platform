import React from "react";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import { rejectOffer, acceptOffer } from "api/main-api";
import { toggleAlert } from "components/Alert";
//
const Item = props => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const { item } = props;

  function handleAcceptOfferClicked() {
    toggleAlert({
      title: t("ARE_YOU_SURE"),
      description: t("APP_OFFERS_ACCEPT_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: acceptOffer,
      data: {
        offerId: item.offer_id
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
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: t("UN_AUTHORIZED")
          }
        });
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
        offerId: item.offer_id
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
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "warning",
            message: t("UN_AUTHORIZED")
          }
        });
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

  return (
    <div className="myOfferItem animated fadeIn">
      <div className="myOfferItem__header">
        <img src={require("assets/signicat-logo-black.png")} />
        <span className="myOfferItem__title">{item.partnerName}</span>
      </div>
      <div className="myOfferItem__body">
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_OFFER")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_AMOUNT_APPROVED")}</span>
          <span>{separateNumberByChar(item.amount)} Kr</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_BUSINESS")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_LOAN_PERIOD")}</span>
          <span>
            {item.Repayment_Period} {t("MONTH_S")}
          </span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_INTEREST")}</span>
          <span>Value</span>
        </div>
      </div>
      <div className="myOfferItem__footer">
        <button className="btn --success" onClick={handleAcceptOfferClicked}>
          {t("ACCEPT_OFFER")}
        </button>
        <button className="btn --light" onClick={handleRejectClicked}>
          <span className="icon-cross" />
          {t("REJECT")}
        </button>
      </div>
    </div>
  );
};
export default Item;
