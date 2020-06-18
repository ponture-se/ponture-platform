import React, { forwardRef } from "react";
import styles from "../../styles.module.scss";
const Checkbox = ({ title, id, errorText, extraLabel, ...rest }, ref) => {
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => inputRef.current);
  return (
    <div className={styles.checkbox}>
      <input
        ref={inputRef}
        type="checkbox"
        className={styles.checkbox__chk}
        id={id}
        {...rest}
      />
      <label htmlFor={id} className={styles.checkbox__label}>
        <span className={styles.checkbox__btn}></span>
        {title}
      </label>
      {extraLabel}
      <span className={styles.checkbox__errorText}>{errorText}</span>
    </div>
  );
};

export default forwardRef(Checkbox);
