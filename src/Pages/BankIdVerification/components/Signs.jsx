import React from "react";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";
const Signs = () => {
  const { t } = useLocale();
  return (
    <div className={styles.footer}>
      <div className={styles.footer__left}>
        <img
          src="https://www.ponture.com/wp-content/uploads/2020/04/google-rating-score.png"
          alt=""
        />
      </div>
      <div className={styles.footer__right}>
        <span>{t("LOGO_TEXT")}</span>
        <img
          src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
          alt=""
        />
      </div>
    </div>
  );
};

export default Signs;
