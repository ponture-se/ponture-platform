import React, { forwardRef } from "react";
import NumberFormat from "react-number-format";
import styles from "../../styles.module.scss";
import Tooltip from "./Tooltip";
import { Controller, useFormContext } from "react-hook-form";
const CurrencyInput = (
  { title, name, rules, tooltip, errorText, extraClassStyle, id, ...rest },
  ref
) => {
  let inputRef = React.useRef(null);
  React.useImperativeHandle(ref, () => inputRef.current);
  const { control } = useFormContext();
  return (
    <div className={styles.inputBox}>
      <div className={styles.inputBox__top}>
        <h4 className={styles.inputBox__title}>{title}</h4>
        {tooltip && <Tooltip text={tooltip} id={id} />}
      </div>
      <Controller
        as={
          <NumberFormat
            name={name}
            thousandSeparator={" "}
            decimalSeparator={"."}
            decimalScale={2}
            allowNegative={false}
            allowEmptyFormatting={true}
            className={
              (errorText && styles.input_error) +
              " " +
              styles.inputBox__input +
              " " +
              extraClassStyle
            }
            {...rest}
          />
        }
        rules={rules}
        name={name}
        control={control}
      />
      <span className={styles.inputBox__errorText}>{errorText}</span>
    </div>
  );
};

export default forwardRef(CurrencyInput);
