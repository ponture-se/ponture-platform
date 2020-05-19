import React from "react";
import styles from "../../styles.module.scss";
const Button = ({
  children,
  customClass,
  selected,
  showSelectedCheckMark = true,
  warning,
}) => {
  return (
    <button
      className={
        styles.button +
        " " +
        (warning ? styles.warningBtn : styles.primaryBtn) +
        " " +
        (customClass ? customClass : "") +
        " " +
        (selected ? styles.selectedButton : "") +
        " " +
        (selected && showSelectedCheckMark ? styles.checkMarkButton : "")
      }
    >
      {children}
    </button>
  );
};

export default Button;
