import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import track from "utils/trackAnalytic";
import { toggleAlert } from "components/Alert";
import { cancelApplication } from "api/main-api";
//
const Item = (props) => {
  const [{}, dispatch] = useGlobalState();
  const { t, direction } = useLocale();
  const { item } = props;
  const stage = item.opportunityStage.toLowerCase();
  const lostReason = item.lostReason ? item.lostReason.toLowerCase() : "";
  function handleCancelClicked() {
    toggleAlert({
      title: t("APP_CANCEL_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: cancelApplication,
      data: {
        appId: item.opportunityID,
      },
      onCancel: () => {},
      onSuccess: (result) => {
        track("Cancel Offer", "Customer Portal", "Customer Portal", 0);
        if (props.onCancelSuccess) props.onCancelSuccess();

        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("APP_CANCELED_SUCCESS"),
          },
        });
      },
      onServerError: (error) => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("INTERNAL_SERVER_ERROR"),
          },
        });
      },
      onBadRequest: (error) => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("BAD_REQUEST"),
          },
        });
      },
      unAuthorized: (error) => {},
      notFound: (error) => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("NOT_FOUND"),
          },
        });
      },
      unKnownError: (error) => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UNKNOWN_ERROR"),
          },
        });
      },
    });
  }
  return (
    <div className="application animated fadeIn">
      <div className="application__header">
        <div className="left">
          <div
            className={
              "icon " +
              (stage === "app received" || stage === "app review"
                ? "appReceivedIcon"
                : stage === "approved" ||
                  stage === "submitted" ||
                  stage === "offer received" ||
                  stage === "offer accepted"
                ? "approvedIcon"
                : stage === "not funded/ closed lost"
                ? "rejectedIcon"
                : stage === "funded/closed won"
                ? "closedIcon"
                : "")
            }
          >
            <i
              className={
                "icon-" +
                (stage === "app received" || stage === "app review"
                  ? "list"
                  : stage === "approved" ||
                    stage === "submitted" ||
                    stage === "offer received" ||
                    stage === "offer accepted"
                  ? "checkmark"
                  : stage === "not funded/ closed lost"
                  ? "cross"
                  : stage === "funded/closed won"
                  ? "quote"
                  : "file-text")
              }
            />
          </div>
        </div>
        <div className="right">
          <div className="info">
            <span>
              {stage === "app received" || stage === "app review"
                ? t("APP_STATUS_RECEIVED_TITLE")
                : stage === "approved" ||
                  stage === "submitted" ||
                  stage === "offer received" ||
                  stage === "offer accepted"
                ? t("APP_STATUS_APPROVED_TITLE")
                : stage === "not funded/ closed lost" &&
                  lostReason === "canceled by customer"
                ? t("APP_STATUS_REJECTED_BY_USER_TITLE")
                : stage === "not funded/ closed lost" &&
                  lostReason !== "canceled by customer"
                ? t("APP_STATUS_REJECTED_TITLE")
                : stage === "funded/closed won"
                ? t("APP_STATUS_WON_TITLE")
                : ""}
            </span>
            <span>
              {stage === "app received" || stage === "app review"
                ? t("APP_STATUS_RECEIVED_DESC")
                : stage === "approved" ||
                  stage === "submitted" ||
                  stage === "offer received" ||
                  stage === "offer accepted"
                ? t("APP_STATUS_APPROVED_DESC")
                : stage === "not funded/ closed lost" &&
                  lostReason === "canceled by customer"
                ? t("APP_STATUS_REJECTED_BY_USER_DESC")
                : stage === "not funded/ closed lost" &&
                  lostReason !== "canceled by customer"
                ? t("APP_STATUS_REJECTED_DESC")
                : stage === "funded/closed won"
                ? t("APP_STATUS_WON_DESC")
                : ""}
            </span>
          </div>

          {(stage === "approved" ||
            stage === "submitted" ||
            stage === "offer received" ||
            stage === "offer accepted") && (
            <Link to={"/app/panel/viewOffers/" + item.opportunityID}>
              <span className="linkTitle">
                {t("VIEW_OFFERS")}{" "}
                {item.activeOffersCount || item.activeOffersCount === 0
                  ? "(" + item.activeOffersCount + ")"
                  : ""}
              </span>
              <div className="icon">
                <i
                  className={
                    direction === "ltr"
                      ? "icon-arrow-right2"
                      : "icon-arrow-left2"
                  }
                />
              </div>
            </Link>
          )}
        </div>
      </div>
      <div className="application__body">
        <div className="application__body__header">
          <span>{t("BUSINESS_LOAN")}</span>
          <span className="loanAmount">
            <span>{t("MY_APPS_ITEM_HEADER_TITLE")}</span>
            <span>{separateNumberByChar(item.amount)} Kr</span>
          </span>
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
            {item.amortizationPeriod && item.amortizationPeriod + " "}
            {item.amortizationPeriod
              ? parseInt(item.amortizationPeriod) >= 1
                ? t("MONTHS")
                : t("MONTH")
              : null}
          </span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_CLOSE_DATE")}</span>
          <span>{item.createdAt && item.createdAt.split(" ")[0]}</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_CREDIT_SAFE")}</span>
          <span>{item.creditSafeScore}</span>
        </div>
      </div>
      {stage !== "funded/closed won" && stage !== "not funded/ closed lost" && (
        <div className="application__footer">
          <button className="btn btn-light" onClick={handleCancelClicked}>
            <span className="icon-cross" />
            {t("CANCEL")}
          </button>
        </div>
      )}
    </div>
  );
};
export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired,
};
Item.defaultProps = {
  item: {},
};
