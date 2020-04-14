import React from "react";
import Empty from "components/Commons/ErrorsComponent/EmptySVG";
import useLocale from "hooks/useLocale";
const EmptyOffers = () => {
  const { t } = useLocale();
  return (
    <div className="page-empty-list offersEmpty animated fadeIn">
      <Empty />
      <h2>{t("OFFERS_EMPTY_LIST_TITLE")}</h2>
      <span className="msg1">{t("OFFERS_EMPTY_LIST_MSG1")}</span>
      <span className="msg2">{t("OFFERS_EMPTY_LIST_MSG2")}</span>
      <span className="msg3">{t("OFFERS_EMPTY_LIST_MSG3")}</span>
      <span className="msg4">{t("OFFERS_EMPTY_LIST_MSG4")}</span>
      <span className="msg5">{t("OFFERS_EMPTY_LIST_MSG5")}</span>
    </div>
  );
};

export default EmptyOffers;
