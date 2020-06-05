import React from "react";
import { IoMdPhonePortrait } from "react-icons/io";
import isMobileDevice from "utils/isMobileDevice";
import Signs from "./Signs";
import styles from "../styles.module.scss";

const BankIdMenu = () => {
  const isMobile = isMobileDevice();
  return (
    <div className={styles.bankIdMenu}>
      <h2>Välj inloggningsalternativ</h2>
      <div className={styles.bankIdOption}>
        <h4>
          {!isMobile
            ? "Mobilt BankID på annan enhet"
            : "Mobilt BankID på denna enhet"}
        </h4>
        <IoMdPhonePortrait className={styles.mobileIcon} />
        <img src={require("assets/bankidLogo.png")} alt="" />
      </div>
      <div className={styles.bankIdOption}>
        <h4>{!isMobile ? "BankID på denna enhet" : "BankID på annan enhet"}</h4>
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
      <Signs />
    </div>
  );
};
export default BankIdMenu;
