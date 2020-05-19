import React from "react";
import styles from "./styles.module.scss";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Form from "./components/Form";
import { LoanProvider } from "hooks/useLoan";
const ApplyLoan = (props) => {
  return (
    <LoanProvider>
      <div className={styles.wrapper}>
        <Header />
        <div className={styles.content}>
          <div className={styles.profile}>
            <Profile />
          </div>
          <div className={styles.form}>
            <Form />
          </div>
        </div>
      </div>
    </LoanProvider>
  );
};

export default ApplyLoan;
