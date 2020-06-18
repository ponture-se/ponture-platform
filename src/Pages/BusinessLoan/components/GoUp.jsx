import React from "react";
import useLocale from "hooks/useLocale";
import { IoIosArrowUp } from "react-icons/io";
import styles from "../styles.module.scss";

const GoUp = () => {
  const { t } = useLocale();
  function handleClick() {
    window.scrollTo(0, 0);
  }
  return (
    <div className={styles.goUpBox} onClick={handleClick}>
      <div className={styles.goUpBox__circle}>
        <IoIosArrowUp className={styles.goUpBox__icon} />
      </div>
      <h4 className={styles.goUpBox__text}>{t("GO_UP_TEXT")}</h4>
    </div>
  );
};
export default GoUp;
