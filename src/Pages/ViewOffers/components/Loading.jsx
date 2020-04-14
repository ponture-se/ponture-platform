import React from "react";
import SquareSpinner from "components/SquareSpinner";
import useLocale from "hooks/useLocale";
const FailedFetch = ({ error }) => {
  const { t } = useLocale();
  return (
    <div className="page-loading">
      <SquareSpinner />
      <h2>{t("OFFERS_LOADING_TEXT")}</h2>
    </div>
  );
};

export default FailedFetch;
