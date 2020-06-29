import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdBusiness } from "react-icons/io";
import Empty from "components/Commons/ErrorsComponent/EmptySVG";
import { useGlobalState, useLocale } from "hooks";
import CircleSpinner from "components/CircleSpinner";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { isBankId } from "utils";
import track from "utils/trackAnalytic";
import batchStates from "utils/batchStates";
import { startBankId, cancelVerify } from "api/business-loan-api";
import { customerLogin } from "api/main-api";
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
  const [showCompanies, toggleCompaniesBox] = useState(false);
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
    toggleCompaniesBox(true);
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
        message: t("ERROR_OCCURRED"),
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
          setCompanies([]);
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
        showError();
      })
      .onBadRequest((result) => {
        toggleCompaniesSpinner(false);
        showError();
      })
      .notFound((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        showError();
      })
      .onRequestError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        showError();
      })
      .unKnownError((result) => {
        track("Failure", "Customer Portal v2", "Customer Portal", 0);
        toggleCompaniesSpinner(false);
        showError();
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
      <div className="loginBox animated fadeIn">
        <div className="loginBox__header">
          <span>
            {!showCompanies ? t("LOGIN_TITLE") : t("Choose a company")}
          </span>
        </div>
        {showCompanies ? (
          <div className="loginBox__companies">
            {companiesSpinner || (companies && companies.length) ? (
              <span className="loginBox__companies__desc">
                You have many offers associated with different companies. to see
                offers choose a company
              </span>
            ) : null}
            <div className="loginBox__companies__content">
              {companiesSpinner ? (
                <div className="companiesSpinner">
                  <CircleSpinner show={true} size="large" bgColor="#44b3c2" />
                  <h3>{t("Loading Companies...")}</h3>
                </div>
              ) : !companies || companies.length === 0 ? (
                <div className="emptyCompanies">
                  <Empty />
                  <span>
                    You have not applied any applications yet. click below link
                    to apply your first application
                  </span>
                  <Link to="/app/loan/">Open Apply Form</Link>
                </div>
              ) : (
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
        ) : (
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
        )}
      </div>
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
