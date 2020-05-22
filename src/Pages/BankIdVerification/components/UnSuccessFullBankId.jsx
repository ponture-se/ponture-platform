import React from "react";
import styles from "../styles.module.scss";

const UnSuccessFullBankId = () => {
  return (
    <div className={styles.unSuccessFullBankId}>
      <div className={styles.unSuccessFullBankId__header}>
        <div className={styles.unSuccessFullBankId__header__icon}>
          <i className="icon-shield" />
        </div>
        <h2 className={styles.unSuccessFullBankId__header__title}>
          Din BankID inloggning fortfarande behövs
        </h2>
      </div>
      <a href="#" className={styles.link}>
        Tillbakat till inloggning
      </a>
      <span className={styles.info}>
        Vår kundsäkerhet är av yttersta vikt för oss därför kräver vi att
        verfiera våra kunder genom BankID. Detta gör dig möjlighet att få snabba
        erbjudanden från oss.
      </span>
    </div>
  );
};
export default UnSuccessFullBankId;
