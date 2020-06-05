import React from "react";
import styles from "../styles.module.scss";
const Signs = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__left}>
        <img
          src="https://www.ponture.com/wp-content/uploads/2020/04/google-rating-score.png"
          alt=""
        />
      </div>
      <div className={styles.footer__right}>
        <span>Ponture AB är registrerade hos Finansinspektionen</span>
        <img
          src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default Signs;
