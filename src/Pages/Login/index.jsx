import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdBusiness } from "react-icons/io";
import { useGlobalState, useLocale } from "hooks";
import EmptyCompanies from "./EmptyCompanies";
import ErrorBox from "components/ErrorBox";
import CircleSpinner from "components/CircleSpinner";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { isBankId } from "utils";
import track from "utils/trackAnalytic";
import batchStates from "utils/batchStates";
import { startBankId, cancelVerify } from "api/business-loan-api";
import { customerLogin } from "api/main-api";
import "./styles.scss";

const boxes = {
  form: "LOGIN_FORM",
  companies: "LOGIN_LOAD_COMPANIES",
  emptyCompanies: "LOGIN_COMPANIES_EMPTY",
  errorBox: "LOGIN_COMPANIES_ERROR",
};

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
  const [currentBox, setCurrentBox] = useState(boxes.form);
  const [companies, setCompanies] = useState([]);
  const [companiesSpinner, toggleCompaniesSpinner] = useState(true);

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
              "Customer Portal v2",
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
          track("Failure", "Customer Portal v2", "Customer Portal", 0);
          if (!didCancel) {
            toggleLoading(false);
            showError();
          }
        })
        .onBadRequest((result) => {
          track("Failure", "Customer Portal v2", "Customer Portal", 0);
          if (!didCancel) {
            toggleLoading(false);
            showError();
          }
        })
        .unAuthorized((result) => {
          track("Failure", "Customer Portal v2", "Customer Portal", 0);
          if (!didCancel) {
            toggleLoading(false);
            showError();
          }
        })
        .unKnownError((result) => {
          track("Failure", "Customer Portal v2", "Customer Portal", 0);
          if (!didCancel) {
            toggleLoading(false);
            showError();
          }
        })
        .call(pId);
    }
  }

  function handleSuccessVerify(result) {
    track(
      "BankID Verified",
      "Customer Portal v2",
      "Customer Portal login bankid popup",
      0
    );
    toggleVerifyModal(false);
    setCurrentBox(boxes.companies);
    checkCompanies(result);

    // const open = window.open(window.origin + `/app/panel/viewOffers`);
    // if (!window.location.origin) {
    //   window.location.origin =
    //     window.location.protocol +
    //     "//" +
    //     window.location.hostname +
    //     (window.location.port ? ":" + window.location.port : "");
    // }
    // const a = document.createElement("a");
    // a.href = window.location.origin + `/app/panel/viewOffers/`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // if (open == null || typeof open == "undefined")
    //   props.history.push("/app/panel/viewOffers");
  }
  function handleCancelVerify() {
    toggleVerifyModal(false);
    cancelVerify()
      .unKnownError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
      })
      .call(startResult ? startResult.orderRef : null);
  }
  function handleTermChanged(e) {
    toggleTerms(e.target.checked);
  }
  function showError() {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: "error",
        message: t("LOGIN_COMPANIES_ERROR_TITLE"),
      },
    });
  }
  const checkCompanies = (verifyInfo) => {
    toggleCompaniesSpinner(true);
    const obj = {
      id: verifyInfo.id,
      errors: verifyInfo.error,
      progressStatus: verifyInfo.progressStatus,
      signature: verifyInfo.signature,
      userInfo: verifyInfo.userInfo,
      ocspResponse: verifyInfo.ocspResponse,
      LookupPersonAddressStatus: verifyInfo.LookupPersonAddressStatus,
      status: verifyInfo.status,
    };
    customerLogin()
      .onOk((result) => {
        dispatch({
          type: "VERIFY_BANK_ID_SUCCESS",
          payload: verifyInfo,
        });
        sessionStorage.setItem(
          "@ponture-customer-bankid",
          JSON.stringify(verifyInfo)
        );
        dispatch({
          type: "SET_USER_INFO",
          payload: result,
        });
        toggleCompaniesSpinner(false);
        if (!result || !result.companies || result.companies.length === 0) {
          setCurrentBox(boxes.emptyCompanies);
        } else {
          if (result.companies.length === 1) {
            props.history.push(
              `/app/panel/offers/${result.companies[0].orgNumber}`
            );
          } else {
            setCompanies(result.companies);
          }
        }
      })
      .onServerError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        setCurrentBox(boxes.errorBox);
      })
      .onBadRequest((result) => {
        toggleCompaniesSpinner(false);
        setCurrentBox(boxes.errorBox);
      })
      .notFound((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        setCurrentBox(boxes.errorBox);
      })
      .onRequestError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        setCurrentBox(boxes.errorBox);
      })
      .unKnownError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        setCurrentBox(boxes.errorBox);
      })
      .call(obj);
  };
  function handleLogoClicked() {
    window.location.href = "https://www.ponture.com/";
  }
  return (
    <div className="loginContainer">
      <div className="loginHeader">
        <img
          src={require("assets/logo-c.png")}
          alt=""
          onClick={handleLogoClicked}
        />
      </div>

      {currentBox === boxes.form ? (
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
                <span className="customCheckbox__text customCheckboxLogin__text">
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
              disabled={
                !terms || !personalNumber || personalNumber.length === 0
              }
            >
              {!loading ? t("LOGIN_BTN_NAME") : <CircleSpinner show={true} />}
            </button>
          </form>
        </div>
      ) : currentBox === boxes.companies ? (
        <div className="loginBox animated fadeIn">
          {companies && companies.length > 1 && (
            <div className="loginBox__header">
              <span>{t("LOGIN_COMPANIES_TITLE")}</span>
            </div>
          )}
          <div className="loginBox__companies">
            <div className="loginBox__companies__content">
              {companiesSpinner ? (
                <div className="companiesSpinner">
                  <CircleSpinner show={true} size="large" bgColor="#44b3c2" />
                  <h3>{t("LOGIN_COMPANIES_LOADING_TEXT")}</h3>
                </div>
              ) : (
                companies &&
                companies.map((item) => {
                  return (
                    <Link
                      key={item.orgNumber}
                      className="companyItem"
                      to={`/app/panel/offers/${item.orgNumber}`}
                    >
                      <IoMdBusiness className="companyItem__icon" />
                      {item.orgName}
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : currentBox === boxes.emptyCompanies ? (
        <EmptyCompanies />
      ) : currentBox === boxes.errorBox ? (
        <ErrorBox title={t("LOGIN_COMPANIES_ERROR_TITLE")} />
      ) : null}
      {verifyModal && (
        <VerifyBankIdModal
          isLogin
          startResult={startResult}
          personalNumber={personalNumber}
          onSuccess={handleSuccessVerify}
          onClose={handleCancelVerify}
          onCancelVerify={handleCancelVerify}
          onFailedBankId={() => {
            track(
              "BankID Failed",
              "Customer Portal v2",
              "Customer Portal login bankid popup",
              0
            );
          }}
        />
      )}
    </div>
  );
};

export default Login;
