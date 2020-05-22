import React from "react";
import styles from "../styles.module.scss";
import Profile from "./Profile";
import Form from "./Form";
import NoBankIdAlert from "./NoBankIdAlert";
import { useLoanState } from "hooks/useLoan";
const Content = (props) => {
  const { formStatus } = useLoanState();
  return (
    <div className={styles.content}>
      {formStatus === "form" ? (
        <>
          <div className={styles.profile}>
            <Profile />
          </div>
          <div className={styles.form}>
            <Form />
          </div>
        </>
      ) : formStatus === "noNeedBankId" ? (
        <NoBankIdAlert />
      ) : null}
    </div>
  );
};

export default Content;
