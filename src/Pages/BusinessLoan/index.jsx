import React, { useState, useEffect, useCallback, useMemo } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Select, { components } from "react-select";
import CircleSpinner from "./../../components/CircleSpinner";
import {
  useGlobalState,
  useLocale,
  useCookie,
  useLayout,
  useTheme,
  useNumberRegex,
} from "./../../hooks";
import "./styles.scss";
import {
  getToken,
  verifyPersonalNumber,
  getCompanies,
} from "./../../api/business-loan-api";

const loanReasonOptions = [
  { id: "1", title: { sv: "Renovering", fa: "Renovering" } },
  { id: "2", title: { sv: "Förvärvsköp", fa: "Förvärvsköp" } },
  { id: "3", title: { sv: "Anställa personal", fa: "Anställa personal" } },
  { id: "4", title: { sv: "Oväntade utgifter", fa: "Oväntade utgifter" } },
  { id: "5", title: { sv: "Finansiera skulder", fa: "Finansiera skulder" } },
  {
    id: "6",
    selected: true,
    title: {
      sv: "Generell likviditet",
      fa: "Generell likviditet",
    },
  },
  { id: "7", title: { sv: "Inköp av lager", fa: "Inköp av lager" } },
  { id: "8", title: { sv: "Oväntade utgifter", fa: "Oväntade utgifter" } },
  { id: "9", title: { sv: "Marknadsföring", fa: "Marknadsföring" } },
  { id: "10", title: { sv: "Säsongsinvestering", fa: "Säsongsinvestering" } },
  {
    id: "11",
    title: { sv: "Fastighetsfinansiering", fa: "Fastighetsfinansierin" },
  },
  { id: "12", title: { sv: "Övrigt", fa: "Övrigt" } },
];
const companies_orgs = [
  {
    id: "1",
    company: { sv: "Renovering", fa: "Renovering" },
    orgNumber: 3456765434,
  },
  {
    id: "2",
    company: { sv: "Förvärvsköp", fa: "Förvärvsköp" },
    orgNumber: 3456765434,
  },
  {
    id: "3",
    company: { sv: "Anställa personal", fa: "Anställa personal" },
    orgNumber: 3456765434,
  },
  {
    id: "4",
    company: { sv: "Oväntade utgifter", fa: "Oväntade utgifter" },
    orgNumber: 3456765434,
  },
  {
    id: "5",
    company: { sv: "Finansiera skulder", fa: "Finansiera skulder" },
    orgNumber: 3456765434,
  },
  {
    id: "6",
    company: {
      sv: "Generell likviditet",
      fa: "Generell likviditet",
    },
    orgNumber: 3456765434,
  },
];

const loanAmountMax = 10000000;
const loanAmountMin = 10000;
const loanPeriodStep = 1;
const loanPeriodMax = 60;
const loanPeriodMin = 1;

function isBankId(bankId) {
  const personalNumber_regex = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
  return personalNumber_regex.test(bankId);
}
const myInputPattern = /^([0-9]*[-]?)[0-9]*$/;

