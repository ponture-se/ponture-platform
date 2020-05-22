import React from "react";
import styles from "./styles.module.scss";
import Header from "./components/Header";
import Content from "./components/Content";
import { LoanProvider } from "hooks/useLoan";
const ApplyLoan = (props) => {
  return (
    <LoanProvider>
      <div className={styles.wrapper}>
        <Header />
        <Content />
      </div>
    </LoanProvider>
  );
};

export default ApplyLoan;
