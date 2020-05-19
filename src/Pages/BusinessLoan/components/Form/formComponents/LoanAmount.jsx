import React, { useState } from "react";
import styles from "../styles.module.scss";
import Slider from "./Slider";
import Button from "./common/Button";
import Title from "./common/Title";
import SliderEditableValue from "./common/SliderEditableValue";
import useLocale from "hooks/useLocale";

const loanAmountMin = process.env.REACT_APP_LOAN_AMOUNT_MIN
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MIN)
  : 100000;
const loanAmountMax = process.env.REACT_APP_LOAN_AMOUNT_MAX
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MAX)
  : 10000000;

const loanPeriodStep = 1;
const loanPeriodMax = process.env.REACT_APP_LOAN_PERIOD_MAX
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MAX)
  : 36;
const loanPeriodMin = process.env.REACT_APP_LOAN_PERIOD_MIN
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MIN)
  : 1;

const LoanAmount = () => {
  const { t } = useLocale();
  const [loanAmount, setLoanAmount] = useState(850000);
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(12);
  function handleOnChangedAmount(val) {
    setLoanAmount(val);
    if (val <= 100000) {
      setLoanAmountStep(5000);
    } else if (val <= 500000) {
      setLoanAmountStep(25000);
    } else if (val <= 1000000) {
      setLoanAmountStep(50000);
    } else {
      setLoanAmountStep(125000);
    }
  }
  function handleOnChangedPeriod(value) {
    setLoanPeriod(value);
  }
  function handleChangeSliderEditValue(name, value) {
    if (name === "loanAmount") {
      handleOnChangedAmount(value);
    } else {
      handleOnChangedPeriod(value);
    }
  }
  return (
    <div className={styles.loanAmountBox}>
      <Slider
        title={t("BL_LOAN_AMOUNT")}
        minValue={loanAmountMin}
        maxValue={loanAmountMax}
        step={loanAmountStep}
        unit="kr"
        value={loanAmount}
        onChangedValue={handleOnChangedAmount}
        tooltip="Välj det lånebloppet som du önskar. Vanligtvis tänk om ditt företags återbetalningsförmåga. Kan ditt företag betala för lånekostnaden under låneperiod eller inte."
        id="loanAmount"
        manualValueComponent={() => {
          return (
            <div className={styles.sliderEditable}>
              <div className={styles.sliderEditable__input}>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) =>
                    handleChangeSliderEditValue("loanAmount", e.target.value)
                  }
                />
              </div>
              <div className={styles.sliderEditable__icon}>
                <i className="icon-cross" />
              </div>
            </div>
          );
        }}
      />
      <Slider
        title={t("BL_LOAN_PERIOD")}
        step={loanPeriodStep}
        maxValue={loanPeriodMax}
        minValue={loanPeriodMin}
        unit="kr"
        value={loanPeriod}
        onChangedValue={handleOnChangedPeriod}
        tooltip="Välj det lånebloppet som du önskar. Vanligtvis tänk om ditt företags återbetalningsförmåga. Kan ditt företag betala för lånekostnaden under låneperiod eller inte."
        id="loanMonth"
        manualValueComponent={() => {
          return (
            <div className={styles.sliderEditable}>
              <div className={styles.sliderEditable__input}>
                <input
                  type="number"
                  value={loanPeriod}
                  onChange={(e) =>
                    handleChangeSliderEditValue("loanPeriod", e.target.value)
                  }
                />
              </div>
              <div className={styles.sliderEditable__icon}>
                <i className="icon-cross" />
              </div>
            </div>
          );
        }}
      />
      <div className={styles.actions}>
        <div className={styles.actions__info}>
          <Title
            text="Vad ska lånet används till?"
            tooltip="no tooltip"
            id="aa"
          />
        </div>
        <div className={styles.actions__btns}>
          <Button
            customClass={styles.actions__customBtn}
            selected={true}
            showSelectedCheckMark={false}
          >
            Generelll likviditet
          </Button>
          <Button
            customClass={styles.actions__customBtn}
            showSelectedCheckMark={false}
          >
            Fastighetsfinansiering
          </Button>
          <Button
            customClass={styles.actions__customBtn}
            showSelectedCheckMark={false}
          >
            Företagsförvärv
          </Button>
        </div>
      </div>
      <div className={styles.guide}>
        Välj ett alternativ ovan för att gå vidare
      </div>
    </div>
  );
};

export default LoanAmount;
