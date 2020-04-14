import React from "react";
import useLocale from "hooks/useLocale";
const NotAcceptedAlert = () => {
  const { t } = useLocale();
  return (
    <div className="notAcceptedOfferAlert animated fadeIn">
      <span className="notAcceptedOfferAlert__title hidden-xs">
        {t("OFFER_NOT_ACCEPTED_TITLE")}
      </span>
      <span className="notAcceptedOfferAlert__description hidden-xs">
        {t("OFFER_NOT_ACCEPTED_DESCRIPTION")}
      </span>
      <span className="notAcceptedOfferAlert__title visible-f-xs">
        {t("OFFER_NOT_ACCEPTED_TITLE_XS")}
      </span>
      <span className="notAcceptedOfferAlert__description visible-f-xs">
        {t("OFFER_NOT_ACCEPTED_DESCRIPTION_SX")}
      </span>
    </div>
  );
};

export default NotAcceptedAlert;
