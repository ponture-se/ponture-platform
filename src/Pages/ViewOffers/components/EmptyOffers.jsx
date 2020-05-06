import React from "react";
import Empty from "components/Commons/ErrorsComponent/EmptySVG";
import useLocale from "hooks/useLocale";
const EmptyOffers = () => {
  const { t } = useLocale();
  return (
    <div className="page-empty-list offersEmpty animated fadeIn">
      <Empty />
      <h2>{t("OFFERS_EMPTY_LIST_TITLE")}</h2>
      <div className="msg1">{t("OFFERS_EMPTY_LIST_MSG1")}</div>
      <div className="msg2">{t("OFFERS_EMPTY_LIST_MSG2")}</div>
      <div className="msg3">{t("OFFERS_EMPTY_LIST_MSG3")}</div>
      <div className="msg4">{t("OFFERS_EMPTY_LIST_MSG4")}</div>
      <div className="msg5">{t("OFFERS_EMPTY_LIST_MSG5")}</div>
    </div>
  );
};

export default EmptyOffers;
