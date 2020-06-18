import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import separateNumberByChar from "utils/separateNumberByChar";
import { getParameterByName, isNumber } from "utils";
import { isPhone } from "utils/responsiveSizes";
import styles from "../styles.module.scss";
import Slider from "./Slider";
import Button from "./common/Button";
import Title from "./common/Title";
import useLocale from "hooks/useLocale";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import CategoriesModal from "./LoanCategoriesModal";

const loanAmountMin = process.env.REACT_APP_LOAN_AMOUNT_MIN
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MIN)
  : 100000;
const loanAmountMax = process.env.REACT_APP_LOAN_AMOUNT_MAX
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MAX)
  : 10000000;
const loanAmountDefaultValue = 3500000;

const loanPeriodStep = 1;
const loanPeriodMax = process.env.REACT_APP_LOAN_PERIOD_MAX
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MAX)
  : 36;
const loanPeriodMin = process.env.REACT_APP_LOAN_PERIOD_MIN
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MIN)
  : 1;
const loanPeriodDefaultValue = 12;

const LoanAmount = () => {
  const { register, setValue } = useFormContext();
  const params_loanAmount = getParameterByName("amount");
  const params_loanPeriod = getParameterByName("amourtizationPeriod");
  const { t } = useLocale();
  const dispatch = useLoanDispatch();
  const { needs, isUrlNeeds, urlNeeds } = useLoanState();
  const editAmountInputRef = React.useRef(null);
  const editPeriodInputRef = React.useRef(null);
  const [selectedType, setType] = useState();
  const [loanAmount, setLoanAmount] = useState(() => {
    return params_loanAmount &&
      params_loanAmount.length > 0 &&
      isNumber(params_loanAmount)
      ? parseInt(params_loanAmount) < loanAmountMin
        ? loanAmountMin
        : parseInt(params_loanAmount) > loanAmountMax
        ? loanAmountMax
        : parseInt(params_loanAmount)
      : loanAmountDefaultValue;
  });
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(() => {
    return params_loanPeriod &&
      params_loanPeriod.length > 0 &&
      isNumber(params_loanPeriod)
      ? parseInt(params_loanPeriod) < loanPeriodMin
        ? loanPeriodMin
        : parseInt(params_loanPeriod) > loanPeriodMax
        ? loanPeriodMax
        : parseInt(params_loanPeriod)
      : loanPeriodDefaultValue;
  });
  const [isEditAmount, toggleAmountEdit] = useState(false);
  const [isEditPeriod, togglePeriodEdit] = useState(false);
  const [isOpenModal, toggleCategoriesModal] = useState(false);
  function init() {
    register({ name: "amount" }, { required: true });
    register({ name: "amourtizationPeriod" }, { required: true });
    register({ name: "need" }, { required: true });
    setValue("amount", loanAmount);
    setValue("amourtizationPeriod", loanPeriod);
    if (isUrlNeeds) setValue("need", urlNeeds);
  }
  React.useEffect(init, []);

  function handleOnChangedAmount(value) {
    const val = value;
    setValue("amount", val);
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
    const val = value;
    setValue("amourtizationPeriod", val);
    setLoanPeriod(val);
  }
  function handleChangeSliderEditValue(name, value) {
    if (name === "loanAmount") {
      handleOnChangedAmount(parseInt(value));
    } else {
      handleOnChangedPeriod(parseInt(value));
    }
  }
  function handleSelectedCategory(item) {
    if (!selectedType || selectedType !== item) {
      setValue("need", undefined);
      dispatch({
        type: "SET_NEED_CATEGORY",
        payload: item,
      });
      if (selectedType) {
        dispatch({
          type: "SET_STEP_TO_NOT_FINISHED",
          payload: {
            step: "needsBox",
          },
        });
      } else
        dispatch({
          type: "NEXT_STEP",
          payload: {
            finishedStep: "loanAmountBox",
            nextStep: "needsBox",
          },
        });

      setType(item);
    }
  }
  function handleAmountLostFocus() {
    if (isEditAmount) {
      toggleAmountEdit(false);
      if (!loanAmount) {
        handleOnChangedAmount(loanAmountDefaultValue);
      } else {
        if (loanAmount > loanAmountMax) {
          handleOnChangedAmount(loanAmountMax);
        } else if (loanAmount < loanAmountMin) {
          handleOnChangedAmount(loanAmountMin);
        }
      }
    }
  }
  function handlePeriodLostFocus() {
    if (isEditPeriod) {
      togglePeriodEdit(false);
      if (!loanPeriod) {
        handleOnChangedPeriod(loanPeriodDefaultValue);
      } else {
        if (loanPeriod > loanPeriodMax) {
          handleOnChangedPeriod(loanPeriodMax);
        } else if (loanPeriod < loanPeriodMin) {
          handleOnChangedPeriod(loanPeriodMin);
        }
      }
    }
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
    if (isEditPeriod)
      if (editPeriodInputRef.current) editPeriodInputRef.current.focus();
  }, [isEditPeriod]);

  function openCategoriesModal() {
    toggleCategoriesModal(true);
  }
  function handleCloseCategoriesModal(item) {
    toggleCategoriesModal(false);
    if (item) {
      setType(item);
      setValue("need", undefined);
      dispatch({
        type: "SET_NEED_CATEGORY",
        payload: item,
      });
      dispatch({
        type: "NEXT_STEP",
        payload: {
          finishedStep: "loanAmountBox",
          nextStep: "needsBox",
        },
      });
      if (isUrlNeeds && isPhone()) {
        dispatch({
          type: "TOGGLE_IS_NEEDS_URL",
          payload: false,
        });
        // handleSelectedCategory(item);
      } else {
        dispatch({
          type: "SET_STEP_TO_NOT_FINISHED",
          payload: {
            step: "needsBox",
          },
        });
      }
    }
  }
  function changeUrlNeedsToCategory() {
    if (!isPhone()) {
      setValue("need", undefined);
      dispatch({
        type: "URL_NEEDS_RESET_TO_LOAN_BOX",
        payload: false,
      });
    } else openCategoriesModal();
  }
  return (
    <>
      <div className={styles.loanAmountBox}>
        <Slider
          title={t("LOAN_AMOUNT_LABEL")}
          minValue={loanAmountMin}
          maxValue={loanAmountMax}
          step={loanAmountStep}
          unit="kr"
          value={loanAmount}
          onChangedValue={handleOnChangedAmount}
          tooltip={t("LOAN_AMOUNT_TOOLTIP")}
          id="loanAmount"
          manualValueComponent={() => {
            return (
              <div
                className={
                  styles.sliderEditable +
                  " " +
                  (isEditAmount ? styles.isEditSliderEditValue : "")
                }
                onMouseLeave={handleAmountLostFocus}
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
                  <img src={require("assets/icons/edit.png")} alt="" />
                </div>
              </div>
            );
          }}
        />
        <Slider
          title={t("LOAN_PERIOD_LABEL")}
          step={loanPeriodStep}
          maxValue={loanPeriodMax}
          minValue={loanPeriodMin}
          unit="kr"
          value={loanPeriod}
          onChangedValue={handleOnChangedPeriod}
          tooltip={t("LOAN_PERIOD_TOOLTIP")}
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
                onMouseLeave={handlePeriodLostFocus}
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
                  <img src={require("assets/icons/edit.png")} alt="" />
                </div>
              </div>
            );
          }}
        />
        {isUrlNeeds ? (
          <div className={styles.actions}>
            <div className={styles.actions__info}>
              <Title
                text={t("LOAN_AMOUNT_URL_NEEDS_LABEL")}
                tooltip={t("LOAN_AMOUNT_URL_NEEDS_TOOLTIP")}
                id="urlneedstooltip"
              />
            </div>
            <div className={styles.actions__urlNeedsList}>
              {urlNeeds.map((item, index) => {
                return (
                  <Button
                    key={index}
                    customClass={styles.actions__urlCustomBtn}
                    selected={true}
                    showSelectedCheckMark={true}
                  >
                    {item.Label}
                  </Button>
                );
              })}
            </div>
            <Button
              customClass={styles.actions__customBtnLink}
              showSelectedCheckMark={false}
              onClick={changeUrlNeedsToCategory}
            >
              {t("LOAN_AMOUNT_URL_NEEDS_CHANGE_CATEGORY")}
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.actions}>
              <div className={styles.actions__info}>
                <Title
                  text={t("LOAN_NEEDS_CATEGORIES_LABEL")}
                  tooltip={t("LOAN_NEEDS_CATEGORIES_TOOLTIP")}
                  id="aa"
                />
              </div>
              <div className={styles.actions__btns}>
                {needs &&
                  Object.keys(needs).map((item, index) => {
                    return (
                      <Button
                        key={index}
                        customClass={styles.actions__customBtn}
                        selected={selectedType && selectedType === item}
                        showSelectedCheckMark={false}
                        onClick={() => handleSelectedCategory(item)}
                      >
                        {item}
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
                  {selectedType}
                </Button>
              )}
              {selectedType && (
                <Button
                  customClass={styles.actions__customBtnLink}
                  showSelectedCheckMark={false}
                  onClick={openCategoriesModal}
                >
                  {t("LOAN_AMOUNT_CHANGE_BTN_TITLE")}
                </Button>
              )}
              {!selectedType && (
                <Button
                  customClass={styles.actions__customBtn}
                  showSelectedCheckMark={false}
                  onClick={openCategoriesModal}
                >
                  {t("LOAN_AMOUNT_CHOOSE_BTN_TITLE")}
                </Button>
              )}
            </div>
            {!selectedType && (
              <div className={styles.guide}>{t("LOAN_AMOUNT_GUIDE")}</div>
            )}
          </>
        )}
      </div>
      {isOpenModal && <CategoriesModal onClose={handleCloseCategoriesModal} />}
    </>
  );
};

export default LoanAmount;
