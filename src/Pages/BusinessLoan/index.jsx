import React, { useState, useEffect, useCallback, useMemo } from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import Select, { components } from "react-select";
import CircleSpinner from "./../../components/CircleSpinner";
import {
  useGlobalState,
  useLocale,
  useLocalStorage,
  useLayout,
  useTheme,
} from "./../../hooks";
import "./styles.scss";

const loanReasonOptions = [
  { id: "1", title: { sv: "Renovering", fa: "Renovering" } },
  { id: "2", title: { sv: "Förvärvsköp", fa: "Förvärvsköp" } },
  { id: "3", title: { sv: "Anställa personal", fa: "Anställa personal" } },
  { id: "4", title: { sv: "Oväntade utgifter", fa: "Oväntade utgifter" } },
  { id: "5", title: { sv: "Finansiera skulder", fa: "Finansiera skulder" } },
  {
    id: "6",
    title: {
      sv: "Generell likviditet/kassaflöde",
      fa: "Generell likviditet/kassaflöde",
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

const phone_regex = /^((((0{2}?)|(\+){1})46)|0)7[\d]{8}/;

function isBankId(bankId) {
  const personalNumber_regex = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
  return personalNumber_regex.test(bankId);
}
const myInputPattern = /^([0-9]*[-]?)[0-9]*$/;

function useRegexedString(regex) {
  const [str, _setStr] = React.useState("");
  const setStr = useCallback(
    newStr => newStr.match(regex) && _setStr(newStr) && [regex]
  );
  return [str, setStr];
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function isPhoneNumber(phoneNumber) {
  var p = /^((((0{2}?)|(\+){1})46)|0)7[\d]{8}/;
  return p.test(phoneNumber);
}

export default function BusinessLoan(props) {
  const { setLocale, t, appLocale, currentLang } = useLocale();

  useTheme("theme1");
  useLayout(process.env.REACT_APP_DEFAULT_LAYOUT || "ltr");
  useEffect(() => {
    setLocale(process.env.REACT_APP_DEFAULT_LANGUAGE || "sv");
  }, []);

  const [loanAmount, setLoanAmount] = useState(2500000);
  const [loanAmountDisplay, setLoanAmountDisplay] = useState(2500000);
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(12);
  const [loanReason, setLoanReason] = useState("6");
  const [loanReasonOther, setLoanReasonOther] = useState();
  const [otherReasonIsValid, toggleOtherReasonValidation] = useState(true);
  const [
    otherReasonValidationMessage,
    setOtherReasonValidationMessage,
  ] = useState();
  const [personalNumber, setPersonalNumber] = useRegexedString(myInputPattern);
  const [personalNumberIsValid, togglePersonalNumberValidation] = useState(
    true
  );
  const [
    personalNumberValidationMessage,
    setPersonalNumberValidationMessage,
  ] = useState();
  const [companies, setCompanies] = useState();
  const [companyName, setCompanyName] = useState();
  const [orgName, setOrgName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [phoneNumberIsValid, togglePhoneNumberValidation] = useState(true);
  const [
    phoneNumberValidationMessage,
    setPhoneNumberValidationMessage,
  ] = useState();
  const [personalNumberSpinner, togglePersonalNumberSpinner] = useState(false);
  const [email, setEmail] = useState();
  const [emailIsValid, toggleEmailValidation] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState();
  const [terms, toggleTermsChecked] = useState(false);
  const [termValidation, toggleTermValidaiton] = useState(false);

  const [form, setForm] = useState({
    loanAmount: 2500000,
    loanPeriod: 12,
    loanReason: "6",
    loanReasonOtherDesc: undefined,
    personalNumber: undefined,
    oraganziationNumber: undefined,
    phoneNumber: undefined,
    email: undefined,
    terms: false,
  });

  useEffect(() => {
    setLoanAmountDisplay(
      loanAmount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
    );
  }, [loanAmount]);

  const handleLoanAmount = useCallback(
    val => {
      setLoanAmount(val);

      if (val <= 100000) {
        setLoanAmountStep(5000);
      } else if (val <= 500000) {
        setLoanAmountStep(25000);
      } else if (val <= 1000000) {
        setLoanAmountStep(50000);
      } else {
        setLoanAmountStep(100000);
      }
    },
    [loanAmount]
  );

  const handleLoanPeriod = useCallback(val => setLoanPeriod(val), [loanPeriod]);

  const handleMinusLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        if (step - loanAmountStep >= loanAmountMin)
          return step - loanAmountStep;
        return loanAmountMin;
      });
    },
    [loanAmount]
  );
  const handleAddLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        if (step + loanAmountStep <= loanAmountMax)
          return step + loanAmountStep;
        return loanAmountMax;
      });
    },
    [loanAmount]
  );
  const handleMinusLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        if (step - loanPeriodStep >= loanPeriodMin)
          return step - loanPeriodStep;
        return loanPeriodMin;
      });
    },
    [loanPeriod]
  );
  const handleAddLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        if (step + loanPeriodStep <= loanPeriodMax)
          return step + loanPeriodStep;
        return loanPeriodMax;
      });
    },
    [loanPeriod]
  );
  const handleLoanReasonChanged = useCallback(e => {
    setLoanReason(e.target.value);
  }, []);
  const handleOtherReasonChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        toggleOtherReasonValidation(false);
        setOtherReasonValidationMessage(t("OTHER_REASON_IS_REQUIRED"));
      } else {
        toggleOtherReasonValidation(true);
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
          _verifyPersonalNumber(e.target.value);
        }
      }
      setPersonalNumber(e.target.value);
    },
    [personalNumber, appLocale]
  );
  function _verifyPersonalNumber(bankId) {
    togglePersonalNumberSpinner(true);
    setTimeout(() => {
      togglePersonalNumberSpinner(false);
    }, 2000);
  }
  const handlePhoneNumberChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        togglePhoneNumberValidation(false);
        setPhoneNumberValidationMessage(t("PHONE_NUMBER_IS_REQUIRED"));
      } else {
        if (!isPhoneNumber(e.target.value)) {
          togglePhoneNumberValidation(false);
          setPhoneNumberValidationMessage(t("PHONE_NUMBER_IN_CORRECT"));
        } else togglePhoneNumberValidation(true);
      }
      setPhoneNumber(e.target.value);
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
    if (loanReason === "12") {
      handleOtherReasonChanged({
        target: { value: loanReasonOther ? loanReasonOther : "" },
      });
    }
    toggleTermValidaiton(!form["terms"]);
  }
  return appLocale ? (
    <div className="bl">
      <div className="bl__header">
        <div className="bl__logo">
          <img src={require("./../../assets/logo-c.png")} alt="logo" />
        </div>
      </div>
      <div className="bl__content">
        <div className="bl__form">
          <div className="bl__mainform">
            <div className="bl__form__header">
              <div className="bl__form__circleIcon">
                <i className="icon-request" />
              </div>
              <span>{appLocale["BISINUSS_LOAN"]}</span>
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
              <label className="bl__input__label">{t("BL_REASON_LOAN")}</label>
              <div className="bl__input__element">
                <select
                  className="my-input"
                  value={loanReason}
                  onChange={handleLoanReasonChanged}
                >
                  {loanReasonOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title[currentLang]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {loanReason === "12" && (
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
                      disabled={personalNumberSpinner ? true : false}
                    />
                  </div>
                  {personalNumberSpinner && (
                    <div className="element-group__left">
                      <CircleSpinner show={true} size="small" />
                    </div>
                  )}
                </div>
                {!personalNumberIsValid && (
                  <span className="validation-messsage">
                    {personalNumberValidationMessage}
                  </span>
                )}
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">{t("BL_COMPANY_NAME")}</label>
              <div className="bl__input__element">
                <select
                  className="my-input"
                  disabled={companies && companies.length > 0 ? false : true}
                  //   value={loanReason}
                  //   onChange={handleLoanReasonChanged}
                >
                  {/* {loanReasonOptions.map(opt => (
                    <option key={opt.id} value={opt.id}>
                      {opt.title[currentLang]}
                    </option>
                  ))} */}
                </select>
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {t("BL_ORGANIZATION_NAME")}
              </label>
              <div className="bl__input__element">
                <input type="text" className="my-input" readOnly />
              </div>
            </div>
          </div>
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
              <label className="bl__input__label">{t("BL_PHONE_NUMBER")}</label>
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
                <span>
                  {t("BL_TERMS")}{" "}
                  <a href="https://www.ponture.com/eula" target="_blank">
                    {t("BL_TERMS_LINK")}
                  </a>
                </span>
              </label>
              {termValidation && (
                <span className="validation-messsage">
                  Accepting our terms and conditions is required
                </span>
              )}
            </div>
            <div className="bl__actions">
              <button
                className="my-btn --success"
                onClick={handleSubmitClicked}
              >
                {t("SUBMIT")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
