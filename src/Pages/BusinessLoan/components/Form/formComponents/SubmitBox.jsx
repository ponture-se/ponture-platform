import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Checkbox from "./common/Checkbox";
import { useLoanDispatch } from "hooks/useLoan";
import useLocale from "hooks/useLocale";
import CircleSpinner from "components/CircleSpinner";

const SubmitBox = () => {
  const {
    errors,
    register,
    handleSubmit,
    formState: { dirty, isValid, submitCount },
  } = useFormContext();
  const submitBoxRef = React.useRef(null);
  const dispatch = useLoanDispatch();
  const { t } = useLocale();
  const [spinner, toggleSpinner] = React.useState(false);
  React.useEffect(() => {
    if (submitBoxRef.current) {
      window.scrollTo(0, submitBoxRef.current.offsetTop);
    }
  }, [register]);

  const onSubmit = async (data) => {
    if (submitCount === 1) {
      toggleSpinner(true);
      setTimeout(() => {
        toggleSpinner(false);
        dispatch({
          type: "SET_FORM_STATUS",
          payload: "noNeedBankId",
        });
      }, 1000);
    }
  };
  return (
    <div ref={submitBoxRef} className={styles.submitBox}>
      <div className={styles.submitBox__inputs}>
        <Input
          title="Företagetsomsättning under de senaste 12 månader"
          placeholder="t.ex.  1 200 000 kr"
          extraClassStyle={styles.submitBox__inputs__turnOver}
          tooltip="no tooltip"
          id="ff"
          errorText={errors.lastYear && errors.lastYear.message}
          ref={register({
            required: "this is a required",
            maxLength: {
              value: 9,
              message: "This is not valid value.",
            },
          })}
          name="lastYear"
          type="number"
          min="0"
          max="999999999"
        />
        <div className={styles.submitBox__twoColumns}>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt telefonnummer"
              placeholder="t.ex.  070 980 20 91"
              extraClassStyle={styles.submitBox__inputs__phone}
              ref={register({
                required: "this is a required",
                pattern: {
                  value: /^(\+46|0|0046)[\s\-]?[1-9][\s\-]?[0-9]([\s\-]?\d){7,8}$/,
                  message: "Invalid phone number",
                },
              })}
              name="phoneNumber"
              errorText={errors.phoneNumber && errors.phoneNumber.message}
            />
          </div>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt e-post"
              placeholder="t.ex fredrik@comany.com"
              extraClassStyle={styles.submitBox__inputs__email}
              errorText={errors.email && errors.email.message}
              ref={register({
                required: "this is a required",
                pattern: {
                  value: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                  message: "Invalid email address",
                },
              })}
              name="email"
            />
          </div>
        </div>
      </div>
      <div className={styles.submitBox__terms}>
        <Checkbox
          title="Härmed godkänner jag"
          id="termChk"
          name="terms"
          ref={register({ required: t("BL_TERMS_IS_REQUIRED") })}
          errorText={errors.terms && errors.terms.message}
        />
        <a
          href="https://www.ponture.com/eula"
          target="_blank"
          rel="noopener noreferrer"
        >
          användarvillkoren.
        </a>
      </div>
      <div className={styles.submitBox__actions}>
        <Button
          type="submit"
          customClass={styles.submitBox__customBtn}
          warning
          onClick={handleSubmit(onSubmit)}
        >
          {spinner ? <CircleSpinner show={true} /> : "Skicka"}
        </Button>
        <div className={styles.submitBox__actions__link}>
          <a href="/app/loan">Börja om</a>
          <a href="/app/loan">
            (Om du klicka här kommer förmuläret att nollställas)
          </a>
        </div>
      </div>
      {!isValid && (
        <div className={styles.submitBox__errors}>
          <ul>
            {Object.keys(errors).map((item, index) => (
              <li key={index}>{item + "-" + errors[item].message}</li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.submitBox__info}>
        {[
          "Ansökan är kostnadsfritt",
          "Vi tar bara en UC kreditupplysning på ditt företag",
          "Du binder dig inte till något",
          "Våra finanskonsulter finns för att hjälpa dig inom hela processen",
        ].map((item, index) => (
          <div className={styles.rowInfo} key={index}>
            <div className={styles.rowInfo__chk} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitBox;
