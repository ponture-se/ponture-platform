import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody } from "reactstrap";
import CircleSpinner from "./../CircleSpinner";
import "./styles.scss";
import { languageManager } from "../../services";
const PopupAlert = props => {
  const okBtn = useRef(null);
  const { data } = props;
  const [spinner, toggleSpinner] = useState(false);

  useEffect(() => {
    if (okBtn.current) {
      okBtn.current.focus();
    }
  });

  function closeModal() {
    data.onCancel();
    if (spinner) toggleSpinner(false);
  }
  function okClicked() {
    if (!spinner) {
      if (data.isAjaxCall) toggleSpinner(true);
      setTimeout(() => {
        data.onOk();
      }, 500);
    }
  }
  return data === undefined ? null : (
    <Modal isOpen={true} toggle={closeModal}>
      <ModalBody>
        <div className="popup">
          <span className="icon-cross closeIcon" onClick={closeModal} />
          <div className="popup-icon">
            <i className="icon-audio" />
          </div>
          <div className="popup-messsages">
            <span className="popup-title">{data.title}</span>
            <span className="popup-messsage">{data.message}</span>
          </div>
          <div className="popup-ations">
            <button className="btn btn-light" onClick={closeModal}>
              {data.cancelTitle || languageManager.translate("DONT_REMOVE")}
            </button>
            <button className="btn btn-primary" onClick={okClicked} ref={okBtn}>
              {spinner && <CircleSpinner show={spinner} size="small" />}
              {!spinner &&
                (data.okTitle || languageManager.translate("REMOVE"))}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default PopupAlert;
