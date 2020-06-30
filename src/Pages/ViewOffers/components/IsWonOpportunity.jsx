import React from "react";
import useLocale from "hooks/useLocale";
const IsWonOpp = ({ acceptedOffer = {} }) => {
  const { t } = useLocale();
  return (
    <>
      <div className="notAcceptedOfferAlert animated fadeIn">
        <span className="notAcceptedOfferAlert__title">
          {t("OFFER_WON_TEXT1")}&nbsp;&nbsp;
          <a href="https://www.ponture.com">www.ponture.com</a>
        </span>
      </div>
      <div className="notAcceptedOfferAlert animated fadeIn">
        <span className="notAcceptedOfferAlert__title">
          {t("OFFER_WON_TEXT2")}
        </span>
        <span className="notAcceptedOfferAlert__title" style={{ fontSize: 13 }}>
          {t("OFFER_WON_TEXT3")}
        </span>
        <span className="notAcceptedOfferAlert__description">
          <span>
            {t("PARTNER_NAME")} {acceptedOffer.partnerDisplayName}
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
      <div className="acceptedOffer animated fadeIn">
        <div className="offerItem">
          <div className="offerItem__content" style={{ marginTop: 15 }}>
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
        </div>
      </div>
    </>
  );
};

export default IsWonOpp;
