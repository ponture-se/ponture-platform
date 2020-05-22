import React from "react";
import styles from "../styles.module.scss";

const BankIdMenu = () => {
  return (
    <div className={styles.bankIdMenu}>
      <h2>Välj inloggningsalternativ</h2>
      <div className={styles.bankIdOption}>
        <h4>Mobilt BankID på annan enhet</h4>
        <img src={require("assets/bankidLogo.png")} alt="" />
      </div>
      <div className={styles.bankIdOption}>
        <h4>BankID på denna enhet</h4>
        <img src={require("assets/bankidLogo.png")} alt="" />
      </div>
      <div className={styles.info}>
        <div className={styles.info__icon}>
          <i className="icon-shield" />
        </div>
        <span className={styles.info__text}>
          Vår kundsäkerhet är av yttersta vikt för oss därför kräver vi att
          verfiera våra kunder genom BankID. Detta gör dig möjlighet att få
          snabba erbjudanden från oss.
        </span>
      </div>
    </div>
  );
};
export default BankIdMenu;
