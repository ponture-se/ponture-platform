import React from "react";
import { useFormContext } from "react-hook-form";
import { IoMdCheckmark } from "react-icons/io";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Title from "./common/Title";
import CircleSpinner from "components/CircleSpinner";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";
import useLocale from "hooks/useLocale";

const PersonalNumberBox = () => {
  const {
    setError,
    errors,
    register,
    setValue,
    triggerValidation,
    getValues,
  } = useFormContext();
  const dispatch = useLoanDispatch();
  const { personalNumber, currentStep, pNumberTryCounter } = useLoanState();
  const { _getCompanies } = useLoanApi();

  const { t } = useLocale();
  const pNumberBoxRef = React.useRef(null);
  const pNumberBoxInput = React.useRef(null);
  const [spinner, toggleSpinner] = React.useState(false);
  const [isDonePNumber, toggleIsDonePNumber] = React.useState(() => {
    return pNumberTryCounter === 2 ? false : personalNumber ? true : false;
  });
  const init = () => {
    if (personalNumber) {
      setValue("personalNumber", personalNumber);
    } else {
      if (pNumberBoxInput.current) {
        pNumberBoxInput.current.focus();
      }
    }
    if (pNumberBoxRef.current && currentStep === "personalNumberBox") {
      window.scrollTo(0, pNumberBoxRef.current.offsetTop);
    }
  };
  React.useEffect(init, []);
  function handleKeyDown(e) {
    e.stopPropagation();
    if (e.key === "Enter") {
      searchCompanies(e);
    }
  }
  async function searchCompanies(e) {
    if (!isDonePNumber) {
      const isValid = await triggerValidation("personalNumber");
      if (isValid) {
        toggleSpinner(true);
        const pNumber = getValues().personalNumber;
        _getCompanies(
          pNumber,
          (companies) => {
            toggleSpinner(false);
            if (!companies || companies.length === 0) {
              dispatch({
                type: "INCREMENT_P_NUMBER_TRY_COUNTER",
              });
              setError([
                {
                  type: "empty",
                  name: "personalNumber",
                  message:
                    "There aren't any companies for this personal number.try once again",
                },
              ]);
            } else {
              toggleIsDonePNumber(true);
              dispatch({
                type: "NEXT_STEP",
                payload: {
                  finishedStep: "personalNumberBox",
                  nextStep: "companiesBox",
                },
              });
            }
          },
          () => toggleSpinner(false)
        );
      }
    }
  }
  return (
    <div ref={pNumberBoxRef} className={styles.companiesBox}>
      <div className={styles.companiesBox__info}>
        <Title
          text={
            pNumberTryCounter === 2
              ? t("PERSONAL_NUMBER_MORE_THAN_2_TEXT")
              : !isDonePNumber
              ? t("PERSONAL_NUMBER_TITLE")
              : t("PERSONAL_NUMBER_VERIFIED")
          }
          showTooltip={false}
        />
      </div>
      {pNumberTryCounter === 2 ? (
        <div className={styles.companiesBox__morethan2Text}>
          <a href="/app/loan">{t("REFRESH_LINK_TEXT_1")}</a>
          <a href="/app/loan">{t("REFRESH_LINK_TEXT_2")}</a>
        </div>
      ) : !isDonePNumber ? (
        <>
          <div
            className={styles.companiesBox__input}
            onSubmit={searchCompanies}
          >
            <Input
              title={t("PERSONAL_NUMBER_INPUT_LABEL")}
              placeholder="19830611-1222"
              extraClassStyle={styles.companiesBox__input__personalNumber}
              errorText={errors.personalNumber && errors.personalNumber.message}
              tooltip={t("PERSONAL_NUMBER_INPUT_TOOLTIP")}
              id="cc"
              name="personalNumber"
              onKeyDown={handleKeyDown}
              ref={(e) => {
                pNumberBoxInput.current = e;
                register(e, {
                  required: t("PERSONAL_NUMBER_IS_REQUIRED"),
                  pattern: {
                    value: /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/,
                    message: t("PERSONAL_NUMBER_IN_CORRECT"),
                  },
                });
              }}
            />

            <Button
              customClass={styles.companiesBox__input__customBtn}
              selected={true}
              showSelectedCheckMark={false}
              onClick={searchCompanies}
            >
              {!spinner ? (
                t("PERSONAL_NUMBER_BUTTON_TEXT")
              ) : (
                <CircleSpinner show={true} size="small" />
              )}
            </Button>
          </div>

          <div className={styles.companiesBox__guid}>
            <span className={styles.companiesBox__guid_title}>
              {t("PERSONAL_NUMBER_GUIDE_TITLE")}
            </span>
            <ul>
              <li>{t("PERSONAL_NUMBER_GUIDE_1")}</li>
              <li>{t("PERSONAL_NUMBER_GUIDE_2")}</li>
              <li>{t("PERSONAL_NUMBER_GUIDE_3")}</li>
              <li>{t("PERSONAL_NUMBER_GUIDE_4")}</li>
            </ul>
          </div>
        </>
      ) : (
        <div className={styles.companiesBox__isDonePNumber}>
          <span>{personalNumber}</span>
          <Button
            customClass={styles.companiesBox__isDoneBtn}
            selected={true}
            showSelectedCheckMark={false}
          >
            <IoMdCheckmark className={styles.checkmark} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalNumberBox;
