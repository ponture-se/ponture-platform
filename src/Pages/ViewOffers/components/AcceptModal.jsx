import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import CircleSpinner from "components/CircleSpinner";
import { isPhoneNumber, validateEmail } from "utils";
import { acceptOffer } from "api/main-api";
import track from "utils/trackAnalytic";
import useGlobalState from "hooks/useGlobalState";
import useLocale from "hooks/useLocale";

const AcceptModal = ({
  onClose,
  onEndAccepting,
  opportunity = {},
  selectedOffer,
}) => {
  const [{}, dispatch] = useGlobalState();
  const { t, tWithVar } = useLocale();
  const [state, setState] = useState({
    spinner: false,
    phone: opportunity.contactInfo.phone,
    email: opportunity.contactInfo.email,
    formError: { phone: false, email: false },
  });
  const { spinner, phone, email, formError } = state;

  const updateState = (changes) =>
    setState((prevState) => ({ ...prevState, ...changes }));

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "auto");
  }, []);

  function close() {
    if (onClose) onClose();
  }
  const showError = () => {
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: "error",
        message: "Failed accepting the offer.",
      },
    });
  };
  function handleAccept() {
    updateState({ spinner: true });
    acceptOffer()
      .onOk((result) => {
        track("Accept Offer", "Customer Portal", "Customer Portal", 0);
        close();
        if (onEndAccepting) onEndAccepting();
      })
      .onServerError((result) => {
        updateState({ spinner: false });
        showError();
      })
      .onBadRequest((result) => {
        updateState({ spinner: false });
        showError();
      })
      .notFound((result) => {
        updateState({ spinner: false });
        showError();
      })
      .unKnownError((result) => {
        updateState({ spinner: false });
        showError();
      })
      .onRequestError((result) => {
        updateState({ spinner: false });
        showError();
      })
      .call(selectedOffer.Id, phone, email);
  }

  function handleInputChanged(e) {
    const name = e.target.name;
    const value = e.target.value;
    let isValid = false;
    if (name === "email") {
      isValid = !validateEmail(value);
    } else {
      if (value.length === 0) {
        isValid = true;
      } else {
        if (!isPhoneNumber(value)) isValid = true;
      }
    }
    updateState({
      [name]: value,
      formError: { ...formError, [name]: isValid },
    });
  }

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="acceptModal">
        <div className="acceptModal__bg" onClick={close} />
        <div className="acceptModal__content animated fadeInUp faster">
          <div className="acceptModal__header">
            <span className="title"></span>
            <div className="icon-cross closeIcn" onClick={close} />
          </div>
          <div className="acceptModal__body">
            <span className="font-bold acceptModal__title">
              {t("OFFER_ACCEPT_MODAL_TITLE")}
            </span>
            <div className="personalInfo">
              <div className="personalInfo__left">
                <div className="personalInfoForm">
                  <span className="personalInfoForm__title font-bold">
                    {t("OFFER_ACCEPT_MODAL_FORM_TITLE")}
                  </span>
                  <div className="form-inputgroup">
                    <label>{t("OFFER_ACCEPT_MODAL_FORM_PHONE_TITLE")}</label>
                    <input
                      placeholder={t(
                        "OFFER_ACCEPT_MODAL_FORM_PHONE_PLACEHOLDER"
                      )}
                      value={phone}
                      name="phone"
                      className={formError.phone ? "input-error" : ""}
                      onChange={handleInputChanged}
                    />
                  </div>
                  <div className="form-inputgroup">
                    <label>{t("OFFER_ACCEPT_MODAL_FORM_EMAIL_TITLE")}</label>
                    <input
                      className={formError.email ? "input-error" : ""}
                      type="email"
                      placeholder={t(
                        "OFFER_ACCEPT_MODAL_FORM_EMAIL_PLACEHOLDER"
                      )}
                      value={email}
                      name="email"
                      onChange={handleInputChanged}
                    />
                  </div>
                </div>
                <div className="personalInfo__desc font-bold">
                  {tWithVar("OFFER_ACCEPT_MODAL_FORM_DESCRIPTION", {
                    partnerName: selectedOffer.partnerName,
                  })}
                </div>
              </div>
              <div className="personalInfo__right">
                <div className="rowInfo">
                  <div className="rowInfo__icon">
                    <i className="icon-checkmark" />
                  </div>
                  <span className="rowInfo__text">
                    {t("OFFER_ACCEPT_MODAL_INFO_FIRST")}
                  </span>
                </div>
                <div className="rowInfo">
                  <div className="rowInfo__icon">
                    <i className="icon-checkmark" />
                  </div>
                  <span className="rowInfo__text">
                    {t("OFFER_ACCEPT_MODAL_INFO_SECOND")}
                  </span>
                </div>
                <div className="rowInfo">
                  <div className="rowInfo__icon">
                    <i className="icon-checkmark" />
                  </div>
                  <span className="rowInfo__text">
                    {t("OFFER_ACCEPT_MODAL_INFO_THIRD")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="acceptModal__footer">
            <button className="btn btn-light1" onClick={close}>
              {t("OFFER_ACCEPT_MODAL_CANCEL_BTN")}
            </button>
            <button
              className="btn btn-success1 font-bold"
              onClick={handleAccept}
              disabled={Object.keys(formError).some((k) => formError[k])}
            >
              {spinner ? (
                <CircleSpinner show={true} />
              ) : (
                t("OFFER_ACCEPT_MODAL_SUBMIT_BTN")
              )}
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
};

export default AcceptModal;
