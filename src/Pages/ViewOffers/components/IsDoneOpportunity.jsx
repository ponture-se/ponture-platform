import React from "react";
import useLocale from "hooks/useLocale";
const IsDoneOpp = () => {
  const { t } = useLocale();
  return (
    <div className="notAcceptedOfferAlert animated fadeIn">
      <span className="notAcceptedOfferAlert__title">
        {t("OFFER_DONE_TEXT")}
      </span>
    </div>
  );
};

export default IsDoneOpp;
