import React, { useState, useEffect } from "react";
import { useGlobalState, useLocale } from "hooks";
import CircleSpinner from "components/CircleSpinner";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { isBankId } from "utils";
import track from "utils/trackAnalytic";
import batchStates from "utils/batchStates";
import { startBankId, cancelVerify } from "api/business-loan-api";
import "./styles.scss";

const Login = (props) => {
  let didCancel = false;
  const { t } = useLocale();
  const [{}, dispatch] = useGlobalState();
  const [personalNumber, setPersonalNumber] = useState("");
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState();
  const [verifyModal, toggleVerifyModal] = useState();
  const [startResult, setStartResult] = useState();
  const [terms, toggleTerms] = useState(true);

  useEffect(() => {
    return () => {
      didCancel = true;
    };
  }, []);

  function handleChangedPersonalNumber(e) {
    if (e.target.value.length === 0) {
      let err = { ...error };
      err["personalNumber"] = {
        isError: true,
        message: t("PERSONAL_NUMBER_IS_REQUIRED"),
      };
      setError(err);
    } else {
      if (!isBankId(e.target.value)) {
        let err = { ...error };
        err["personalNumber"] = {
          isError: true,
          message: t("PERSONAL_NUMBER_IN_CORRECT"),
        };
        setError(err);
      } else {
        let err = { ...error };
        err["personalNumber"] = {
          isError: false,
        };
        setError(err);
      }
    }
    setPersonalNumber(e.target.value);
  }

  function handleLoginClicked(e) {
    e.preventDefault();
    if (!error || !error.personalNumber || !error.personalNumber.isError) {
      toggleLoading(true);

      let pId = personalNumber.replace("-", "");
      if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
      startBankId()
        .onOk((result) => {
          if (!didCancel) {
            track(
              "BankID Verification",
              "Customer Portal",
              "Customer Portal login bankid popup",
              0
            );
            batchStates(() => {
              toggleLoading(false);
              setStartResult(result);
              toggleVerifyModal(true);
            });
          }
        })
        .onServerError((result) => {
          if (window.analytics)
            window.analytics.track("BankID Failed", {
              category: "Customer Portal",
              label: "Customer Portal login bankid popup",
              value: 0,
            });
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Server Error",
              },
            });
          }
        })
        .onBadRequest((result) => {
          if (window.analytics)
            window.analytics.track("BankID Failed", {
              category: "Customer Portal",
              label: "Customer Portal login bankid popup",
              value: 0,
            });
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Bad Request",
              },
            });
          }
        })
        .unAuthorized((result) => {
          if (window.analytics)
            window.analytics.track("BankID Failed", {
              category: "Customer Portal",
              label: "Customer Portal login bankid popup",
              value: 0,
            });
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Un Authorized",
              },
            });
          }
        })
        .unKnownError((result) => {
          if (window.analytics)
            window.analytics.track("BankID Failed", {
              category: "Customer Portal",
              label: "Customer Portal login bankid popup",
              value: 0,
            });
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Unknown Error",
              },
            });
          }
        })
        .call(pId);
    }
  }

  function handleSuccessVerify(result) {
    toggleVerifyModal(false);
    dispatch({
      type: "VERIFY_BANK_ID_SUCCESS",
      payload: result,
    });
    sessionStorage.setItem("@ponture-customer-bankid", JSON.stringify(result));

    // const open = window.open(window.origin + `/app/panel/viewOffers`);
    const a = document.createElement("a");
    a.href = window.origin + `/app/panel/viewOffers`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // if (open == null || typeof open == "undefined")
    //   props.history.push("/app/panel/viewOffers");
  }
  function handleCancelVerify() {
    track(
      "BankID Failed",
      "Customer Portal",
      "Customer Portal login bankid popup",
      0
    );
    toggleVerifyModal(false);
    cancelVerify()
      .onOk((result) => {})
      .call(startResult ? startResult.orderRef : null);
  }
  function handleTermChanged(e) {
    toggleTerms(e.target.checked);
  }
  return (
    <div className="loginContainer">
      <div className="loginHeader">
        <img src={require("assets/logo-c.png")} alt="" />
      </div>
      <div className="loginBox animated fadeIn">
        <div className="loginBox__header">
          <span>{t("LOGIN_TITLE")}</span>
        </div>
        <form onSubmit={handleLoginClicked}>
          <div className="loginBox__body__info">
            <span className="firstText">{t("LOGIN_TITLE1")}</span>
            <ul>
              <li>{t("LOGIN_INFO_ITEM1")}</li>
              <li>{t("LOGIN_INFO_ITEM2")}</li>
              <li>{t("LOGIN_INFO_ITEM3")}</li>
            </ul>
            <span className="secText">{t("LOGIN_TITLE2")}</span>
            <span className="thirdText">{t("LOGIN_TITLE3")}</span>
          </div>
          <div
            className={
              "formInput " +
              (error &&
              error["personalNumber"] &&
              error["personalNumber"].isError
                ? "input-invalid"
                : "")
            }
          >
            <div className="formInput__header">
              <div className="formInput__header__left">
                <span className="elementInfo">
                  {t("LOGIN_PERSONAL_NUMBER")}
                </span>
              </div>
            </div>
            <div className="formInput__body">
              <input
                type="text"
                className="element"
                placeholder={t("PERSONAL_NUMBER_PLACEHOLDER")}
                value={personalNumber}
                onChange={handleChangedPersonalNumber}
                onBlur={handleChangedPersonalNumber}
                autoFocus
                maxLength="13"
                autoComplete="true"
              />
            </div>
            <div className="formInput__footer">
              <div className="formInput__footer__left">
                <span className="elementInfo">
                  {error &&
                    error["personalNumber"] &&
                    error["personalNumber"].isError &&
                    error["personalNumber"].message}
                </span>
              </div>
            </div>
          </div>
          <div className="termChk">
            <label className="customCheckbox">
              <input
                type="checkbox"
                id="terms"
                checked={terms}
                onChange={handleTermChanged}
              />
              <span className="checkmark" />
              <span className="customCheckbox__text">
                {t("LOGIN_TERMS_TEXT")}{" "}
                <a
                  href="https://www.ponture.com/eula"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("LOGIN_TERMS_LINK")}
                </a>
              </span>
            </label>
          </div>
          <button
            className="btn btn-success"
            disabled={!terms || !personalNumber || personalNumber.length === 0}
          >
            {!loading ? t("LOGIN_BTN_NAME") : <CircleSpinner show={true} />}
          </button>
        </form>
      </div>
      {verifyModal && (
        <VerifyBankIdModal
          isLogin
          startResult={startResult}
          personalNumber={personalNumber}
          onSuccess={handleSuccessVerify}
          onClose={handleCancelVerify}
          onCancelVerify={handleCancelVerify}
        />
      )}
    </div>
  );
};

export default Login;
