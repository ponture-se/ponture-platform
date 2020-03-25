import React from "react";
import "./style.scss";
import CircleSpinner from "../CircleSpinner";
const InlineCancelButton = props => {
  return (
    <span className="inline-cancel-button" {...props}>
      {props.spinner ? (
        // <CircleSpinner show={true} size="small" />
        "Canceling ..."
      ) : (
        <>
          <i className="icon-cross"></i>
          {" Cancel"}
        </>
      )}
    </span>
  );
};
export default InlineCancelButton;
