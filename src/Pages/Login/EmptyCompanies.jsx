import React from "react";
import Empty from "components/Commons/ErrorsComponent/EmptySVG";
import useLocale from "hooks/useLocale";
const EmptyCompanies = () => {
  const { t } = useLocale();
  return (
    <div className="emptyCompanies">
      <div className="emptyCompanies__icon">
        <Empty />
      </div>
      <h3 className="title">{t("LOGIN_COMPANIES_EMPTY_TITLE")}</h3>
      <span className="text1">{t("LOGIN_COMPANIES_EMPTY_TEXT1")}</span>
      <span className="text2">{t("LOGIN_COMPANIES_EMPTY_TEXT2")}</span>
      <span className="text3">{t("LOGIN_COMPANIES_EMPTY_ACTION_TITLE")}</span>
      <div className="emptyCompanies__actions">
        <a href="https://www.ponture.com/foretagslan/">
          {t("LOGIN_COMPANIES_EMPTY_ACTION1_TEXT")}
        </a>
        <a href="https://www.ponture.com/fakturakop/">
          {t("LOGIN_COMPANIES_EMPTY_ACTION2_TEXT")}
        </a>
      </div>
    </div>
  );
};
export default EmptyCompanies;
