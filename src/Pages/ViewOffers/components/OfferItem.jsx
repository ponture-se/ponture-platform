import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import useLocale from "hooks/useLocale";
import useGlobalState from "hooks/useGlobalState";
const OfferItem = (
  { offer = {}, onAcceptClicked, isAccepted, showDetail },
  ref
) => {
  const [{ offerUiAction }] = useGlobalState();
  const itemRef = useRef(null);
  useImperativeHandle(ref, () => itemRef.current);
  const { t } = useLocale();
  const [moreInfoBox, toggleMoreInfoBox] = useState(showDetail ? true : false);
  function toggle() {
    toggleMoreInfoBox((prev) => !prev);
  }
  function handleAcceptClicked() {
    if (onAcceptClicked) onAcceptClicked(offer);
  }
  function getOfferClass() {
    let cls = "offerItem " + (isAccepted ? "accepted " : "");
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
          <div className="offerItem__img">
            <img src={offer.partnerLogo} alt="" />
          </div>
          {!isAccepted && (
            <button
              className="offerItem__acceptBtn"
              onClick={handleAcceptClicked}
            >
              {t("OFFER_ITEM_ACCEPT_BTN")}
            </button>
          )}
        </div>
        <div className="offerItem__img hidden-xs">
          <img src={offer.partnerLogo} alt="" />
        </div>
        <div className="offerItem__info">
          {offer.inListProps.map((item, index) => (
            <div key={index} className="offerItem__value">
              <h4 className="font-bold">{item.value}</h4>
              <span>{item.key}</span>
            </div>
          ))}
        </div>
        {!isAccepted && (
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
                className={moreInfoBox ? "icon-caret-up" : "icon-caret-down"}
              />
            </button>
          </div>
        )}
      </div>
      {!isAccepted && moreInfoBox && (
        <div className="offerItem__details animated fadeIn">
          {offer.inDetailProps.map((item, index) => (
            <div key={index} className="offerItem__detailRow">
              <div className="font-bold">{item.key}</div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default forwardRef(OfferItem);
