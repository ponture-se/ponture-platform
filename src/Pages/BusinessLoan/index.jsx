import React from "react";
import styles from "./styles.module.scss";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Form from "./components/Form";
const ApplyLoan = (props) => {
  return (
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
  );
};

export default ApplyLoan;
