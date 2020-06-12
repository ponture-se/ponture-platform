import React from "react";
import styles from "../styles.module.scss";
const NoBankIdAlert = () => {
  return (
    <div className={styles.noNeedBankIdAlertBox + " animated fadeIn"}>
      <h1>Tack för din ansökan.</h1>
      <span>
        Vad händer nu?
        <br /> En av våra finanskonsulter ska kontakta dig inom kort.
      </span>
      <span>
        Är det akut du är värmt velkommen att kontakta oss direkt på telefon
      </span>

      <span>010 129 29 20</span>
    </div>
  );
};

export default NoBankIdAlert;
