import React from "react";
import { withRouter } from "react-router-dom";
import useLocale from "hooks/useLocale";
import { Link } from "react-router-dom";
import styles from "../styles.module.scss";

const SuccessFullBankId = ({ history }) => {
  const { t } = useLocale();
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      history.push("/app/panel/offers/");
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [history]);
  return (
    <div className={styles.successFullBankId}>
      <h2 className={styles.successFullBankId__title}>
        {t("SUBMIT_SUCCESS_TITLE")}
      </h2>
      <span className={styles.info}>{t("SUBMIT_SUCCESS_DESCRIPTION")}</span>
      <Link to="/app/panel/offers/" className={styles.link}>
        {t("SUBMIT_SUCCESS_LINK")}
      </Link>
    </div>
  );
};
export default withRouter(SuccessFullBankId);
