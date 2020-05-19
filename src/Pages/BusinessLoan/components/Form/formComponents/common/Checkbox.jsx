import React from "react";
import styles from "../../styles.module.scss";
const Checkbox = ({ title, id, ...rest }) => {
  return (
    <div className={styles.checkbox}>
      <input
        type="checkbox"
        className={styles.checkbox__chk}
        id={id}
        {...rest}
      />
      <label htmlFor={id} className={styles.checkbox__label}>
        <span className={styles.checkbox__btn}></span>
        {title}
      </label>
    </div>
  );
};

export default Checkbox;
