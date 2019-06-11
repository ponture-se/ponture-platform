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
  { value: "1", title: { sv: "Renovering", en: "" } },
  { value: "2", title: { sv: "Förvärvsköp" } },
  { value: "3", title: { sv: "Anställa personal" } },
  { value: "4", title: { sv: "Oväntade utgifter" } },
  { value: "5", title: { sv: "Finansiera skulder" } },
  { value: "6", title: { sv: "Generell likviditet/kassaflöde" } },
  { value: "7", title: { sv: "Inköp av lager" } },
  { value: "8", title: { sv: "Oväntade utgifter" } },
  { value: "9", title: { sv: "Marknadsföring" } },
  { value: "10", title: { sv: "Säsongsinvestering" } },
  { value: "11", title: { sv: "Fastighetsfinansiering" } },
  { value: "12", title: { sv: "Övrigt" } },
];

const loanAmountStep = 5000;
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
const personalNumber_regex = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
function useRegexedString(regex) {
  const [str, _setStr] = React.useState("");
  const setStr = React.useCallback(
    newStr => newStr.match(regex) && _setStr(newStr) && [regex]
  );
  return [str, setStr];
}
export default function BusinessLoan(props) {
  const { setLocale, appLocale, currentLang } = useLocale();
  useTheme("theme1");
  useLayout("ltr");
  useEffect(() => {
    setLocale("sv");
  }, []);

  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanPeriod, setLoanPeriod] = useState(12);
  const [loanReason, setLoanReason] = useState(loanReasonOptions[6]);
  const [loanReasonOther, setLoanReasonOther] = useState();
  const [personalNumber, setPersonalNumber] = useRegexedString(myInputPattern);

  const handleLoanAmount = useCallback(val => setLoanAmount(val), [loanAmount]);
  const handleLoanPeriod = useCallback(val => setLoanPeriod(val), [loanPeriod]);
  const handleLoanReasonChanged = useCallback(val => {
    setLoanReason(val);
  }, []);
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

  const handlePersonalNumberChanged = useCallback(
    e => {
      setPersonalNumber(e.target.value);
      if (!isBankId(e.target.value)) {
        console.log(false);
      } else console.log(true);
    },
    [personalNumber]
  );
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
              <label className="bl__input__label bl__input__sliderLabel">
                {appLocale["BL_LOAN_AMOUNT"]}
              </label>
              <div className="bl__rangeElement">
                <div
                  className="rangeElement__left"
                  onClick={handleMinusLoanAmount}
                >
                  <span className="icon-minus" />
                </div>
                <div className="rangeElement__center">
                  <InputRange
                    draggableTrack
                    allowSameValues
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
                {appLocale["BL_LOAN_PERIOD"]}
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
                    formatLabel={value => `${value} month`}
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
                {appLocale["BL_REASON_LOAN"]}
              </label>
              <div className="bl__input__element">
                <Select
                  styles={customStyles}
                  menuPlacement="top"
                  closeMenuOnScroll={true}
                  closeMenuOnSelect={true}
                  defaultValue={loanReasonOptions[5]}
                  onChange={handleLoanReasonChanged}
                  options={loanReasonOptions}
                  isMulti={false}
                  isSearchable={false}
                  components={{
                    Option: CustomOption,
                    MultiValueLabel,
                    SingleValue,
                  }}
                />
              </div>
            </div>
            {loanReason.value === "12" && (
              <div className="bl__input animated fadeIn">
                <label className="bl__input__label">
                  {appLocale["BL_REASON_LOAN_OTHER"]}
                </label>
                <div className="bl__input__element">
                  <input type="text" className="my-input" placeholder="" />
                </div>
              </div>
            )}
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {appLocale["BL_PERSONAL_NUMBER"]}
              </label>
              <div className="bl__input__element">
                <div className="element-group">
                  <div className="element-group__center">
                    <input
                      type="text"
                      className="my-input"
                      placeholder="examples: 12345678-1234, 123456781234, 345678-1234, 3456781234"
                      value={personalNumber}
                      onChange={handlePersonalNumberChanged}
                      maxLength="13"
                    />
                  </div>
                  <div className="element-group__left">
                    <CircleSpinner show={true} size="small" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {appLocale["BL_COMPANY_NAME"]}
              </label>
              <div className="bl__input__element">
                <input type="text" className="my-input" placeholder="" />
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {appLocale["BL_ORGANIZATION_NAME"]}
              </label>
              <div className="bl__input__element">
                <input type="text" className="my-input" placeholder="" />
              </div>
            </div>
          </div>
          <div className="bl__contactInfo">
            <div className="bl__contactInfo__header">
              <div className="bl__contactInfo__circleIcon">
                <i className="icon-request" />
              </div>
              <span>{appLocale["BL_CONTACT_BOX_TITLE"]}</span>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {appLocale["BL_PHONE_NUMBER"]}
              </label>
              <div className="bl__input__element">
                <div className="element-group">
                  <div className="element-group__left">
                    <span className="icon-phone" />
                  </div>
                  <div className="element-group__center">
                    <input type="text" className="my-input" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="bl__input__label">
                {appLocale["BL_EMAIL"]}
              </label>
              <div className="bl__input__element">
                <div className="element-group">
                  <div className="element-group__left">
                    <span className="icon-envelope" />
                  </div>
                  <div className="element-group__center">
                    <input type="text" className="my-input" placeholder="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bl__input animated fadeIn">
              <label className="customCheckbox">
                <input type="checkbox" id="dateDisablePast" />
                <span className="checkmark" />
                <span>{appLocale["BL_TERMS"]}</span>
              </label>
            </div>
            <div className="bl__actions">
              <button className="my-btn --success">
                {appLocale["SUBMIT"]}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
const customStyles = {
  control: (base, state) => ({
    ...base,
    boxShadow: state.isFocused ? "0 0 4px rgb(66, 204, 173)" : "none",
    borderColor: state.isFocused ? "rgb(66, 204, 173)" : base.borderColor,
    outlineColor: state.isFocused ? "rgb(66, 204, 173)" : base.borderColor,
    // You can also use state.isFocused to conditionally style based on the focus state
  }),
};
const SingleValue = props => {
  const { currentLang } = useLocale();

  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">{data.title[currentLang]}</div>
    </components.SingleValue>
  );
};
const MultiValueLabel = props => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="options-multiple-selected">{data.value}</div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  const { currentLang } = useLocale();
  if (!isDisabled) {
    return (
      <div {...innerProps} className="options-items">
        {data.title[currentLang]}
      </div>
    );
  } else return null;
};
