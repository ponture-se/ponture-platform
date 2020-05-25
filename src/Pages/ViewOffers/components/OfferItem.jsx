import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import useLocale from "hooks/useLocale";
import useGlobalState from "hooks/useGlobalState";
import { oppStages } from "../helper";
const OfferItem = (
  { offer = {}, onAcceptClicked, isAccepted, showDetail, opportunity },
  ref
) => {
  const [{ offerUiAction }] = useGlobalState();
  const itemRef = useRef(null);
  const detailRef = useRef(null);
  useImperativeHandle(ref, () => itemRef.current);
  const { t } = useLocale();
  const [moreInfoBox, toggleMoreInfoBox] = useState(showDetail ? true : false);

  function toggle() {
    toggleMoreInfoBox((prev) => !prev);
  }
  const focusOnDetail = () => {
    if (moreInfoBox && !isAccepted)
      if (detailRef.current)
        window.scrollTo(0, window.pageYOffset + detailRef.current.clientHeight);
  };
  React.useEffect(focusOnDetail, [moreInfoBox]);
  function handleAcceptClicked() {
    if (onAcceptClicked) onAcceptClicked(offer);
  }
  function getOfferClass() {
    let cls =
      "offerItem " +
      (isAccepted ? "accepted " : "") +
      (opportunity.opportunityStage === oppStages.won ||
      opportunity.opportunityStage === oppStages.lost
        ? "accepted "
        : "");
    if (!isAccepted && offerUiAction && offerUiAction.name === offer.fakeId) {
      return cls + " " + offerUiAction.className;
    }
    return cls;
  }
  return (
    <div className={getOfferClass()} ref={itemRef}>
      {!isAccepted && (
        <div className="offerItem__alerts">
          {offer.isCheapest && (
            <div className="offerItem__cheapest">
              {t("OFFER_ITEM_CHEAPEST_TITLE")}
            </div>
          )}
          {offer.isBiggest && (
            <div className="offerItem__mostBenefit">
              {t("OFFER_ITEM_BIGGEST_TITLE")}
            </div>
          )}
        </div>
      )}
      <div className="offerItem__content">
        <div className="offerItem__top visible-f-xs">
          {offer.partnerLogo ? (
            <div className="offerItem__img">
              <img src={offer.partnerLogo} alt="" />
            </div>
          ) : (
            <div className="offerItem__noImage">
              <span>{offer.partnerDisplayName}</span>
            </div>
          )}
          {!isAccepted && (
            <button
              className="offerItem__acceptBtn"
              onClick={handleAcceptClicked}
            >
              {t("OFFER_ITEM_ACCEPT_BTN")}
            </button>
          )}
        </div>
        {offer.partnerLogo ? (
          <div className="offerItem__img hidden-xs">
            <img src={offer.partnerLogo} alt="" />
          </div>
        ) : (
          <div className="offerItem__noImage hidden-xs">
            <div>{offer.partnerDisplayName}</div>
          </div>
        )}
        <div className="offerItem__info">
          {offer.inListProps &&
            offer.inListProps.map((item, index) => (
              <div key={index} className="offerItem__value">
                <h4 className="font-bold">
                  {item.value ? item.value : "-----"}
                </h4>
                <span>{item.key}</span>
              </div>
            ))}
        </div>
        {opportunity.opportunityStage !== oppStages.won &&
        opportunity.opportunityStage !== oppStages.lost
          ? !isAccepted && (
              <div className="offerItem__action">
                <button
                  className="offerItem__acceptBtn hidden-xs"
                  onClick={handleAcceptClicked}
                >
                  {t("OFFER_ITEM_ACCEPT_BTN")}
                </button>
                <button className="offerItem__moreBtn" onClick={toggle}>
                  {t("OFFER_ITEM_MORE_BTN")}{" "}
                  <span
                    className={
                      moreInfoBox ? "icon-caret-up" : "icon-caret-down"
                    }
                  />
                </button>
              </div>
            )
          : null}
      </div>
      {!isAccepted && moreInfoBox && (
        <div className="offerItem__details animated fadeIn" ref={detailRef}>
          {offer.inDetailProps &&
            offer.inDetailProps.map((item, index) => {
              return item.value && item.value.length > 0 ? (
                <div key={index} className="offerItem__detailRow">
                  <div className="font-bold">{item.key}</div>
                  <span>{item.value}</span>
                </div>
              ) : null;
            })}
        </div>
      )}
      {offer && offer.detail && offer.detail.Special_Offer && (
        <div className="offerItem__special">{offer.detail.Special_Offer}</div>
      )}
    </div>
  );
};
export default forwardRef(OfferItem);
