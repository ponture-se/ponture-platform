import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.scss";
import classnames from "classnames";
export default function Modal(props) {
  const { size } = props;
  const { style } = props;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  function closeModal() {
    if (props.onClose) {
      props.onClose();
    }
  }
  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="modal-back" onClick={closeModal}>
        <div
          className={classnames(
            "modal animated fadeIn ",
            size ? size : "md",
            props.className ? props.className : ""
          )}
          style={style}
        >
          {props.children}
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
}
