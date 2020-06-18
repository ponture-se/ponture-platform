import React from "react";
import CircleSpinner from "components/CircleSpinner";
import useLocale from "hooks/useLocale";
const FailedFetch = ({ error }) => {
  const { t } = useLocale();
  return (
    <div className="page-loading">
      <CircleSpinner show={true} size="large" bgColor="#44b3c2" />
      <h2>{t("OFFERS_LOADING_TEXT")}</h2>
    </div>
  );
};

export default FailedFetch;
