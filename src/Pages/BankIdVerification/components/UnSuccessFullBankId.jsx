import React from "react";
import { Link } from "react-router-dom";
import useLocale from "hooks/useLocale";
import Signs from "./Signs";
import styles from "../styles.module.scss";

const UnSuccessFullBankId = ({ oppId }) => {
  const { t } = useLocale();

  function handleLinkClicked() {
    window.location.reload();
  }
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
      <span
        className={styles.link}
        style={{ textDecoration: "underline", cursor: "pointer" }}
        onClick={handleLinkClicked}
      >
        {t("VERIFY_CANCEL_LINK")}
      </span>
      <span className={styles.info}>{t("VERIFY_CANCEL_DESCRIPTION")}</span>
      <Signs />
    </div>
  );
};
export default UnSuccessFullBankId;
