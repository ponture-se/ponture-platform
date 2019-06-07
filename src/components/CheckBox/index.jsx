import React from "react";
import "./styles.scss";
const CheckBox = props => {
  return (
    <label className="checkBox">
      {props.title}
      <input type="checkbox" {...props} />
      <span className="checkmark" />
    </label>
  );
};

export default CheckBox;
