import React from "react";
import styles from "../../styles.module.scss";
import Tooltip from "./Tooltip";
const Input = ({ title, tooltip, errorText, extraClassStyle, id, ...rest }) => {
  return (
    <div className={styles.inputBox}>
      <div className={styles.inputBox__top}>
        <h4 className={styles.inputBox__title}>{title}</h4>
        {tooltip && <Tooltip text={tooltip} id={id} />}
      </div>
      <input
        className={
          (errorText && styles.input_error) +
          " " +
          styles.inputBox__input +
          " " +
          extraClassStyle
        }
        {...rest}
      />
      {errorText && (
        <span className={styles.inputBox__errorText}>{errorText}</span>
      )}
    </div>
  );
};

export default Input;
