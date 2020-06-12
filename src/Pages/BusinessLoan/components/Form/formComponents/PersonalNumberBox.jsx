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
              ? "You are not allowed to try more than twice"
              : !isDonePNumber
              ? "Ange ditt personnummer och klicka på “Sök” för att hitta ditt företag"
              : "Ditt personnummer har verifierats"
          }
          showTooltip={false}
        />
      </div>
      {pNumberTryCounter === 2 ? (
        <div className={styles.companiesBox__morethan2Text}>
          <a href="/app/loan">Börja om</a>
          <a href="/app/loan">
            Om du klicka här kommer förmuläret att nollställas
          </a>
        </div>
      ) : !isDonePNumber ? (
        <>
          <div
            className={styles.companiesBox__input}
            onSubmit={searchCompanies}
          >
            <Input
              title="Ange personnummer"
              placeholder="19830611-1222"
              extraClassStyle={styles.companiesBox__input__personalNumber}
              errorText={errors.personalNumber && errors.personalNumber.message}
              tooltip="no tooltip"
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
                "Sök efter mitt företag"
              ) : (
                <CircleSpinner show={true} size="small" />
              )}
            </Button>
          </div>

          <div className={styles.companiesBox__guid}>
            <span className={styles.companiesBox__guid_title}>
              Det personnummer som kan accepteras är:
            </span>
            <ul>
              <li>Ägare av företaget </li>
              <li>Styrelsemedlemmar i företaget</li>
              <li>Suppleant</li>
              <li>En firmatecknare av företag</li>
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
