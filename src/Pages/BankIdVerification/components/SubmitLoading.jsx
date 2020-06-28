import React from "react";
import useLocale from "hooks/useLocale";
import CircleSpinner from "components/CircleSpinner";
import styles from "../styles.module.scss";

const SuccessFullBankId = () => {
  const { t } = useLocale();
  return (
    <div className={styles.submitSpinner}>
      <span>{t("SUBMIT_SAVING_TEXT_1")}</span>
      <span>{t("SUBMIT_SAVING_TEXT_2")}</span>
      <CircleSpinner show={true} size="large" bgColor="white" />
    </div>
  );
};
export default SuccessFullBankId;
