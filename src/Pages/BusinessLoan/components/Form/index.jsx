import React from "react";
import styles from "./styles.module.scss";
import LoanAmount from "./formComponents/LoanAmount";
import NeedsBox from "./formComponents/NeedsBox";
import CompaniesBox from "./formComponents/CompaniesBox";
import SubmitBox from "./formComponents/SubmitBox";
const LoanForm = () => {
  return (
    <div className={styles.form}>
      <h2>Ansök om företagslån</h2>
      <LoanAmount />
      <NeedsBox />
      <CompaniesBox />
      <SubmitBox />
    </div>
  );
};

export default LoanForm;
