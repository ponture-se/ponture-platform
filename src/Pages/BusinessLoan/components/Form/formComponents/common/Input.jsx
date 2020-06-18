import React, { forwardRef } from "react";
import styles from "../../styles.module.scss";
import Tooltip from "./Tooltip";
const Input = (
  { title, tooltip, errorText, extraClassStyle, id, ...rest },
  ref
) => {
  const inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => inputRef.current);
  return (
    <div className={styles.inputBox}>
      <div className={styles.inputBox__top}>
        <h4 className={styles.inputBox__title}>{title}</h4>
        {tooltip && <Tooltip text={tooltip} id={id} />}
      </div>
      <input
        ref={inputRef}
        className={
          (errorText && styles.input_error) +
          " " +
          styles.inputBox__input +
          " " +
          extraClassStyle
        }
        {...rest}
      />
      <span className={styles.inputBox__errorText}>{errorText}</span>
    </div>
  );
};

export default forwardRef(Input);
