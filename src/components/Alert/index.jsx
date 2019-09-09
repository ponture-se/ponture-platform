import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CircleSpinner from "./../CircleSpinner";
import "./styles.scss";

let toggleAlert = props => [props];

const Alert = props => {
  const [show, _toggleAlert] = useState(false);
  const [info, setInfo] = useState();
  const [ajaxSpinner, toggleSpinner] = useState(false);

  useEffect(() => {
    if (show) document.body.style.overflowY = "hidden";
    else document.body.style.overflowY = "auto";
  }, [show]);

  toggleAlert = props => {
    setInfo(props);
    _toggleAlert(prev => !prev);
  };
  function handleCloseModal() {
    if (!ajaxSpinner) _toggleAlert(prev => !prev);
  }
  function handleOkBtnClicked() {
    if (!info.func) {
      _toggleAlert(prev => !prev);
    } else {
      toggleSpinner(true);
      let f = info.func();
      if (f.onOk)
        f.onOk(result => {
          toggleSpinner(false);
          if (info.onSuccess) {
            info.onSuccess(result);
          }
          _toggleAlert(prev => !prev);
        });
      if (f.onServerError)
        f.onServerError(result => {
          toggleSpinner(false);
          if (info.onServerError) {
            info.onServerError();
          }
          _toggleAlert(prev => !prev);
        });
      if (f.onBadRequest)
        f.onBadRequest(result => {
          toggleSpinner(false);
          if (info.onServerError) {
            info.onServerError();
          }
          _toggleAlert(prev => !prev);
        });
      if (f.notFound)
        f.notFound(result => {
          toggleSpinner(false);
          if (info.onServerError) {
            info.onServerError();
          }
          _toggleAlert(prev => !prev);
        });
      if (f.unAuthorized)
        f.unAuthorized(result => {
          toggleSpinner(false);
          if (info.unAuthorized) {
            info.unAuthorized();
          }
          _toggleAlert(prev => !prev);
        });
      if (f.unKnownError)
        f.unKnownError(result => {
          toggleSpinner(false);
          if (info.unKnownError) {
            info.unKnownError();
          }
          _toggleAlert(prev => !prev);
        });
      if (f.call) f.call(info.data);
    }
  }
  return show
    ? ReactDOM.createPortal(
        <React.Fragment>
          <div className="alert">
            <div className="alert__bg" onClick={handleCloseModal} />
            <div className="alert__content animated fadeInUp faster">
              <div className="alert__header">
                <span className="title">{info.title}</span>
                <span
                  className="icon-cross closeIcn"
                  onClick={handleCloseModal}
                ></span>
              </div>
              <div className="alert__body">
                <span>{info.description}</span>
              </div>
              <div className="alert__footer">
                <button className="btn --light" onClick={handleCloseModal}>
                  {info.cancelBtnText}
                </button>
                <button
                  className="btn --success"
                  onClick={handleOkBtnClicked}
                  autoFocus
                >
                  {ajaxSpinner ? (
                    <CircleSpinner show={ajaxSpinner} />
                  ) : (
                    info.okBtnText
                  )}
                </button>
              </div>
            </div>
          </div>
        </React.Fragment>,
        document.body
      )
    : null;
};

export { Alert, toggleAlert };
