import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import separateNumberByChar from "utils/separateNumberByChar";
import styles from "../styles.module.scss";
import Slider from "./Slider";
import Button from "./common/Button";
import Title from "./common/Title";
import useLocale from "hooks/useLocale";
import { useLoanDispatch } from "hooks/useLoan";
import CategoriesModal from "./LoanCategoriesModal";

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

export const loanTypes = [
  { id: 1, name: "general", displayName: "Generell likviditet" },
  { id: 2, name: "finance", displayName: "Fastighetsfinansiering" },
  { id: 3, name: "both", displayName: "Företagsförvärv" },
];

const LoanAmount = () => {
  const {
    register,
    errors,
    setError,
    clearError,
    setValue,
    formState: { dirty },
  } = useFormContext();
  const { t } = useLocale();
  const dispatch = useLoanDispatch();
  const editAmountInputRef = React.useRef(null);
  const editPeriodInputRef = React.useRef(null);
  const [selectedType, setType] = useState();
  const [loanAmount, setLoanAmount] = useState(850000);
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(12);
  const [isEditAmount, toggleAmountEdit] = useState(false);
  const [isEditPeriod, togglePeriodEdit] = useState(false);
  const [isOpenModal, toggleCategoriesModal] = useState(false);
  function initForm() {
    register({ name: "amount", type: "custom" });
    register({ name: "amourtizationPeriod", type: "custom" });
  }
  React.useEffect(initForm, []);

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
      handleOnChangedAmount(parseInt(value));
    } else {
      handleOnChangedPeriod(parseInt(value));
    }
  }
  function handleSelectedType(item) {
    setType(item);
    if (!selectedType)
      dispatch({
        type: "SET_FINISHED_STEP",
        payload: 1,
      });
  }
  function editAmount() {
    if (!isEditAmount) {
      toggleAmountEdit(true);
    }
  }
  React.useEffect(() => {
    if (isEditAmount) {
      if (editAmountInputRef.current) {
        editAmountInputRef.current.focus();
      }
    }
  }, [isEditAmount]);
  function editPeriod() {
    if (!isEditPeriod) {
      togglePeriodEdit(true);
      if (editPeriodInputRef.current) {
        editPeriodInputRef.current.focus();
      }
    }
  }
  React.useEffect(() => {
    if (isEditPeriod) {
      if (editPeriodInputRef.current) {
        editPeriodInputRef.current.focus();
      }
    }
  }, [isEditPeriod]);

  function handleChooseCategory() {
    toggleCategoriesModal(true);
  }
  function handleCloseCategoriesModal(item) {
    toggleCategoriesModal(false);
    if (item) {
      handleSelectedType(item);
    }
  }
  return (
    <>
      <div className={styles.loanAmountBox}>
        <Slider
          title={t("Lånebelopp")}
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
              <div
                className={
                  styles.sliderEditable +
                  " " +
                  (isEditAmount ? styles.isEditSliderEditValue : "")
                }
                onMouseLeave={() => {
                  if (isEditAmount) {
                    toggleAmountEdit(false);
                  }
                }}
                onClick={editAmount}
              >
                <div className={styles.sliderEditable__input}>
                  {!isEditAmount ? (
                    <h4>{separateNumberByChar(loanAmount)} kr</h4>
                  ) : (
                    <input
                      step="10000"
                      max={loanAmountMax}
                      ref={editAmountInputRef}
                      type="number"
                      value={loanAmount}
                      onChange={(e) =>
                        handleChangeSliderEditValue(
                          "loanAmount",
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
                <div className={styles.sliderEditable__icon}>
                  <i className="icon-cog" />
                </div>
              </div>
            );
          }}
        />
        <Slider
          title={t("Låneperiod")}
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
              <div
                className={
                  styles.sliderEditable +
                  " " +
                  (isEditPeriod ? styles.isEditSliderEditValue : "")
                }
                onClick={editPeriod}
                onMouseLeave={() => {
                  if (isEditPeriod) {
                    togglePeriodEdit(false);
                  }
                }}
              >
                <div className={styles.sliderEditable__input}>
                  {!isEditPeriod ? (
                    <h4>
                      {loanPeriod} {loanPeriod === 1 ? "månad" : "månader"}
                    </h4>
                  ) : (
                    <input
                      ref={editPeriodInputRef}
                      min={1}
                      type="number"
                      value={loanPeriod}
                      onChange={(e) =>
                        handleChangeSliderEditValue(
                          "loanPeriod",
                          e.target.value
                        )
                      }
                    />
                  )}
                </div>
                <div className={styles.sliderEditable__icon}>
                  <i className="icon-cog" />
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
            {loanTypes.map((item, index) => {
              return (
                <Button
                  key={index}
                  customClass={styles.actions__customBtn}
                  selected={selectedType && selectedType.name === item.name}
                  showSelectedCheckMark={false}
                  onClick={() => handleSelectedType(item)}
                >
                  {item.displayName}
                </Button>
              );
            })}
          </div>
        </div>
        <div className={styles.mobileActions}>
          {selectedType && (
            <Button
              customClass={styles.actions__customBtn}
              selected={true}
              showSelectedCheckMark={false}
            >
              {selectedType.displayName}
            </Button>
          )}
          <Button
            customClass={styles.actions__customBtn}
            showSelectedCheckMark={false}
            onClick={handleChooseCategory}
          >
            {!selectedType ? "Choose Category" : "Change Category"}
          </Button>
        </div>
        {!selectedType && (
          <div className={styles.guide}>
            Välj ett alternativ ovan för att gå vidare
          </div>
        )}
      </div>
      {isOpenModal && <CategoriesModal onClose={handleCloseCategoriesModal} />}
    </>
  );
};

export default LoanAmount;
