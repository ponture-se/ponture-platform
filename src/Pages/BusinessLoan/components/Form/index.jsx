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
  React.useEffect(() => {
    register({ name: "amount" });
    register({ name: "amourtizationPeriod" });
    register({ name: "need" });
    register({ name: "personalNumber" });
    register({ name: "orgNumber" });
    register({ name: "orgName" });
    register({ name: "email" });
    register({ name: "phoneNumber" });
  }, [register]);
  return (
    <FormContext {...methods}>
      <div className={styles.form}>
        <h2>Ansök om företagslån</h2>
        <LoanAmount />
        {steps[0].isFinished && <NeedsBox />}
        {steps[1].isFinished && <PersonalNumberBox />}
        {steps[2].isFinished && <CompaniesBox />}
        {steps[3].isFinished && <SubmitBox />}
      </div>
    </FormContext>
  );
};

export default LoanForm;
