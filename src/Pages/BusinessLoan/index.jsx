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
  verifyPersonalNumber,
  getCompanies,
  submitLoan,
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

function isNumber(number) {
  var p = /^[0-9]*$/;
  return p.test(number);
}
function isPersonalNumber(pId) {
  const p = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
  return p.test(pId);
}

function isPhoneNumber(phone) {
  const p = /^((\+)|[0-9]*)[0-9]*$/;
  return p.test(phone);
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

  const [token, setToken] = useCookie("token");
  const [_loanAmount, _setLoanAmount] = useCookie("_loanAmount");
  const [_loanPeriod, _setLoanPeriod] = useCookie("_loanPeriod");
  const [_loanReasons, _setLoanReasons] = useCookie("_loanReasons");
  const [_loanReasonOther, _setLoanReasonOther] = useCookie("_loanReasonOther");
  const [_personalNumber, _setPersonalNumber] = useCookie("_personalNumber");
  const [_phoneNumber, _setPhoneNumber] = useCookie("_phoneNumber");
  const [_email, _setEmail] = useCookie("_email");

  let formInitValues = {
    loanAmount:
      _loanAmount && _loanAmount.length > 0 && isNumber(_loanAmount)
        ? parseInt(_loanAmount)
        : 3500000,
    loanPeriod:
      _loanPeriod && _loanPeriod.length > 0 && isNumber(_loanPeriod)
        ? parseInt(_loanPeriod)
        : 12,
    loanReasonOtherDesc:
      _loanReasonOther && _loanReasonOther.length > 0
        ? _loanReasonOther
        : undefined,
    personalNumber:
      _personalNumber &&
      _personalNumber.length > 0 &&
      isPersonalNumber(_personalNumber)
        ? _personalNumber
        : undefined,
    company: undefined,
    phoneNumber:
      _phoneNumber && _phoneNumber.length > 0 && isPhoneNumber(_phoneNumber)
        ? _phoneNumber
        : "",
    email: _email && _email.length > 0 && validateEmail(_email) ? _email : "",
    terms: false,
  };
  if (_loanReasons && _loanReasons.length > 0 && _loanReasons !== "undefined") {
    try {
      const a = JSON.parse(_loanReasons);
      if (Array.isArray(a)) {
        formInitValues["loanReasons"] = a;
      } else {
        formInitValues["loanReasons"] = loanReasonOptions;
      }
    } catch (error) {
      formInitValues["loanReasons"] = loanReasonOptions;
    }
  } else {
    formInitValues["loanReasons"] = loanReasonOptions;
  }

  const { t, appLocale, currentLang } = useLocale();

  const [tab, changeTab] = useState(1);
  const [relayState, setRelayState] = useState();
  const [isErrorBankId, taggleIsErrorBankId] = useState(true);
  const [loanAmount, setLoanAmount] = useState(formInitValues.loanAmount);
  const [loanAmountDisplay, setLoanAmountDisplay] = useState(
    formInitValues.loanAmount
  );
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(formInitValues.loanPeriod);
  const [loanReasons, setLoanReasons] = useState(formInitValues.loanReasons);
  const [loanReasonOther, setLoanReasonOther] = useState(() => {
    for (let i = 0; i < formInitValues.loanReasons.length; i++) {
      const l = formInitValues.loanReasons[i];
      if (l.id === "12") {
        if (l.selected === true) {
          return formInitValues.loanReasonOtherDesc;
        } else {
          return "";
        }
      }
    }
    return "";
  });
  const [loanReasonOtherVisiblity, toggleOtherLoanVisibility] = useState(() => {
    for (let i = 0; i < formInitValues.loanReasons.length; i++) {
      const l = formInitValues.loanReasons[i];
      if (l.id === "12") {
        if (l.selected === true) return true;
        return false;
      }
    }
    return false;
  });
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
  const [submitSpinner, toggleSubmitSpinner] = useState(false);

  useEffect(() => {
    const error = getParameterByName("error");
    const relaystate = getParameterByName("relaystate");
    if (relaystate) {
      setRelayState(relaystate);
      props.history.push("");
      if (!error || error === "false") {
        const pId = personalNumber ? personalNumber : "";
        dispatch({
          type: "TOGGLE_B_L_MORE_INFO",
          value: true,
        });
        taggleIsErrorBankId(false);
        const access_token = process.env.REACT_APP_TOEKN
          ? process.env.REACT_APP_TOEKN
          : token;
        _getCompanies(access_token, relaystate, pId);
      } else {
        dispatch({
          type: "TOGGLE_B_L_MORE_INFO",
          value: true,
        });
      }
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

  function _getCompanies(access_token, relaystate, pId) {
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
      .call(access_token, relaystate, pId);
  }
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
            if (!item.selected) {
              setLoanReasonOther("");
              _setLoanReasonOther("");
            }
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
      }
      setLoanReasonOther(e.target.value);
      _setLoanReasonOther(e.target.value);
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
      if (!verifyingSpinner) {
        if (!personalNumber) {
          handlePersonalNumberChanged({
            target: { value: personalNumber ? personalNumber : "" },
          });
        } else {
          // props.history.push("/verifyBankId/" + personalNumber);
          toggleVerifyingSpinner(true);
          const pId = personalNumber.replace("-", "");
          verifyPersonalNumber()
            .onOk(result => {
              if (!didCancel)
                if (result) {
                  if (result.link) window.location.replace(result.link);
                  if (result.access_token) setToken(result.access_token);
                }
              toggleVerifyingSpinner(false);
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
            .call(pId);
        }
      }
    },
    [appLocale, personalNumber]
  );
  function handleSubmitClicked() {
    if (
      !personalNumber ||
      personalNumber.length === 0 ||
      (loanReasonOtherVisiblity &&
        (!loanReasonOther || loanReasonOther.length === 0)) ||
      phoneNumber.length === 0 ||
      email.length === 0 ||
      !terms
    ) {
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
    } else {
      toggleSubmitSpinner(true);

      let needs = [];
      for (let i = 0; i < loanReasons.length; i++) {
        const l = loanReasons[i];
        if (l.selected === true) {
          needs.push(l.id);
        }
      }
      let pID = personalNumber;
      if (!pID.includes("-")) {
        pID = pID.slice(0, pID.length - 4) + "-" + pID.slice(pID.length - 4);
      }
      const obj = {
        orgNumber: selectedCompany ? selectedCompany.CID : "",
        personalNumber: pID,
        amount: parseInt(loanAmount),
        amourtizationPeriod: parseInt(loanPeriod),
        need: needs,
        needDescription: loanReasonOther,
        email: email,
        phoneNumber: phoneNumber,
      };
      const access_token = process.env.REACT_APP_TOEKN
        ? process.env.REACT_APP_TOEKN
        : token;
      submitLoan()
        .onOk(result => {
          if (!didCancel) {
            changeTab(2);
            _setLoanAmount();
            _setLoanPeriod();
            _setLoanReasonOther();
            _setLoanReasons();
            _setPersonalNumber();
          }
        })
        .onServerError(result => {
          if (!didCancel) {
            toggleSubmitSpinner(false);
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
            toggleSubmitSpinner(false);
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
            toggleSubmitSpinner(false);
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
            toggleSubmitSpinner(false);
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
            toggleSubmitSpinner(false);
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: result ? result : "",
              },
            });
          }
        })
        .call(access_token, relayState, obj);
    }
  }

  return (
    <div className="bl">
      <div className="bl__header">
        <div className="bl__logo">
          <img src={require("./../../assets/logo-c.png")} alt="logo" />
        </div>
      </div>
      <div className="bl__content">
        <div className="bl__form">
          {tab === 1 && (
            <>
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
                        className={
                          "btnReason " + (r.selected ? "--active" : "")
                        }
                        onClick={() => handleReasonSelect(r)}
                      >
                        <div className="btnReason__title">
                          {r.title && r.title[currentLang]}
                        </div>
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
                          disabled={b_loan_moreInfo_visibility ? true : false}
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
                            (selectedCompany && selectedCompany.CID === c.CID
                              ? "--active"
                              : "")
                          }
                          onClick={() => handleSelectCompany(c)}
                          title={c.Cname}
                        >
                          <div className="companyWidget__cName">{c.Cname}</div>
                          <span className="companyWidget__orgNumber">
                            {c.CID}
                          </span>
                          {selectedCompany && selectedCompany.CID === c.CID && (
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
                  <div className="userInputs">
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
                      <label className="bl__input__label">
                        {t("BL_EMAIL")}
                      </label>
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
                  </div>

                  <div className="bl__input termChk animated fadeIn">
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
                      {submitSpinner && (
                        <CircleSpinner show={true} size="small" />
                      )}
                      {!submitSpinner && t("SUBMIT")}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
          {tab === 2 &&
            (!isErrorBankId ? (
              <div className="bl__successBox animated fadeIn faster">
                <div className="bl__successBox__top">
                  <div className="submitIcon">
                    <i className="icon-checkmark" />
                  </div>
                  <h4 className="text">{t("SUBMITTED")}!</h4>
                </div>
                <hr />
                <div className="longDesc">
                  {t("BL_SUCCESS_TOP_MESSAGE")}
                  <br />
                  {t("EMAIL")}:
                  <a href="mailto:contact@ponture.com">contact@ponture.com</a>
                  <br />
                  {t("TELEPHONE")}: 010 129 29 20
                  <br />
                  {t("BL_SUCCESS_BOTTOM_MESSAGE")}
                </div>
                <div className="bl__successBox__actions">
                  <button className="btn btn-light">
                    {t("BL_SUCCESS_MORE_LOAN")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bl__successBox animated fadeIn faster">
                <div className="bl__successBox__top">
                  <div className="submitIcon">
                    <i className="icon-checkmark" />
                  </div>
                  <h4 className="text">{t("SUBMITTED")}!</h4>
                </div>
                <hr />
                <div className="longDesc">
                  {t("BL_SUCCESS_FALSE_TOP_MESSAGE")}
                  <br />
                  {t("EMAIL")}:
                  <a href="mailto:contact@ponture.com">contact@ponture.com</a>
                  <br />
                  {t("TELEPHONE")}: 010 129 29 20
                  <br />
                  {t("BL_SUCCESS_FALSE_BOTTOM_MESSAGE")}
                </div>
                <div className="bl__successBox__actions">
                  <button className="btn btn-light">
                    {t("BL_SUCCESS_MORE_LOAN")}
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
