import React from "react";
import useLocale from "hooks/useLocale";
const IsLostOpp = () => {
  const { t } = useLocale();
  return (
    <>
      <div className="notAcceptedOfferAlert animated fadeIn">
        <span className="notAcceptedOfferAlert__title">
          {t("OFFER_LOST_TEXT1")}&nbsp;&nbsp;
          <a href="https://www.ponture.com">www.ponture.com</a>
        </span>
      </div>
      <div
        className="notAcceptedOfferAlert animated fadeIn"
        style={{ marginTop: 30 }}
      >
        <span className="notAcceptedOfferAlert__title">
          {t("OFFER_LOST_TEXT2")}
        </span>
      </div>
    </>
  );
};

export default IsLostOpp;
