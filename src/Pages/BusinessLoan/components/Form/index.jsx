import React from "react";
import styles from "./styles.module.scss";
import { useForm, FormContext } from "react-hook-form";
import LoanAmount from "./formComponents/LoanAmount";
import NeedsBox from "./formComponents/NeedsBox";
import PersonalNumberBox from "./formComponents/PersonalNumberBox";
import CompaniesBox from "./formComponents/CompaniesBox";
import SubmitBox from "./formComponents/SubmitBox";
import { useLoanState } from "hooks/useLoan";
const LoanForm = () => {
  const { steps } = useLoanState();
  const methods = useForm({
    mode: "onChange",
  });
  const { register } = methods;
  function init() {
    register({ name: "need" });
    register({ name: "personalNumber" });
    register({ name: "orgNumber" });
    register({ name: "orgName" });
  }
  React.useEffect(init, []);

  return (
    <FormContext {...methods}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h2>Ansök om företagslån</h2>
        <LoanAmount />
        {steps[0].isFinished && <NeedsBox />}
        {steps[1].isFinished && steps[1].isFinished && <PersonalNumberBox />}
        {steps[0].isFinished && steps[1].isFinished && steps[2].isFinished && (
          <CompaniesBox />
        )}
        {steps[0].isFinished &&
          steps[1].isFinished &&
          steps[2].isFinished &&
          steps[3].isFinished && <SubmitBox />}
      </form>
    </FormContext>
  );
};

export default LoanForm;
