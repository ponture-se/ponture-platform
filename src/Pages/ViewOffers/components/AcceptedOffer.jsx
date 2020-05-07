import React from "react";
import useLocale from "hooks/useLocale";

const AcceptedOffer = ({ acceptedOffer }) => {
  const { t } = useLocale();

  return (
    <div className="acceptedOffer animated fadeIn">
      <h3 className="acceptedOffer__title">
        {t("OFFER_ACCEPTED_ITEM_TITLE")}: {acceptedOffer.partnerDisplayName}
      </h3>
      <div className="offerItem">
        <div className="offerItem__content">
          <div className="offerItem__top visible-f-xs">
            {acceptedOffer.partnerLogo ? (
              <div className="offerItem__img">
                <img src={acceptedOffer.partnerLogo} alt="" />
              </div>
            ) : (
              <div className="offerItem__noImage">
                <span>{acceptedOffer.partnerDisplayName}</span>
              </div>
            )}
          </div>
          {acceptedOffer.partnerLogo ? (
            <div className="offerItem__img hidden-xs">
              <img src={acceptedOffer.partnerLogo} alt="logo" />
            </div>
          ) : (
            <div className="offerItem__noImage  hidden-xs">
              <span>{acceptedOffer.partnerDisplayName}</span>
            </div>
          )}
          <div className="offerItem__info">
            {acceptedOffer.inListProps &&
              acceptedOffer.inListProps.map((item, index) => (
                <div key={index} className="offerItem__value">
                  <h4 className="font-bold">
                    {item.value ? item.value : "-----"}
                  </h4>
                  <span>{item.key}</span>
                </div>
              ))}
          </div>
        </div>
        <div className="offerItem__details animated fadeIn">
          {acceptedOffer.inDetailProps &&
            acceptedOffer.inDetailProps.map((item, index) => {
              return item.value && item.value.length > 0 ? (
                <div key={index} className="offerItem__detailRow">
                  <div className="font-bold">{item.key}</div>
                  <span>{item.value}</span>
                </div>
              ) : null;
            })}
        </div>
      </div>
    </div>
  );
};

export default AcceptedOffer;
