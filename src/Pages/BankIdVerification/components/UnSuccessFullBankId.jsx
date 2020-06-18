import React from "react";
import useLocale from "hooks/useLocale";
import Signs from "./Signs";
import styles from "../styles.module.scss";

const UnSuccessFullBankId = () => {
  const { t } = useLocale();
  return (
    <div className={styles.unSuccessFullBankId}>
      <div className={styles.unSuccessFullBankId__header}>
        <div className={styles.unSuccessFullBankId__header__icon}>
          <i className="icon-shield" />
        </div>
        <h2 className={styles.unSuccessFullBankId__header__title}>
          {t("VERIFY_CANCEL_TITLE")}
        </h2>
      </div>
      <a href="#" className={styles.link}>
        {t("VERIFY_CANCEL_LINK")}
      </a>
      <span className={styles.info}>{t("VERIFY_CANCEL_DESCRIPTION")}</span>
      <Signs />
    </div>
  );
};
export default UnSuccessFullBankId;
