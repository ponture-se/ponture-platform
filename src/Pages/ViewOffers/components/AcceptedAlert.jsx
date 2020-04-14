import React from "react";
import useLocale from "hooks/useLocale";
const NotAcceptedAlert = ({ acceptedOffer = {} }) => {
  const { t, tWithVar } = useLocale();
  return (
    <div className="notAcceptedOfferAlert animated fadeIn">
      <span className="notAcceptedOfferAlert__title">
        {tWithVar("OFFER_ACCEPTED_ALERT_EXT", {
          name: acceptedOffer.partnerContactInfo
            ? acceptedOffer.partnerContactInfo.displayName
              ? acceptedOffer.partnerContactInfo.displayName
              : acceptedOffer.partnerContactInfo.name
            : "",
        })}
      </span>
      <span className="notAcceptedOfferAlert__description">
        <span>
          {t("PARTNER_NAME")}{" "}
          {acceptedOffer.partnerContactInfo
            ? acceptedOffer.partnerContactInfo.displayName
              ? acceptedOffer.partnerContactInfo.displayName
              : acceptedOffer.partnerContactInfo.name
            : ""}{" "}
        </span>
        <span>
          <i className="icon-phone" />
          {acceptedOffer.partnerContactInfo &&
          acceptedOffer.partnerContactInfo.phone
            ? acceptedOffer.partnerContactInfo.phone
            : "----"}
        </span>
        <span>
          <i className="icon-envelope" />
          {acceptedOffer.partnerContactInfo &&
          acceptedOffer.partnerContactInfo.email
            ? acceptedOffer.partnerContactInfo.email
            : "----"}
        </span>
      </span>
    </div>
  );
};

export default NotAcceptedAlert;