function useRegexedString(defaultValue) {
  const [str, _setStr] = React.useState(defaultValue);
  const setStr = useCallback(
    newStr =>
      newStr.match(myInputPattern) && _setStr(newStr) && [myInputPattern]
  );
  return [str, setStr];
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isPhoneNumber(phoneNumber) {
  // var p = /^(( ( (0{2}?) | (\+) {1}) 46)|0)7[\d]{8}/;
  var p = /^((((0{2}?)|(\+){1})?46)|0)[\d]{8}/;
  return p.test(phoneNumber);
}
function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// =====================================================================
export default function BusinessLoan(props) {
  let didCancel = false;

  const [{ b_loan_moreInfo_visibility }, dispatch] = useGlobalState();
  const [_loanAmount, _setLoanAmount] = useCookie("_loanAmount");
  const [_loanPeriod, _setLoanPeriod] = useCookie("_loanPeriod");
  const [_loanReasons, _setLoanReasons] = useCookie("_loanReasons");
  const [_loanReasonOther, _setLoanReasonOther] = useCookie("_loanReasonOther");
  const [_personalNumber, _setPersonalNumber] = useCookie("_personalNumber");
  const [_phoneNumber, _setPhoneNumber] = useCookie("_phoneNumber");
  const [_email, _setEmail] = useCookie("_email");

  const formInitValues = {
    loanAmount:
      _loanAmount && _loanAmount.length > 0 ? parseInt(_loanAmount) : 3500000,
    loanPeriod:
      _loanPeriod && _loanPeriod.length > 0 ? parseInt(_loanPeriod) : 12,
    loanReasons:
      _loanReasons && _loanReasons.length > 0
        ? JSON.parse(_loanReasons)
        : loanReasonOptions,
    loanReasonOtherDesc:
      _loanReasonOther && _loanReasonOther.length > 0 ? _loanReasonOther : "",
    personalNumber:
      _personalNumber && _personalNumber.length > 0
        ? _personalNumber
        : undefined,
    company: undefined,
    phoneNumber: _phoneNumber && _phoneNumber.length > 0 ? _phoneNumber : "",
    email: _email && _email.length > 0 ? _email : "",
    terms: false,
  };
  const { t, appLocale, currentLang } = useLocale();

  const [tab, setTab] = useState(1);
  const [loanAmount, setLoanAmount] = useState(formInitValues.loanAmount);
  const [loanAmountDisplay, setLoanAmountDisplay] = useState(
    formInitValues.loanAmount
  );
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(formInitValues.loanPeriod);
  const [loanReasons, setLoanReasons] = useState(formInitValues.loanReasons);
  const [loanReasonOther, setLoanReasonOther] = useState(
    formInitValues.loanReasonOther
  );
  const [loanReasonOtherVisiblity, toggleOtherLoanVisibility] = useState();
  const [otherReasonIsValid, toggleOtherReasonValidation] = useState(true);
  const [
    otherReasonValidationMessage,
    setOtherReasonValidationMessage,
  ] = useState();
  const [personalNumber, setPersonalNumber] = useRegexedString(
    formInitValues.personalNumber
  );
  const [personalNumberIsValid, togglePersonalNumberValidation] = useState(
    true
  );
  const [
    personalNumberValidationMessage,
    setPersonalNumberValidationMessage,
  ] = useState();
  const [companies, setCompanies] = useState();
  const [selectedCompany, setCompany] = useState();
  const [phoneNumber, setPhoneNumber] = useNumberRegex(
    formInitValues.phoneNumber
  );
  const [phoneNumberIsValid, togglePhoneNumberValidation] = useState(true);
  const [
    phoneNumberValidationMessage,
    setPhoneNumberValidationMessage,
  ] = useState();
  const [personalNumberSpinner, togglePersonalNumberSpinner] = useState(false);
  const [email, setEmail] = useState(formInitValues.email);
  const [emailIsValid, toggleEmailValidation] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState();
  const [terms, toggleTermsChecked] = useState(false);
  const [termValidation, toggleTermValidaiton] = useState(false);
  const [form, setForm] = useState(formInitValues);
  const [verifyingSpinner, toggleVerifyingSpinner] = useState(false);

  useEffect(() => {
    const error = getParameterByName("error");
    const relaystate = getParameterByName("relaystate");
    if (relaystate && (!error || error === false)) {
      getToken()
        .onOk(result => {
          if (!didCancel) {
            const token = result.access_token ? result.access_token : "";
            const pId = personalNumber ? personalNumber : "";
            getCompanies()
              .onOk(result => {
                if (!didCancel) {
                  setCompanies(result);
                  // toggleVerifyingSpinner(false);
                }
              })
              .onServerError(result => {
                if (!didCancel) {
                  // toggleVerifyingSpinner(false);
                }
              })
              .onBadRequest(result => {
                if (!didCancel) {
                  //  toggleVerifyingSpinner(false);
                }
              })
              .unAuthorized(result => {
                if (!didCancel) {
                  // toggleVerifyingSpinner(false);
                }
              })
              .unKnownError(result => {
                if (!didCancel) {
                  //  toggleVerifyingSpinner(false);
                }
              })
              .onRequestError(result => {
                if (!didCancel) {
                  //  toggleVerifyingSpinner(false);
                }
              })

              .call(token, pId);
          }
        })
        .onServerError(result => {
          if (!didCancel) {
            toggleVerifyingSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Server Error",
              },
            });
          }
        })
        .onBadRequest(result => {
          if (!didCancel) {
            toggleVerifyingSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Bad Request",
              },
            });
          }
        })
        .unAuthorized(result => {
          if (!didCancel) {
            toggleVerifyingSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Un Authorized",
              },
            });
          }
        })
        .unKnownError(result => {
          if (!didCancel) {
            toggleVerifyingSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Unknown Error",
              },
            });
          }
        })
        .onRequestError(result => {
          if (!didCancel) {
            toggleVerifyingSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: result.message,
              },
            });
          }
        })
        .call();
    }
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    setLoanAmountDisplay(
      loanAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }, [loanAmount]);

  const handleLoanAmount = useCallback(
    val => {
      setLoanAmount(val);
      _setLoanAmount(val);
      if (val <= 100000) {
        setLoanAmountStep(5000);
      } else if (val <= 500000) {
        setLoanAmountStep(25000);
      } else if (val <= 1000000) {
        setLoanAmountStep(50000);
      } else {
        setLoanAmountStep(125000);
      }
    },
    [loanAmount]
  );

  const handleLoanPeriod = useCallback(
    val => {
      setLoanPeriod(val);
      _setLoanPeriod(val);
    },
    [loanPeriod]
  );

  const handleMinusLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        let result;
        if (step - loanAmountStep >= loanAmountMin)
          result = step - loanAmountStep;
        result = loanAmountMin;
        _setLoanAmount(result);
        return result;
      });
    },
    [loanAmount]
  );
  const handleAddLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        let result;
        if (step + loanAmountStep <= loanAmountMax)
          result = step + loanAmountStep;
        result = loanAmountMax;
        _setLoanAmount(result);
        return result;
      });
    },
    [loanAmount]
  );
  const handleMinusLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        let result;
        if (step - loanPeriodStep >= loanPeriodMin)
          result = step - loanPeriodStep;
        result = loanPeriodMin;
        _setLoanPeriod(result);
        return result;
      });
    },
    [loanPeriod]
  );
  const handleAddLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        let result;
        if (step + loanPeriodStep <= loanPeriodMax)
          result = step + loanPeriodStep;
        result = loanPeriodMax;
        _setLoanPeriod(result);
        return result;
      });
    },
    [loanPeriod]
  );
  const handleReasonSelect = useCallback(
    reason => {
      const rList = loanReasons.map(item => {
        if (item.id === reason.id) {
          item.selected = !item.selected;
          if (reason.id === "12") {
            toggleOtherLoanVisibility(item.selected);
          }
        }
        return item;
      });
      let notSelected = true;
      for (let i = 0; i < loanReasons.length; i++) {
        const element = loanReasons[i];
        if (element.selected === true) {
          notSelected = false;
          break;
        }
      }
      if (notSelected) {
        rList[5].selected = true;
      }
      setLoanReasons(rList);
      _setLoanReasons(JSON.stringify(rList));
    },
    [loanReasons]
  );

  const handleOtherReasonChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        toggleOtherReasonValidation(false);
        setOtherReasonValidationMessage(t("OTHER_REASON_IS_REQUIRED"));
      } else {
        toggleOtherReasonValidation(true);
        _setLoanReasonOther(e.target.value);
      }
      setLoanReasonOther(e.target.value);
    },
    [loanReasonOther, appLocale]
  );
  const handlePersonalNumberChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        togglePersonalNumberValidation(false);
        setPersonalNumberValidationMessage(t("PERSONAL_NUMBER_IS_REQUIRED"));
      } else {
        if (!isBankId(e.target.value)) {
          togglePersonalNumberValidation(false);
          setPersonalNumberValidationMessage(t("PERSONAL_NUMBER_IN_CORRECT"));
        } else {
          togglePersonalNumberValidation(true);
          _setPersonalNumber(e.target.value);
          // _verifyPersonalNumber(e.target.value);
        }
      }
      setPersonalNumber(e.target.value);
    },
    [form, personalNumber, appLocale]
  );
  const handlePhoneNumberChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        togglePhoneNumberValidation(false);
        setPhoneNumberValidationMessage(t("PHONE_NUMBER_IS_REQUIRED"));
      } else togglePhoneNumberValidation(true);
      //  else {
      //   if (!isPhoneNumber(e.target.value)) {
      //     togglePhoneNumberValidation(false);
      //     setPhoneNumberValidationMessage(t("PHONE_NUMBER_IN_CORRECT"));
      //   } else togglePhoneNumberValidation(true);
      // }
      setPhoneNumber(e.target.value);
      _setPhoneNumber(e.target.value);
    },
    [phoneNumber, appLocale]
  );
  const handleEmailChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        toggleEmailValidation(false);
        setEmailValidationMessage(t("EMAIL_IS_REQUIRED"));
      } else {
        if (!validateEmail(e.target.value)) {
          toggleEmailValidation(false);
          setEmailValidationMessage(t("EMAIL_IN_CORRECT"));
        } else toggleEmailValidation(true);
      }
      setEmail(e.target.value);
      _setEmail(e.target.value);
    },
    [email, appLocale]
  );
  let chk;
  const handleTermChanged = useCallback(
    e => {
      toggleTermsChecked(e.target.checked);
      chk = e.target.checked;
      setForm(f => {
        const newForm = { ...f, terms: chk };
        return newForm;
      });
      toggleTermValidaiton(!chk);
    },
    [terms]
  );
  const handleSelectCompany = useCallback(
    c => {
      setCompany(c);
    },
    [selectedCompany]
  );
  const handleBankIdClicked = useCallback(
    e => {
      if (!personalNumber) {
        handlePersonalNumberChanged({
          target: { value: personalNumber ? personalNumber : "" },
        });
      } else {
        toggleVerifyingSpinner(true);
        // props.history.push("/verifyBankId/" + personalNumber);
        verifyPersonalNumber()
          .onOk(result => {
            if (!didCancel)
              if (result) {
                window.location.replace(result.link);
              }
          })
          .onServerError(result => {
            if (!didCancel) {
              toggleVerifyingSpinner(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: "Server Error",
                },
              });
            }
          })
          .onBadRequest(result => {
            if (!didCancel) {
              toggleVerifyingSpinner(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: "Bad Request",
                },
              });
            }
          })
          .unAuthorized(result => {
            if (!didCancel) {
              toggleVerifyingSpinner(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: "Un Authorized",
                },
              });
            }
          })
          .unKnownError(result => {
            if (!didCancel) {
              toggleVerifyingSpinner(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: "Unknown Error",
                },
              });
            }
          })
          .onRequestError(result => {
            if (!didCancel) {
              toggleVerifyingSpinner(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: result ? result : "",
                },
              });
            }
          })
          .call(personalNumber);
      }
    },
    [appLocale, personalNumber]
  );
  function handleSubmitClicked() {
    handlePersonalNumberChanged({
      target: { value: personalNumber ? personalNumber : "" },
    });
    handlePhoneNumberChanged({
      target: { value: phoneNumber ? phoneNumber : "" },
    });
    handleEmailChanged({
      target: { value: email ? email : "" },
    });
    if (loanReasonOtherVisiblity) {
      handleOtherReasonChanged({
        target: { value: loanReasonOther ? loanReasonOther : "" },
      });
    }
    toggleTermValidaiton(!form["terms"]);
  }
  return (
    <div className="bl">
      <div className="bl__header">
        <div className="bl__logo">
          <img src={require("./../../assets/logo-c.png")} alt="logo" />
        </div>
      </div>
      <div className="bl__content">
        {tab === 1 && (
          <div className="bl__form">
            <div className="bl__mainform">
              <div className="bl__form__header">
                <div className="bl__form__circleIcon">
                  <i className="icon-request" />
                </div>
                <span>{t("BISINUSS_LOAN")}</span>
              </div>
              <div className="bl__input --sliderInput animated fadeIn">
                <div className="bl__input__header">
                  <label className="bl__input__label bl__input__sliderLabel">
                    {t("BL_LOAN_AMOUNT")}
                  </label>
                  <span className="bl__input__label bl__input__sliderLabel loanAmountValue">
                    {loanAmountDisplay + " kr"}
                  </span>
                </div>

                <div className="bl__rangeElement">
                  <div
                    className="rangeElement__left"
                    onClick={handleMinusLoanAmount}
                  >
                    <span className="icon-minus" />
                  </div>
                  <div className="rangeElement__center">
                    <InputRange
                      formatLabel={value => `${value} kr`}
                      step={loanAmountStep}
                      track="slider"
                      maxValue={loanAmountMax}
                      minValue={loanAmountMin}
                      value={loanAmount}
                      onChange={handleLoanAmount}
                    />
                  </div>
                  <div
                    className="rangeElement__right"
                    onClick={handleAddLoanAmount}
                  >
                    <span className="icon-add" />
                  </div>
                </div>
              </div>
              <div className="bl__input --sliderInput animated fadeIn">
                <label className="bl__input__label bl__input__sliderLabel">
                  {t("BL_LOAN_PERIOD")}
                </label>
                <div className="bl__rangeElement">
                  <div
                    className="rangeElement__left"
                    onClick={handleMinusLoanPeriod}
                  >
                    <span className="icon-minus" />
                  </div>
                  <div className="rangeElement__center">
                    <InputRange
                      formatLabel={value => `${value} ${t("MONTH")}`}
                      step={loanPeriodStep}
                      maxValue={loanPeriodMax}
                      minValue={loanPeriodMin}
                      value={loanPeriod}
                      onChange={handleLoanPeriod}
                    />
                  </div>
                  <div
                    className="rangeElement__right"
                    onClick={handleAddLoanPeriod}
                  >
                    <span className="icon-add" />
                  </div>
                </div>
              </div>
              <div className="bl__input animated fadeIn">
                <label className="bl__input__label">
                  {t("BL_REASON_LOAN")}
                </label>
                <div className="options">
                  {loanReasons.map(r => (
                    <div
                      key={r.id}
                      className={"btnReason " + (r.selected ? "--active" : "")}
                      onClick={() => handleReasonSelect(r)}
                    >
                      {r.title[currentLang]}
                      {r.selected && (
                        <div className="btnReason__active">
                          <span className="icon-checkmark" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {loanReasonOtherVisiblity && (
                <div
                  className={
                    "bl__input animated fadeIn " +
                    (!otherReasonIsValid ? "--invalid" : "")
                  }
                >
                  <label className="bl__input__label">
                    {t("BL_REASON_LOAN_OTHER")}
                  </label>
                  <div className="bl__input__element">
                    <div className="element-group">
                      <div className="element-group__center">
                        <input
                          type="text"
                          className="my-input"
                          value={loanReasonOther}
                          onChange={handleOtherReasonChanged}
                        />
                      </div>
                    </div>
                    {!otherReasonIsValid && (
                      <span className="validation-messsage">
                        {otherReasonValidationMessage}
                      </span>
                    )}
                  </div>
                </div>
              )}
              <div
                className={
                  "bl__input animated fadeIn " +
                  (!personalNumberIsValid ? "--invalid" : "")
                }
              >
                <label className="bl__input__label">
                  {t("BL_PERSONAL_NUMBER")}
                </label>
                <div className="bl__input__element">
                  <div className="element-group">
                    <div className="element-group__center">
                      <input
                        type="text"
                        className="my-input"
                        placeholder={t("PERSONAL_NUMBER_PLACEHOLDER")}
                        value={personalNumber}
                        onChange={handlePersonalNumberChanged}
                        maxLength="13"
                        // disabled={personalNumberSpinner ? true : false}
                      />
                    </div>
                    {/* {personalNumberSpinner && (
                      <div className="element-group__left">
                        <CircleSpinner show={true} size="small" />
                      </div>
                    )} */}
                  </div>
                  {!personalNumberIsValid && (
                    <span className="validation-messsage">
                      {personalNumberValidationMessage}
                    </span>
                  )}
                </div>
              </div>
              {!b_loan_moreInfo_visibility && (
                <button
                  className="btn --success --large bankIdBtn"
                  onClick={handleBankIdClicked}
                >
                  {verifyingSpinner && (
                    <CircleSpinner show={true} size="small" />
                  )}
                  {!verifyingSpinner && <span>{t("BL_VERIFY_PID_BTN")}</span>}
                </button>
              )}
              {companies && companies.length > 0 && (
                <div className="bl__input animated fadeIn">
                  <label className="bl__input__label">
                    {t("BL_COMPANY_NAME")}&nbsp;{t("BL_ORGANIZATION_NAME")}
                  </label>
                  <div className="options">
                    {companies.map(c => (
                      <div
                        className={
                          "companyWidget " +
                          (selectedCompany && selectedCompany.id === c.id
                            ? "--active"
                            : "")
                        }
                        onClick={() => handleSelectCompany(c)}
                      >
                        <span>{c.company[currentLang]}</span>
                        <span className="companyWidget__orgNumber">
                          {c.orgNumber}
                        </span>
                        {selectedCompany && selectedCompany.id === c.id && (
                          <div className="companyWidget__active">
                            <span className="icon-checkmark" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {b_loan_moreInfo_visibility && (
              <div className="bl__contactInfo">
                <div className="bl__contactInfo__header">
                  <div className="bl__contactInfo__circleIcon">
                    <i className="icon-request" />
                  </div>
                  <span>{t("BL_CONTACT_BOX_TITLE")}</span>
                </div>
                <div
                  className={
                    "bl__input animated fadeIn " +
                    (!phoneNumberIsValid ? "--invalid" : "")
                  }
                >
                  <label className="bl__input__label">
                    {t("BL_PHONE_NUMBER")}
                  </label>
                  <div className="bl__input__element">
                    <div className="element-group">
                      <div className="element-group__left">
                        <span className="icon-phone" />
                      </div>
                      <div className="element-group__center">
                        <input
                          type="text"
                          className="my-input"
                          placeholder="00467902660255"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChanged}
                        />
                      </div>
                    </div>
                    {!phoneNumberIsValid && (
                      <span className="validation-messsage">
                        {phoneNumberValidationMessage}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={
                    "bl__input animated fadeIn " +
                    (!emailIsValid ? "--invalid" : "")
                  }
                >
                  <label className="bl__input__label">{t("BL_EMAIL")}</label>
                  <div className="bl__input__element">
                    <div className="element-group">
                      <div className="element-group__left">
                        <span className="icon-envelope" />
                      </div>
                      <div className="element-group__center">
                        <input
                          type="text"
                          className="my-input"
                          placeholder="example@mail.com"
                          value={email}
                          onChange={handleEmailChanged}
                        />
                      </div>
                    </div>
                    {!emailIsValid && (
                      <span className="validation-messsage">
                        {emailValidationMessage}
                      </span>
                    )}
                  </div>
                </div>
                <div className="bl__input animated fadeIn">
                  <label className="customCheckbox">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={terms}
                      onChange={handleTermChanged}
                    />
                    <span className="checkmark" />
                    <span className="customCheckbox__text">
                      {t("BL_TERMS")}{" "}
                      <a href="https://www.ponture.com/eula" target="_blank">
                        {t("BL_TERMS_LINK")}
                      </a>
                    </span>
                  </label>
                  {termValidation && (
                    <span className="validation-messsage">
                      {t("BL_TERMS_IS_REQUIRED")}
                    </span>
                  )}
                </div>
                <div className="bl__actions">
                  <button
                    className="btn --success"
                    onClick={handleSubmitClicked}
                  >
                    {t("SUBMIT")}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
