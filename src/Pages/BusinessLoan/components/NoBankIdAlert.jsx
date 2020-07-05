import React from "react";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";
const NoBankIdAlert = () => {
  const { t } = useLocale();
  return (
    <div className={styles.noNeedBankIdAlertBox + " animated fadeIn"}>
      <h1>{t("NO_BANKID_NEED_SUCCESS_TITLE")}</h1>
      <span>
        {t("NO_BANKID_NEED_SUCCESS_QUESTION1")}

        <br />
        {t("NO_BANKID_NEED_SUCCESS_QUESTION2")}
      </span>
      <span>{t("NO_BANKID_NEED_SUCCESS_DESCRIPTION")}</span>
      <span>010 129 29 20</span>
    </div>
  );
};

export default NoBankIdAlert;
