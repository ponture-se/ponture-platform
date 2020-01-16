import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "./styles.scss";

export default function Modal(props) {
  const { size } = props;
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
        <div className={"modal animated fadeIn " + (size ? size : "md")}>
          {props.children}
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
}
