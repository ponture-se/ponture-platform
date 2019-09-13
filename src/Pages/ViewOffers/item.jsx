import React from "react";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";

//
const Item = props => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const { app, offer } = props;

  function handleAcceptOfferClicked() {
    if (props.onAcceptClicked) props.onAcceptClicked(offer);
  }
  function handleRejectClicked() {
    if (props.onRejectClicked) props.onRejectClicked(offer);
  }
  function handleViewOffer() {
    if (props.onViewOffersClicked) props.onViewOffersClicked(offer);
  }

  return (
    <div className="myOfferItem animated fadeIn">
      <div className="myOfferItem__header">
        <span>{offer.partnerName}</span>
      </div>
      <div className="myOfferItem__body">
        <div className="myOfferItem__bodyRow">
          <span>{t("OFFER_TITLE")}</span>
          <span>
            {t("OFFER_TITLE_VALUE")}{" "}
            {offer.CreatedDate && offer.CreatedDate.split("T")[0]}
          </span>
        </div>
        {offer.outline &&
          offer.outline.length > 0 &&
          offer.outline.map(c => (
            <div className="myOfferItem__bodyRow">
              <span>{c.label}</span>
              {c.type.toLowerCase() === "currency" ? (
                <span>
                  {c.isShared
                    ? separateNumberByChar(offer[c.apiName]) +
                      (c.customerUnit ? " " + c.customerUnit + " " : "")
                    : offer.detail
                    ? separateNumberByChar(offer.detail[c.apiName]) +
                      (c.customerUnit ? " " + c.customerUnit + " " : "")
                    : ""}
                </span>
              ) : (
                <span>
                  {c.isShared
                    ? offer[c.apiName] +
                      (c.customerUnit ? " " + c.customerUnit + " " : "")
                    : offer.detail
                    ? offer.detail[c.apiName] +
                      (c.customerUnit ? " " + c.customerUnit + " " : "")
                    : ""}
                </span>
              )}
            </div>
          ))}
      </div>
      <div className="myOfferItem__footer">
        <div className="myOfferItem__footer__left">
          {offer.Stage && offer.Stage.toLowerCase() === "offer issued" && (
            <>
              <button
                className="btn --success"
                onClick={handleAcceptOfferClicked}
              >
                {t("ACCEPT_OFFER")}
              </button>
              <button className="btn --warning" onClick={handleRejectClicked}>
                {t("REJECT")}
              </button>
            </>
          )}
          {offer.Stage && offer.Stage.toLowerCase() === "offer accepted" && (
            <button className="btn --success">
              <span className="icon-checkmark"></span>
              {t("OFFER_ACCEPTED")}
            </button>
          )}
          {offer.Stage && offer.Stage.toLowerCase() === "offer lost" && (
            <button className="btn --warning">
              <span className="icon-cross"></span>
              {t("OFFER_REJECTED")}
            </button>
          )}
        </div>
        {/* <div className="myOfferItem__footer__right">
          <button className="btn --light" onClick={handleViewOffer}>
            {t("VIEW_DETAIL")}
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default Item;
