import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";
import CircleSpinner from "./../CircleSpinner";
import { startBankIdByOppId, collect } from "api/business-loan-api";
import { useLocale } from "hooks";
import track from "utils/trackAnalytic";
import "./styles.scss";

//
export default function VerifyBankIdModal({ oppId, onClose, bankIdDevice }) {
  let didCancel = useRef(false);
  let fetchInterval = useRef(null);
  const { t } = useLocale();
  const [mainSpinner, toggleMainSpinner] = useState(true);
  const [startResult, setStartResult] = useState();
  const [status, setStatus] = useState(t("VERIFY_BANKID_MODAL_START"));
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState();

  const _collect = () => {
    collect()
      .onOk((result) => {
        if (!didCancel.current) {
          if (result) {
            if (result.progressStatus) {
              switch (result.progressStatus.toLowerCase()) {
                case "complete":
                  clearInterval(fetchInterval);
                  toggleMainSpinner(false);
                  setSuccess(true);
                  if (window.analytics) {
                    window.analytics.identify(result.userInfo.personalNumber, {
                      name: result.userInfo.name,
                      email: result.userInfo.email,
                      plan: result.userInfo.plan,
                      logins: result.userInfo.logins,
                    });
                  }
                  if (onClose) onClose("success", result);
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
                setTimeout(() => {
                  if (onClose) onClose("canceled");
                }, 1000);
              } else if (expired) {
                track(
                  "BankID failed",
                  "Loan Application v2",
                  "/app/loan/verifybankid bankid popup",
                  0
                );
                setError({
                  type: "",
                  message: t("VERIFY_EXPIRED"),
                });
              } else {
                track(
                  "BankID failed",
                  "Loan Application v2",
                  "/app/loan/verifybankid bankid popup",
                  0
                );
                setError({
                  type: "",
                  message: t("VERIFY_ERROR"),
                });
              }
            }
          }
        }
      })
      .onServerError((result) => {
        clearInterval(fetchInterval);
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("INTERNAL_SERVER_ERROR"),
          });
        }
      })
      .onBadRequest((result) => {
        clearInterval(fetchInterval);
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("BAD_REQUEST"),
          });
        }
      })
      .unAuthorized((result) => {
        clearInterval(fetchInterval);
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UN_AUTHORIZED"),
          });
        }
      })
      .unKnownError((result) => {
        clearInterval(fetchInterval);
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UNKNOWN_ERROR"),
          });
        }
      })
      .onRequestError((result) => {
        clearInterval(fetchInterval);
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("ON_REQUEST_ERROR"),
          });
        }
      })
      .call();
  };
  const startBankId = () => {
    startBankIdByOppId()
      .onOk((result) => {
        if (bankIdDevice) openBankIDTab(bankIdDevice, result);
        setStatus(t("RFA1"));
        setStartResult(result);
        fetchInterval = setInterval(() => {
          _collect();
        }, 3000);
      })
      .onServerError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("INTERNAL_SERVER_ERROR"),
          });
        }
      })
      .onBadRequest((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("BAD_REQUEST"),
          });
        }
      })
      .unAuthorized((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UN_AUTHORIZED"),
          });
        }
      })
      .unKnownError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UNKNOWN_ERROR"),
          });
        }
      })
      .forbiddenError((result) => {
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t(result.errorCode),
          });
        }
      })
      .onRequestError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        if (!didCancel.current) {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("ON_REQUEST_ERROR"),
          });
        }
      })
      .call(oppId);
  };
  const useEffectFunction = () => {
    startBankId();
    return () => {
      clearInterval(fetchInterval);
      didCancel.current = true;
    };
  };
  React.useEffect(useEffectFunction, []);

  function handleCancelVerify() {
    if (onClose) onClose("canceled", startResult);
  }
  function handleCloseModal() {
    if (onClose) onClose("close");
  }
  function openBankIDTab(device, startResult) {
    const a = document.createElement("a");
    if (device === "mobile")
      a.href = `bankid:///?autostarttoken =${startResult.autoStartToken} &redirect=null`;
    else
      a.href = `bankid:///?autostarttoken =${startResult.autoStartToken} &redirect=null`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  return ReactDOM.createPortal(
    <React.Fragment>
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
    </React.Fragment>,
    document.body
  );
}
