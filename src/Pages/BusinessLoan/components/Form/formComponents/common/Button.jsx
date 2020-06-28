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
        <button className={styles.checkMarkButton} />
      )}
<<<<<<< HEAD
      <div className={styles.text}>{children}</div>
=======
      <div className={styles.textDiv}>{children}</div>
>>>>>>> B-loan-cross-browser
    </button>
  );
};

export default Button;
