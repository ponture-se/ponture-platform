import React from "react";
import { IoIosArrowUp } from "react-icons/io";
import styles from "../styles.module.scss";

const GoUp = () => {
  function handleClick() {
    window.scrollTo(0, 0);
  }
  return (
    <div className={styles.goUpBox} onClick={handleClick}>
      <div className={styles.goUpBox__circle}>
        <IoIosArrowUp className={styles.goUpBox__icon} />
      </div>
      <h4 className={styles.goUpBox__text}>Hoppa till toppen</h4>
    </div>
  );
};
export default GoUp;
