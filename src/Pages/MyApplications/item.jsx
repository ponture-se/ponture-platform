import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import { toggleAlert } from "components/Alert";
import { cancelApplication } from "api/main-api";
//
const Item = props => {
  const [{}, dispatch] = useGlobalState();
  const { t, direction } = useLocale();
  const { item } = props;
  const stage = "approved";
  function viewApplication() {
    if (props.onViewAppClicked) props.onViewAppClicked(item);
  }
  function handleCancelClicked() {
    toggleAlert({
      title: t("ARE_YOU_SURE"),
      description: t("APP_CANCEL_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: cancelApplication,
      data: {
        appId: item.opportunityID
      },
      onCancel: () => {},
      onSuccess: result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("APP_CANCELED_SUCCESS")
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
    <div className="application animated fadeIn">
      <div className="application__header">
        <div className="left">
          <div
            className={
              "icon " +
              (stage === "app received"
                ? "appReceivedIcon"
                : stage === "app review"
                ? "appReviewIcon"
                : stage === "approved"
                ? "approvedIcon"
                : stage === "submitted"
                ? "submittedIcon"
                : stage === "offer received"
                ? "offerReceivedIcon"
                : stage === "offer accepted"
                ? "offerAcceptedIcon"
                : stage === "funded/closed won"
                ? "fundedClosedWonIcon"
                : stage === "not founded/ closed lost"
                ? "notFoundedClosedLostIcon"
                : "")
            }
          >
            <i
              className={
                "icon-" +
                (stage === "app received"
                  ? "bars"
                  : stage === "app review"
                  ? "partner"
                  : stage === "approved"
                  ? "envelope"
                  : stage === "submitted"
                  ? "order"
                  : stage === "offer received"
                  ? "draft"
                  : stage === "offer accepted"
                  ? "reference"
                  : stage === "funded/closed won"
                  ? "quote"
                  : stage === "not founded/ closed lost"
                  ? "request"
                  : "file-text")
              }
            />
          </div>
          <div className="info">
            <span>
              {stage === "app received"
                ? t("APP_STATUS_RECEIVED_TITLE")
                : stage === "app review"
                ? t("APP_STATUS_REVIEW_TITLE")
                : stage === "approved"
                ? t("APP_STATUS_APPROVED_TITLE")
                : stage === "submitted"
                ? t("APP_STATUS_SUBMITTED_TITLE")
                : stage === "offer received"
                ? t("APP_STATUS_OFFER_RECEIVED_TITLE")
                : stage === "offer accepted"
                ? t("APP_STATUS_ACCEPTED_TITLE")
                : stage === "funded/closed won"
                ? t("APP_STATUS_FUNDED_CLOSED_WON_TITLE")
                : stage === "not founded/ closed lost"
                ? t("APP_STATUS_NOT_FOUNDED_CLOSED_LOST_TITLE")
                : ""}
            </span>
            <span>
              {stage === "app received"
                ? t("APP_STATUS_RECEIVED_DESC")
                : stage === "app review"
                ? t("APP_STATUS_REVIEW_DESC")
                : stage === "approved"
                ? t("APP_STATUS_APPROVED_DESC")
                : stage === "submitted"
                ? t("APP_STATUS_SUBMITTED_DESC")
                : stage === "offer received"
                ? t("APP_STATUS_OFFER_RECEIVED_DESC")
                : stage === "offer accepted"
                ? t("APP_STATUS_ACCEPTED_DESC")
                : stage === "funded/closed won"
                ? t("APP_STATUS_FUNDED_CLOSED_WON_DESC")
                : stage === "not founded/ closed lost"
                ? t("APP_STATUS_NOT_FOUNDED_CLOSED_LOST_DESC")
                : ""}
            </span>
          </div>
        </div>
        {stage === "approved" && (
          <Link to={"/app/panel/viewOffers/" + item.opportunityID}>
            <span>{t("VIEW_OFFERS")}</span>
            <div className="icon">
              <i
                className={
                  direction === "ltr" ? "icon-arrow-right2" : "icon-arrow-left2"
                }
              />
            </div>
          </Link>
        )}
      </div>
      <div className="application__body">
        <div className="application__body__header">
          <span>{t("BUSINESS_LOAN")}</span>
          <span>{separateNumberByChar(item.amount)} Kr</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_COMPANY_NAME")}</span>
          <span>
            {item.Name}
            {item.orgNumber && " (" + item.orgNumber + ")"}
          </span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_NEEDS")}</span>
          <span>
            {item.need &&
              item.need.map((n, index) => {
                if (index === item.need.length - 1) return n.title;
                else return n.title + " , ";
              })}
          </span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_AMORTIZATION_PERIOD")}</span>
          <span>
            {item.amortizationPeriod &&
              item.amortizationPeriod + " " + t("MONTH_S")}
          </span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_CLOSE_DATE")}</span>
          <span>{item.closeDate && item.closeDate.split(" ")[0]}</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_CREDIT_SAFE")}</span>
          <span>{item.creditSafeScore}</span>
        </div>
      </div>
      <div className="application__footer">
        <button className="btn --light" onClick={handleCancelClicked}>
          <span className="icon-cross" />
          {t("CANCEL")}
        </button>
      </div>
    </div>
  );
};
export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired
};
Item.defaultProps = {
  item: {}
};
