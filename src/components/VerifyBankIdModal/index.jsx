import React, { useState, useEffect } from "react";
import CircleSpinner from "./../CircleSpinner";
import { collect, getCompanies } from "api/business-loan-api";
import { useLocale } from "hooks";
import isMobileDevice from "utils/isMobileDevice";
import "./styles.scss";
const isMobile = isMobileDevice();
//
export default function VerifyBankIdModal({
  personalNumber,
  startResult,
  isLogin,
  onSuccess,
  onClose,
  onFailedBankId,
  onCancelVerify,
}) {
  let didCancel = false;
  const { t } = useLocale();
  const [mainSpinner, toggleMainSpinner] = useState(true);
  const [status, setStatus] = useState(t("RFA1"));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  const useEffectFunction = () => {
    let didCancel = false;
    let fetchInterval = setInterval(() => {
      collect()
        .onOk((result) => {
          if (!didCancel) {
            if (result) {
              if (result.progressStatus) {
                switch (result.progressStatus.toLowerCase()) {
                  case "complete":
                    toggleMainSpinner(false);
                    setSuccess(true);
                    if (onSuccess) onSuccess(result);
                    if (!isLogin) _getCompanies(result);
                    break;
                  case "no_client":
                    // check is mobile
                    setStatus(t("VERIFY_NO_CLIENT"));
                    break;
                  case "started":
                    // check is mobile
                    setStatus(t("VERIFY_STARTED_COMPUTER"));
                    break;
                  default:
                    break;
                }
              } else {
                if (onFailedBankId) onFailedBankId();
                clearInterval(fetchInterval);
                toggleMainSpinner(false);
                // check for example user_cancel
                let userCanceled = false;
                let expired = false;
                for (let i = 0; i < result.errors.length; i++) {
                  const error = result.errors[i];
                  const code = error.code.toLowerCase();
                  if (code === "user_cancel") {
                    userCanceled = true;
                    break;
                  }
                  if (code === "expired_transaction") {
                    expired = true;
                    break;
                  }
                }
                if (userCanceled) {
                  setError({
                    type: "user_cancel",
                    message: t("VERIFY_USER_CANCEL"),
                  });
                  if (onClose)
                    setTimeout(() => {
                      onClose();
                    }, 1000);
                } else if (expired) {
                  setError({
                    type: "",
                    message: t("VERIFY_EXPIRED"),
                  });
                } else
                  setError({
                    type: "",
                    message: t("VERIFY_ERROR"),
                  });
              }
            }
          }
        })
        .onServerError((result) => {
          clearInterval(fetchInterval);
          // if (window.analytics)
          //   window.analytics.track("BankID Failed", {
          //     category: "Customer Portal",
          //     label: "Customer Portal login bankid popup",
          //     value: 0
          //   });
          if (!didCancel) {
            toggleMainSpinner(false);
            setError({
              type: "",
              message: t("INTERNAL_SERVER_ERROR"),
            });
          }
        })
        .onBadRequest((result) => {
          clearInterval(fetchInterval);
          // if (window.analytics)
          //   window.analytics.track("BankID Failed", {
          //     category: "Customer Portal",
          //     label: "Customer Portal login bankid popup",
          //     value: 0
          //   });
          if (!didCancel) {
            toggleMainSpinner(false);
            setError({
              type: "",
              message: t("BAD_REQUEST"),
            });
          }
        })
        .unAuthorized((result) => {
          clearInterval(fetchInterval);
          // if (window.analytics)
          //   window.analytics.track("BankID Failed", {
          //     category: "Customer Portal",
          //     label: "Customer Portal login bankid popup",
          //     value: 0
          //   });
          if (!didCancel) {
            toggleMainSpinner(false);
            setError({
              type: "",
              message: t("UN_AUTHORIZED"),
            });
          }
        })
        .unKnownError((result) => {
          clearInterval(fetchInterval);
          // if (window.analytics)
          //   window.analytics.track("BankID Failed", {
          //     category: "Customer Portal",
          //     label: "Customer Portal login bankid popup",
          //     value: 0
          //   });
          if (!didCancel) {
            toggleMainSpinner(false);
            setError({
              type: "",
              message: t("UNKNOWN_ERROR"),
            });
          }
        })
        .onRequestError((result) => {
          clearInterval(fetchInterval);
          // if (window.analytics)
          //   window.analytics.track("BankID Failed", {
          //     category: "Customer Portal",
          //     label: "Customer Portal login bankid popup",
          //     value: 0
          //   });
          if (!didCancel) {
            toggleMainSpinner(false);
            setError({
              type: "",
              message: t("ON_REQUEST_ERROR"),
            });
          }
        })
        .call();
    }, 3000);
    return () => {
      clearInterval(fetchInterval);
      didCancel = true;
    };
  };
  React.useEffect(useEffectFunction, []);
  function _getCompanies(completedResult) {
    let pId = personalNumber;
    if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
    // const access_token = process.env.REACT_APP_TOEKN
    //   ? process.env.REACT_APP_TOEKN
    //   : token;
    const pNumber = pId.replace("-", "");
    getCompanies()
      .onOk((result) => {
        if (!didCancel) {
          if (Array.isArray(result)) onClose(true, result, completedResult);
          else onClose(false, []);
        }
      })
      .onServerError((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "serverError",
            message: t("COMPANIES_ERROR_500"),
          });
        }
      })
      .onBadRequest((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "Bad Request",
            message: t("COMPANIES_ERROR_400"),
          });
        }
      })
      .unAuthorized((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "unAuthorized",
            message: t("COMPANIES_ERROR_401"),
          });
        }
      })
      .notFound((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "notFound",
            message: t("COMPANIES_ERROR_404"),
          });
        }
      })
      .unKnownError((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "unKnownError",
            message: t("COMPANIES_ERROR_UNKNOWN"),
          });
        }
      })
      .onRequestError((result) => {
        if (!didCancel) {
          onClose(false, {
            sender: "companies",
            type: "requestError",
            message: t("COMPANIES_ERROR_REQUEST_ERROR"),
          });
        }
      })
      .call(pNumber);
  }
  function handleCancelVerify() {
    if (onCancelVerify) onCancelVerify();
  }
  function handleCloseModal() {
    if (onClose) onClose();
  }
  function handleBankIDClicked() {
    const a = document.createElement("a");
    a.href = `bankid:///?autostarttoken =${startResult.autoStartToken} &redirect=null`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  return (
    <div className="modal-back animated fadeIn">
      <div className="modal">
        <div className="bankId__centerBox">
          <div className="bankId__centerBox__header">
            <img src={require("assets/bankidLogo.png")} alt="logo" />
            <span>{t("BL_VERIFY_MODAL_TITLE")}</span>
          </div>
          <div className="bankId__centerBox__body">
            <span className="description">{t("BL_VERIFY_MODAL_INFO")}</span>
            {mainSpinner ? (
              <div className="spinner">
                <CircleSpinner show={true} size="large" bgColor="#44b3c2" />
                <span>{status}</span>
              </div>
            ) : success ? (
              <div className="collectSuccess animated fadeIn">
                <div className="icon">
                  <i className="icon-checkmark" />
                </div>
                <span className="text">{t("VERIFYIED_SUCCESS")}</span>
              </div>
            ) : error ? (
              <div className="error animated fadeIn">
                <div className="icon">
                  <i className="icon-warning" />
                </div>
                <span className="text">{error.message}</span>
              </div>
            ) : null}
          </div>
          <div className="bankId__centerBox__footer">
            {isMobile && (
              <button
                className="btn btn-success btn-large"
                onClick={handleBankIDClicked}
              >
                {t("OPEN_BANK_ID")}
              </button>
            )}
            {!error && (
              <button
                className="btn btn-light btn-large"
                onClick={handleCancelVerify}
              >
                {t("BL_VERIFY_MODAL_CANCEL_BTN")}
              </button>
            )}
            {error && error.type !== "user_cancel" && (
              <button
                className="btn btn-light btn-large"
                onClick={handleCloseModal}
              >
                {t("CLOSE")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
