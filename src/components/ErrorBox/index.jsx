import React from "react";
import styles from "./styles.module.scss";
import useLocale from "hooks/useLocale";

const ErrorBox = ({ title }) => {
  const { t } = useLocale();
  function refreshPage() {
    window.location.reload();
  }
  return (
    <div className={"animated fadeIn " + styles.errorBox}>
      <div className={styles.top}>
        <div className={styles.errorIcon}>
          <i className="icon-warning" />
        </div>
        <h4 className={styles.errorTopText}>
          {title ? title : t("ERROR_OCCURRED")}!
        </h4>
      </div>
      <hr />
      <div className={styles.longDesc}>
        <div className={styles.allErrorMsg}>
          <div>{t("ERROR_MSG1")}</div>
          <div style={{ fontSize: 13 }}>{t("ERROR_MSG2")}</div>
          <div className={styles.phone}>
            <span>{t("TELEPHONE")}</span>
            <span>&nbsp;010 129 29 20</span>
          </div>
          <div className={styles.email}>
            <span>{t("EPOST")}:</span>
            <a href="mailto:contact@ponture.com">&nbsp;contact@ponture.com</a>
          </div>
          <div>{t("ERROR_MSG3")}</div>
        </div>
      </div>
      <div className={styles.actions}>
        <button className="btn btn-warning" onClick={refreshPage}>
          {t("REFRESH")}
        </button>
      </div>
    </div>
  );
};

export default ErrorBox;
