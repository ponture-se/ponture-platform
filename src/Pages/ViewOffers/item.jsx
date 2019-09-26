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
