import React from "react";
import useLocale from "hooks/useLocale";

const AcceptedOffer = ({ acceptedOffer }) => {
  const { t } = useLocale();

  return (
    <div className="acceptedOffer animated fadeIn">
      <h3 className="acceptedOffer__title">
        {t("OFFER_ACCEPTED_ITEM_TITLE")}:{" "}
        {acceptedOffer.partnerContactInfo
          ? acceptedOffer.partnerContactInfo.displayName
            ? acceptedOffer.partnerContactInfo.displayName
            : acceptedOffer.partnerContactInfo.name
          : ""}
      </h3>
      <div className="offerItem">
        <div className="offerItem__content">
          <div className="offerItem__top visible-f-xs">
            <div className="offerItem__img">
              <img src={acceptedOffer.partnerLogo} alt="" />
            </div>
          </div>
          <div className="offerItem__img hidden-xs">
            <img src={acceptedOffer.partnerLogo} alt="" />
          </div>
          <div className="offerItem__info">
            {acceptedOffer.inListProps.map((item, index) => (
              <div key={index} className="offerItem__value">
                <h4 className="font-bold">{item.value}</h4>
                <span>{item.key}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="offerItem__details animated fadeIn">
          {acceptedOffer.inDetailProps.map((item, index) => (
            <div key={index} className="offerItem__detailRow">
              <div className="font-bold">{item.key}</div>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcceptedOffer;
