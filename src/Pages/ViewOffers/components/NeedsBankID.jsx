import React from "react";
import useLocale from "hooks/useLocale";

const NeedsBankId = ({ opportunity }) => {
  const { t } = useLocale();
  return (
    <div className="needBankIdBox">
      <h3>{t("OFFERS_NEEDS_VERIFY_BANKID_TEXT")}</h3>
      <button className="btn btn-success1">
        <a href={`/app/loan/verifybankid/${opportunity.opportunityID}/`}>
          {t("OFFERS_NEEDS_VERIFY_BANKID_BUTTON_TEXT")}
        </a>
      </button>
    </div>
  );
};

export default NeedsBankId;
