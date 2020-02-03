import React, { useState, useEffect } from "react";
import { useGlobalState, useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
import track from "utils/trackAnalytic";
import { acceptOffer } from "api/main-api";
import CircleSpinner from "components/CircleSpinner";
//
const Item = props => {
  let didCancel = false;
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const { app, offer } = props;
  const [acceptSpinner, toggleAcceptSpinner] = useState();
  const type =
    offer.Product_Master_Name &&
    offer.Product_Master_Name.includes("Checkkredit")
      ? "checkcredit"
      : "businessloan";
  useEffect(() => {
    return () => {
      didCancel = true;
    };
  }, []);
  function handleAcceptOfferClicked() {
    if (!acceptSpinner) {
      toggleAcceptSpinner(true);
      acceptOffer()
        .onOk(result => {
          track("Accept Offer", "Customer Portal", "Customer Portal", 0);
          if (!didCancel) {
            toggleAcceptSpinner(false);
            if (props.onSuccessAccept) {
              props.onSuccessAccept(result);
            }
          }
        })
        .onServerError(result => {
          if (!didCancel) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("INTERNAL_SERVER_ERROR")
              }
            });
          }
        })
        .onBadRequest(result => {
          if (!didCancel) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("BAD_REQUEST")
              }
            });
          }
        })
        .notFound(result => {
          if (!didCancel) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("NOT_FOUND")
              }
            });
          }
        })
        .unKnownError(result => {
          if (!didCancel) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("UNKNOWN_ERROR")
              }
            });
          }
        })
        .call(offer.Id);
    }
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
        <div className="left">
          <div className="myOfferItem__bodyRow">
            <span>{t("OFFER_TITLE")}</span>
            <span>
              {type === "checkcredit"
                ? t("OFFER_TITLE_VALUE_CHECKCREDIT")
                : t("OFFER_TITLE_VALUE")}{" "}
              {offer.CreatedDate && offer.CreatedDate.split("T")[0]}
            </span>
          </div>
          {offer.outline &&
            offer.outline.length > 0 &&
            offer.outline.map((c, key) => (
              <div className="myOfferItem__bodyRow" key={key}>
                <span>{c.label}</span>
                <span>
                  {c.isShared
                    ? offer[c.apiName]
                      ? offer[c.apiName] +
                        (c.customerUnit ? " " + c.customerUnit + " " : "")
                      : ""
                    : offer.detail
                    ? offer.detail[c.apiName]
                      ? offer.detail[c.apiName] +
                        (c.customerUnit ? " " + c.customerUnit + " " : "")
                      : ""
                    : ""}
                </span>
              </div>
            ))}
        </div>
        {offer.Stage &&
          offer.Stage.toLowerCase() === "offer accepted" &&
          offer.partnerContactInfo && (
            <div className="right">
              {offer.partnerContactInfo.email && (
                <div className="myOfferItem__bodyRow">
                  <span>{t("EMAIL")}</span>
                  <a href={"mailto:" + offer.partnerContactInfo.email}>
                    {offer.partnerContactInfo.email}
                  </a>
                </div>
              )}
              {offer.partnerContactInfo.phone && (
                <div className="myOfferItem__bodyRow">
                  <span>{t("TELEPHONE")}</span>
                  <span>{offer.partnerContactInfo.phone}</span>
                </div>
              )}
              {offer.partnerContactInfo.website && (
                <div className="myOfferItem__bodyRow">
                  <span>{t("WEBSITE")}</span>
                  <a href={offer.partnerContactInfo.website} target="_blank">
                    {offer.partnerContactInfo.website}
                  </a>
                </div>
              )}
              {offer.partnerContactInfo.moreDesc && (
                <div className="myOfferItem__bodyRow">
                  <span>{t("DESCRIPTION")}</span>
                  <span>{offer.partnerContactInfo.moreDesc}</span>
                </div>
              )}
            </div>
          )}
      </div>
      <div className="myOfferItem__footer">
        <div className="myOfferItem__footer__left">
          {offer.Stage && offer.Stage.toLowerCase() === "offer issued" && (
            <>
              <button
                className="btn --success"
                onClick={handleAcceptOfferClicked}
              >
                {acceptSpinner ? (
                  <CircleSpinner show={true} />
                ) : (
                  t("ACCEPT_OFFER")
                )}
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
