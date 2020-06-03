import React from "react";
import styles from "./styles.module.scss";
const HeaderStep = ({ step = {}, currentStep }) => {
  const { isFinished, isTouched, isHidden } = step;
  return (
    <div
      className={
        styles.headerStep +
        " " +
        (isHidden
          ? styles.headerStep__normal
          : !isTouched && !isFinished
          ? styles.headerStep__normal
          : isFinished
          ? styles.headerStep__finished
          : styles.headerStep__current)
      }
    ></div>
  );
};

export default HeaderStep;
