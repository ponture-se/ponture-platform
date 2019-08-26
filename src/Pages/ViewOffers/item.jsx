import React from "react";
import { useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
//
const Item = props => {
  const { t } = useLocale();
  const { item } = props;

  function handleAcceptOfferClicked() {
    if (props.onAcceptOfferClicked) {
      props.onAcceptOfferClicked(item);
    }
  }
  function handleEditClicked() {
    if (props.onEditClicked) {
      props.onEditClicked(item);
    }
  }
  function handleCancelClicked() {
    if (props.onCancelClicked) {
      props.onCancelClicked(item);
    }
  }
  function viewApplication() {
    if (props.onViewAppClicked) props.onViewAppClicked(item);
  }

  return (
    <div className="myOfferItem animated fadeIn">
      <div className="myOfferItem__header">
        <img src={require("assets/signicat-logo-black.png")} />
        <span className="myOfferItem__title">Svea Bank</span>
      </div>
      <div className="myOfferItem__body">
        <div className="myOfferItem__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="myOfferItem__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
      </div>
      <div className="myOfferItem__footer">
        <button className="btn --success" onClick={handleAcceptOfferClicked}>
          {t("ACCEPT_OFFER")}
        </button>
        <button className="btn --light" onClick={handleCancelClicked}>
          <span className="icon-cross" />
          {t("CANCEL")}
        </button>
      </div>
    </div>
  );
};
export default Item;
