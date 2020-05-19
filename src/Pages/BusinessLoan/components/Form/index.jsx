import React from "react";
import styles from "./styles.module.scss";
import LoanAmount from "./formComponents/LoanAmount";
import NeedsBox from "./formComponents/NeedsBox";
import PersonalNumberBox from "./formComponents/PersonalNumberBox";
import CompaniesBox from "./formComponents/CompaniesBox";
import SubmitBox from "./formComponents/SubmitBox";
import { useLoanState } from "hooks/useLoan";
const LoanForm = () => {
  const { steps } = useLoanState();
  return (
    <div className={styles.form}>
      <h2>Ansök om företagslån</h2>
      <LoanAmount />
      {steps[0].isFinished && <NeedsBox />}
      {steps[1].isFinished && <PersonalNumberBox />}
      {steps[2].isFinished && <CompaniesBox />}
      {steps[3].isFinished && <SubmitBox />}
    </div>
  );
};

export default LoanForm;
