import React from "react";
import "./styles.scss";
const CircleSpinner = props => {
  function handleClick() {
    if (props.onClick) {
      props.onClick();
    }
  }
  const classNames =
    "circeSpinnerLoader " +
    (props.size === "small"
      ? "smallCircleSpinner"
      : props.size === "medium"
      ? "mediumCircleSpinner"
      : props.size === "large"
      ? "largeCircleSpinner"
      : "smallCircleSpinner");
  return props.show ? (
    <div
      style={{
        borderColor: props.bgColor || "#f3f3f3",
        borderTopColor: props.color || "rgb(66, 204, 173)",
      }}
      className={classNames}
      onClick={handleClick}
    />
  ) : null;
};
export default CircleSpinner;
