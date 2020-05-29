import React, { useState, useEffect } from "react";
import styles from "../styles.module.scss";
import Profile from "./Profile";
import Form from "./Form";
import NoBankIdAlert from "./NoBankIdAlert";
import GoUp from "./GoUp";
import { useLoanState } from "hooks/useLoan";

const Content = (props) => {
  const { formStatus, steps } = useLoanState();
  const [goUpState, toggleGoUp] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset < 1000) toggleGoUp(false);
      else toggleGoUp(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll");
    };
  }, []);
  return (
    <>
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
      {goUpState && <GoUp />}
    </>
  );
};

export default Content;
