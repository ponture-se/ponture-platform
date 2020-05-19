import React from "react";
import InputRange from "react-input-range";
import "react-input-range/lib/css/index.css";
import "./sliderStyle.scss";
import styles from "../styles.module.scss";
import Title from "./common/Title";
const Slider = ({
  tooltip,
  title,
  minValue,
  maxValue,
  step,
  unit,
  value,
  onChangedValue,
  manualValueComponent,
}) => {
  return (
    <div className={styles.sliderBox}>
      <div className={styles.sliderBox__top}>
        <div className={styles.sliderBox__info}>
          <Title text={title} tooltip={tooltip} />
          {manualValueComponent(value)}
        </div>
      </div>
      <InputRange
        formatLabel={(value) => `${value} ${unit}`}
        step={step}
        valueLabel="sliderValueLabel"
        inputRange="sliderInputRange"
        minValue={minValue}
        maxValue={maxValue}
        value={value}
        onChange={onChangedValue}
      />
    </div>
  );
};

export default Slider;
