import React from "react";
import "./style.scss";
import CircleSpinner from "../CircleSpinner";
const InlineButton = props => {
  return (
    <button
      className="inline-cancel-button"
      {...props}
      disabled={props.disableFeature && props.spinner}
    >
      {props.spinner ? (
        // <CircleSpinner show={true} size="small" />
        props.spinnerText
      ) : (
        <>
          <i className={`icon-${props.icon}`}></i>
          {props.children}
        </>
      )}
    </button>
  );
};
export default InlineButton;
