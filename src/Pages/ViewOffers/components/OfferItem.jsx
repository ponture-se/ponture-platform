import React, {
  useState,
  forwardRef,
  useRef,
  useImperativeHandle,
} from "react";
import useLocale from "hooks/useLocale";
import useGlobalState from "hooks/useGlobalState";
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
    let cls = "offerItem " + (isAccepted ? "accepted " : "");
    if (!isAccepted && offerUiAction && offerUiAction.name === offer.fakeId) {
      return cls + " " + offerUiAction.className;
    }
    return cls;
  }
  function getDefaultValueSpecial() {
    if (
      offer.detail &&
      offer.detail.Special_Offer &&
      offer.detail.Special_Offer.length > 0
    ) {
      const v = offer.detail.Special_Offer.split("/n")
        .join("")
        .split("/r")
        .join("");
      return <div className="offerItem__special">{v}</div>;
    }
    const a = offer.outline.find((out) => out.apiName === "Special_Offer");
    return a && a.defaultValue ? (
      <div className="offerItem__special">
        {a.defaultValue.split("/n").join("").split("/r").join("")}
      </div>
    ) : undefined;
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
      {getDefaultValueSpecial()}
    </div>
  );
};
export default forwardRef(OfferItem);
