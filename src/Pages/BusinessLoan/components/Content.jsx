import React, { useState, useEffect } from "react";
import styles from "../styles.module.scss";
import Profile from "./Profile";
import Form from "./Form";
import Loading from "components/SquareSpinner";
import NoBankIdAlert from "./NoBankIdAlert";
import { useLoanState } from "hooks/useLoan";
import useLocale from "hooks/useLocale";
import useLoanApi from "hooks/useLoan/useLoanApi";

const Content = (props) => {
  const { formStatus } = useLoanState();
  const { getNeeds } = useLoanApi();
  const { t } = useLocale();
  const [loading, toggleLoading] = useState(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const init = () => {
    getNeeds(
      (needs) => {
        toggleLoading(false);
      },
      () => {
        toggleLoading(false);
      }
    );
  };
  useEffect(init, []);
  return (
    <div className={styles.content}>
      {loading ? (
        <Loading text={t("LOADING_TEXT")} />
      ) : formStatus === "form" ? (
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
