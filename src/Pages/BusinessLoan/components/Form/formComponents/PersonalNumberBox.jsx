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
    errors,
    register,
    setValue,
    triggerValidation,
    getValues,
  } = useFormContext();
  const dispatch = useLoanDispatch();
  const { companies, personalNumber } = useLoanState();
  const { _getCompanies } = useLoanApi();

  const { t } = useLocale();
  const pNumberBoxRef = React.useRef(null);
  const [spinner, toggleSpinner] = React.useState(false);
  const [isDonePNumber, toggleIsDonePNumber] = React.useState(
    personalNumber ? true : false
  );
  const init = () => {
    if (personalNumber) setValue("personalNumber", personalNumber);

    if (pNumberBoxRef.current) {
      window.scrollTo(0, pNumberBoxRef.current.offsetTop);
    }
  };
  React.useEffect(init, []);

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      searchCompanies();
    }
  }
  async function searchCompanies() {
    if (!isDonePNumber) {
      const isValid = await triggerValidation("personalNumber");
      if (isValid) {
        toggleSpinner(true);
        const pNumber = getValues().personalNumber;
        _getCompanies(
          pNumber,
          () => {
            toggleSpinner(false);
            toggleIsDonePNumber(true);
            dispatch({
              type: "NEXT_STEP",
            });
          },
          () => {
            toggleSpinner(false);
          }
        );
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
      <div className={styles.companiesBox__input} onSubmit={searchCompanies}>
        <Input
          title="Ange personnummer"
          placeholder="19830611-1222"
          extraClassStyle={styles.companiesBox__input__personalNumber}
          errorText={errors.personalNumber && errors.personalNumber.message}
          tooltip="no tooltip"
          id="cc"
          name="personalNumber"
          autoFocus
          onKeyDown={handleKeyDown}
          ref={register({
            required: t("PERSONAL_NUMBER_IS_REQUIRED"),
            pattern: {
              value: /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/,
              message: t("PERSONAL_NUMBER_IN_CORRECT"),
            },
          })}
          disabled={isDonePNumber}
        />
        {!isDonePNumber && (
          <Button
            customClass={styles.companiesBox__input__customBtn}
            selected={true}
            showSelectedCheckMark={false}
          >
            {!spinner ? (
              "Sök efter mitt företag"
            ) : (
              <CircleSpinner show={true} size="small" />
            )}
          </Button>
        )}
        {isDonePNumber && (
          <Button
            customClass={styles.companiesBox__input__isDoneBtn}
            selected={true}
            showSelectedCheckMark={false}
          >
            <IoMdCheckmark className={styles.checkmark} />
          </Button>
        )}
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
    </div>
  );
};

export default PersonalNumberBox;
