import React from "react";
import styles from "../../styles.module.scss";
const SliderEditableValue = ({
  value,
  type,
  onChangedValue,
  minValue,
  maxValue,
}) => {
  const [state, setState] = React.useState(value);
  const handleChangeValue = (e) => {
    setState(e.target.value);
  };
  return (
    <div className={styles.sliderEditable}>
      <div className={styles.sliderEditable__input}>
        <input
          type="number"
          value={state}
          onChange={handleChangeValue}
          min={minValue}
          max={maxValue}
        />
      </div>
      <div className={styles.sliderEditable__icon}>
        <i className="icon-cross" />
      </div>
    </div>
  );
};

export default SliderEditableValue;
