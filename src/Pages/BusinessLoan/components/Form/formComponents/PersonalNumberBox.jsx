import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Title from "./common/Title";
import CircleSpinner from "components/CircleSpinner";
import { useLoanDispatch } from "hooks/useLoan";
import useLocale from "hooks/useLocale";

const PersonalNumberBox = () => {
  const { errors, register, triggerValidation } = useFormContext();
  const dispatch = useLoanDispatch();
  const { t } = useLocale();
  const pNumberBoxRef = React.useRef(null);
  const [spinner, toggleSpinner] = React.useState(false);
  const [isDonePNumber, toggleIsDonePNumber] = React.useState(false);
  React.useEffect(() => {
    if (pNumberBoxRef.current) {
      window.scrollTo(0, pNumberBoxRef.current.offsetTop);
    }
  }, []);
  async function searchCompanies() {
    if (!isDonePNumber) {
      const isValid = await triggerValidation("personalNumber");
      if (isValid) {
        toggleSpinner(true);
        setTimeout(() => {
          toggleSpinner(false);
          toggleIsDonePNumber(true);
          dispatch({
            type: "SET_FINISHED_STEP",
            payload: 3,
          });
        }, 1000);
      }
    }
  }
  return (
    <div ref={pNumberBoxRef} className={styles.companiesBox}>
      <div className={styles.companiesBox__info}>
        <Title
          text="Ange ditt personnummer och klicka på “Sök” för att hitta ditt företag"
          showTooltip={false}
        />
      </div>
      <form className={styles.companiesBox__input} onSubmit={searchCompanies}>
        <Input
          title="Ange personnummer"
          placeholder="19830611-1222"
          extraClassStyle={styles.companiesBox__input__personalNumber}
          errorText={errors.personalNumber && errors.personalNumber.message}
          tooltip="no tooltip"
          id="cc"
          name="personalNumber"
          ref={register({
            required: t("PERSONAL_NUMBER_IS_REQUIRED"),
            pattern: {
              value: /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/,
              message: t("PERSONAL_NUMBER_IN_CORRECT"),
            },
          })}
          disabled={isDonePNumber}
        />
        <Button
          customClass={styles.companiesBox__input__customBtn}
          selected={true}
          showSelectedCheckMark={false}
        >
          {!spinner ? (
            !isDonePNumber ? (
              "Sök efter mitt företag"
            ) : (
              <a />
            )
          ) : (
            <CircleSpinner show={true} size="small" />
          )}
        </Button>
      </form>
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
    </div>
  );
};

export default PersonalNumberBox;
