import React from "react";
import styles from "../styles.module.scss";
const HeaderStep = ({ step }) => {
  const { isFinished, isCurrent } = step;
  return (
    <div
      className={
        styles.headerStep +
        " " +
        (!isCurrent && !isFinished
          ? styles.headerStep__normal
          : isFinished
          ? styles.headerStep__finished
          : styles.headerStep__current)
      }
    ></div>
  );
};

export default HeaderStep;
