import React from "react";
import "./style.scss";
import CircleSpinner from "../CircleSpinner";
const InlineCancelButton = props => {
  return (
    <button
      className="inline-cancel-button"
      {...props}
      disabled={props.disableFeature && props.spinner}
    >
      {props.spinner ? (
        // <CircleSpinner show={true} size="small" />
        "Canceling ..."
      ) : (
        <>
          <i className="icon-cross"></i>
          {" Cancel"}
        </>
      )}
    </button>
  );
};
export default InlineCancelButton;
