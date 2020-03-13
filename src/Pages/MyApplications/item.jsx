import React, { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import track from "utils/trackAnalytic";
import { toggleAlert } from "components/Alert";
import { cancelApplication } from "api/main-api";
import { CircleSpinner } from "components";
import classnames from "classnames";
import SafeValue from "utils/SafeValue";
//
const Item = props => {
  const [{ currentRole }, dispatch] = useGlobalState();
  const { t, direction } = useLocale();
  const { item } = props;
  const parent_submit = props.submit;
  const parent_verify = props.verify;
  const parent_onBankId = props.onBankId;
  const { personalNumber } = item.contactInfo;
  const stage = item.opportunityStage.toLowerCase();
  const RecordType = item.RecordType.toLowerCase();
  const need = item.need;
  const lostReason = item.lostReason ? item.lostReason.toLowerCase() : "";
  //States
  const [isVerified, setIsVerified] = useState(item.bankVerified);
  const [isSubmitted, setIsSubmitted] = useState(item.bankVerified);
  const [loading, toggleLoading] = useState(false);
  console.log(currentRole+" logged in.");
  //functions
  const submitApplication = appData => {
    const oppId = appData.opportunityID;
    const phone = appData.contactInfo.phone;
    const email = appData.contactInfo.email;

    const apiData = {
      oppId: oppId,
      phoneNumber: phone,
      email: email
    };

    if (typeof parent_submit === "function") {
      if (typeof parent_verify === "function") {
        toggleLoading(true);
        //
        parent_submit(apiData, appData, res => {
          if (res && res.success) {
            setIsSubmitted(true);
            toggleLoading(false);
          } else {
            toggleLoading(false);
          }
        });
      }
    }
  };
  const verifyApplication = item => {
    if (typeof parent_verify === "function") {
      toggleLoading(true);
      //
      parent_verify(
        item,
        (SuccessRes, callback) => {
          toggleLoading(false);
          setIsVerified(true);
          if (typeof callback === "function") {
            callback();
          }
        },
        (failedRes, callback) => {
          toggleLoading(false);
          setIsVerified(false);
          if (typeof callback === "function") {
            callback();
          }
        }
      );
    }
  };
  function editItemModal(item) {
    props.edit(item, "edit");
  }
  function viewItemModal(item, type) {
    props.view(item, type);
  }
  function handleCancelClicked() {
    toggleAlert({
      title: t("APP_CANCEL_ALERT_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: cancelApplication,
      data: {
        appId: item.opportunityID
      },
      onCancel: () => {},
      onSuccess: result => {
        track("Cancel Application", "Customer Portal", "Customer Portal", 0);
        if (props.onCancelSuccess) props.onCancelSuccess();
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
      unAuthorized: error => {},
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
      {/* Application header info */}
      <div className="application__header">
        <div className="left">
          <div
            className={
              "icon " +
              (stage === "app received" || stage === "app review"
                ?  ( currentRole !== "agent" ? "appReceivedIcon" :"approvedIcon" )
                : stage === "approved" ||
                  stage === "submitted" ||
                  stage === "offer received" ||
                  stage === "offer accepted"
                ? "approvedIcon"
                : stage === "not funded/ closed lost"
                ? ( currentRole !== "agent" ? "rejectedIcon" : "closedIcon")
                : stage === "funded/closed won"
                ? "closedIcon"
                : stage === "created"
                ? "appCreatedIcon"
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
                  ? ( currentRole !== "agent" ? "checkmark" : "list" )
                  : stage === "not funded/ closed lost"
                  ? "cross"
                  : stage === "funded/closed won"
                  ? ( currentRole !== "agent" ? "quote" : "cross" )
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
                ? ( currentRole !== "agent" ? t("APP_STATUS_APPROVED_TITLE") :t("APP_STATUS_RECEIVED_TITLE") )
                : stage === "not funded/ closed lost" &&
                  lostReason === "canceled by customer"
                ?  ( currentRole !== "agent" ? t("APP_STATUS_REJECTED_BY_USER_TITLE") : t("APP_STATUS_CLOSED_TITLE"))
                : stage === "not funded/ closed lost" &&
                  lostReason !== "canceled by customer"
                ? ( currentRole !== "agent" ? t("APP_STATUS_REJECTED_TITLE") : t("APP_STATUS_CLOSED_TITLE"))
                : stage === "funded/closed won"
                ? ( currentRole !== "agent" ? t("APP_STATUS_WON_TITLE") : t("APP_STATUS_CLOSED_TITLE"))
                : stage === "created"
                ? t("APP_STATUS_CREATED_TITLE")
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
                : stage === "created"
                ? t("APP_STATUS_CREATED_DESC")
                : ""}
            </span>
          </div>
          <div>
          {(stage === "approved" ||
            stage === "submitted" ||
            stage === "offer received" ||
            stage === "offer accepted") &&
            (currentRole !== "agent" && (
              <Link
                className="offers-button"
                to={"/app/panel/viewOffers/" + item.opportunityID}
              >
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
            )
            //  : (
            //   <span className="offers-button">
            //     <span className="linkTitle" style={{ textDecoration: "none" }}>
            //       {t("OFFERS_NUMBER")}{" "}
            //       {item.activeOffersCount || item.activeOffersCount === 0
            //         ? "(" + item.activeOffersCount + ")"
            //         : ""}
            //     </span>
            //   </span>
            // )
            )}
          {/* edit application */}
          {/* {currentRole==="admin" && stage === "created" && RecordType === "business acquisition loan" && (
            <button
              className="btn --light headerBtn"
              onClick={() => editItemModal(item)}
            >
              <span className="icon-pencil" />
            </button>
          )} */}
          &nbsp;
          {/* view application */}
          {currentRole !== "agent" &&
            (RecordType === "real estate" ||
              RecordType === "business acquisition loan") && (
              <button
                className="btn --primary viewButton"
                onClick={() =>
                  viewItemModal(
                    item,
                    RecordType === "real estate" ? "RE" : "BA"
                  )
                }
              >
                {t("APP_OPEN_APPLICATION")}
              </button>
              // <button
              //   className="btn --light headerBtn"
              //   onClick={() =>
              //     viewItemModal(item, RecordType === "real estate" ? "RE" : "BA")
              //   }
              // >
              //   <span className="icon-more-h" />
              // </button>
            )}
        </div>
        </div>
      </div>

      {/* Application body info */}
      <div className="application__body">
        <div className="application__body__header">
          <span>
            {RecordType === "real estate" ||
            RecordType === "business acquisition loan"
              ? SafeValue(need,"0.title","string"," - ")
              : t("BUSINESS_LOAN")}
          </span>
          <span className="loanAmount">
            <span>{t("MY_APPS_ITEM_HEADER_TITLE")}</span>
            <span>{separateNumberByChar(item.amount)} Kr</span>
          </span>
        </div>
        <div className="application__bodyRow">
          <span>{t("APP_RECORD_TYPE")}</span>
          <span>{item.RecordType}</span>
        </div>
        {currentRole === "agent" || currentRole === "admin" && (
          <>
            <div className="application__bodyRow">
              <span>{t("APP_CONTACT_NAME")}</span>
              <span>{item.contactInfo.name}</span>
            </div>
            <div className="application__bodyRow">
              <span>{t("BL_PERSONAL_NUMBER")}</span>
              <span>{item.contactInfo.personalNumber}</span>
            </div>
          </>
        )}
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
          <span>{item.closeDate && item.closeDate.split(" ")[0]}</span>
        </div>
        {currentRole !== "agent" && (
          <div className="application__bodyRow">
            <span>{t("APP_CREDIT_SAFE")}</span>
            <span>{item.creditSafeScore}</span>
          </div>
        )}
      </div>

      {/* Application footer */}
      {currentRole !== "agent" &&
        stage !== "funded/closed won" &&
        stage !== "not funded/ closed lost" && (
          <div className="application__footer">
            <div>
              <button className="btn --light" onClick={handleCancelClicked}>
                <span className="icon-cross" />
                {t("CANCEL")}
              </button>
            </div>

            <div style={{ flexDirection: "row", display: "flex" }}>
              {stage === "created" && (
                <>
                  {RecordType === "business acquisition loan" && (
                  <button
                    className="btn --primary editButton"
                    onClick={() => editItemModal(item)}
                  >
                    {t("APP_COMPLETE_APPLICATION")}
                  </button>
                  )}
                  <button
                    className={classnames(
                      "btn verifyBtn",
                      isVerified ? "--verified" : "--success"
                    )}
                    onClick={() => verifyApplication(item)}
                    disabled={loading || isVerified}
                  >
                    {isVerified ? (
                      <>
                        <span
                          className="icon-checkmark"
                          style={{ fontSize: "14px", color: "#42ccad" }}
                        />
                        {t("VERIFIED")}
                      </>
                    ) : loading ? (
                      <CircleSpinner show={true} />
                    ) : (
                      <>{t("VERIFY")}</>
                    )}
                  </button>
                  {isVerified && (
                    <button
                      className="btn --warning"
                      onClick={() => submitApplication(item)}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircleSpinner show={true} />
                      ) : (
                        <>{t("SUBMIT_2")}</>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        )}

      {/* {currentRole === "agent" &&
        stage === "created" &&
        stage !== "funded/closed won" &&
        stage !== "not funded/ closed lost" && (
          <div className="application__footer">
            <div>
              <button className="btn --light" onClick={handleCancelClicked}>
                <span className="icon-cross" />
                {t("CANCEL")}
              </button>
            </div>
            <div style={{ flexDirection: "row", display: "flex" }}>
              <button
                className={classnames(
                  "btn verifyBtn",
                  isVerified ? "--verified" : "--success"
                )}
                onClick={() => verifyApplication(item)}
                disabled={loading || isVerified}
              >
                {isVerified ? (
                  <>
                    <span
                      className="icon-checkmark"
                      style={{ fontSize: "14px", color: "#42ccad" }}
                    />
                    {t("VERIFIED")}
                  </>
                ) : loading ? (
                  <CircleSpinner show={true} />
                ) : (
                  <>{t("VERIFY")}</>
                )}
              </button>
              {isVerified && (
                <button
                  className="btn --warning"
                  onClick={() => submitApplication(item)}
                  disabled={loading}
                >
                  {loading ? (
                    <CircleSpinner show={true} />
                  ) : (
                    <>{t("SUBMIT_2")}</>
                  )}
                </button>
              )}
            </div>
          </div>
        )} */}
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
