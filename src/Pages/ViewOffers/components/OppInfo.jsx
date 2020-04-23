import React from "react";
import useLocale from "hooks/useLocale";
const OppInfo = ({ opportunity = {} }) => {
  const { t } = useLocale();
  return (
    <div className="oppInfo">
      <span className="oppInfo__name">
        <span>{t("OFFERS_OPP_HI")} </span>
        <span>
          {opportunity.contactInfo &&
            opportunity.contactInfo.name &&
            opportunity.contactInfo.name}
          {"!"}
        </span>
      </span>
      <div className="oppInfo__detail">
        <h4>{t("OFFERS_OPP_YOUR_INFORMATION")}</h4>
        <h4>
          {t("COMPANY")}: {opportunity.Name && opportunity.Name}{" "}
          {opportunity.orgNumber && "(" + opportunity.orgNumber + ")"}
        </h4>
        <h4>
          {t("OFFERS_OPP_APPLICATION_DATE")}:{" "}
          {opportunity.createdAt && opportunity.createdAt.split(" ")[0]}
        </h4>
      </div>
    </div>
  );
};

export default OppInfo;
