import React, { useState, useEffect } from "react";
//
import { useGlobalState, useLocale } from "hooks";
import CircleSpinner from "components/CircleSpinner";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { isBankId } from "utils";
import { startBankId } from "./../../api/business-loan-api";
import "./styles.scss";

const Login = props => {
  let didCancel = false;
  const { t } = useLocale();
  const [{}, dispatch] = useGlobalState();
  const [personalNumber, setPersonalNumber] = useState("");
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState();
  const [verifyModal, toggleVerifyModal] = useState();
  const [startResult, setStartResult] = useState();

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
        message: t("PERSONAL_NUMBER_IS_REQUIRED")
      };
      setError(err);
    } else {
      if (!isBankId(e.target.value)) {
        let err = { ...error };
        err["personalNumber"] = {
          isError: true,
          message: t("PERSONAL_NUMBER_IN_CORRECT")
        };
        setError(err);
      } else {
        let err = { ...error };
        err["personalNumber"] = {
          isError: false
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
        .onOk(result => {
          if (!didCancel) {
            toggleLoading(false);
            setStartResult(result);
            toggleVerifyModal(true);
          }
        })
        .onServerError(result => {
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Server Error"
              }
            });
          }
        })
        .onBadRequest(result => {
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Bad Request"
              }
            });
          }
        })
        .unAuthorized(result => {
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Un Authorized"
              }
            });
          }
        })
        .unKnownError(result => {
          if (!didCancel) {
            toggleLoading(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Unknown Error"
              }
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
      payload: result
    });
    props.history.push("/app/panel/myApplications");
  }
  function handleCancelVerify() {
    toggleVerifyModal(false);
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
          <div className="loginBox__body__info">{t("LOGIN_INFO")}</div>
          <div
            className={
              "formInput " +
              (error &&
              error["personalNumber"] &&
              error["personalNumber"].isError
                ? "--invalid"
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
          <button
            className="btn --success"
            disabled={!personalNumber || personalNumber.length === 0}
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
