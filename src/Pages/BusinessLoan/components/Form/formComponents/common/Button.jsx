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
    <div
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
      <div className={styles.text}>{children}</div>
    </div>
  );
};

export default Button;
