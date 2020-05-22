import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles.module.scss";

const SuccessFullBankId = () => {
  return (
    <div className={styles.successFullBankId}>
      <h2 className={styles.successFullBankId__title}>
        Din BankID inloggning fortfarande behövs
      </h2>
      <span className={styles.info}>
        Du blir navigerad automatisk till din konto hos oss inom 5 sekunder
      </span>
      <Link to="/app/panel/viewOffers" className={styles.link}>
        Klicka här för att gå vidare
      </Link>
    </div>
  );
};
export default SuccessFullBankId;
