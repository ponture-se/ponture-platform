import React from "react";
import styles from "../../styles.module.scss";
const Button = ({
  children,
  customClass,
  selected,
  showSelectedCheckMark = true,
  warning,
  ...rest
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
        (selected ? styles.selectedButton : "")
      }
      {...rest}
    >
      {selected && showSelectedCheckMark && (
        <div className={styles.checkMarkButton} />
      )}
      {children}
    </button>
  );
};

export default Button;
