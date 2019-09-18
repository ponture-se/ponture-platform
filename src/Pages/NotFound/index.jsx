import React from "react";
import { useLocale } from "hooks";
import "./styles.scss";

//
const MyApplications = props => {
  const { t } = useLocale();

  return (
    <div className="notFound animated fadeIn">
      <span className="t404">404</span>
      <span className="title">{t("ERROR_OCCURRED")}</span>
      <span className="info">
        <div>{t("ERROR_MSG1")}</div>
        <div style={{ fontSize: 13 }}>{t("ERROR_MSG2")}</div>
        <div className="phone">
          <span>{t("TELEPHONE")}:</span>
          <span>&nbsp;010 129 29 20</span>
        </div>
        <div className="email">
          <span>{t("EPOST")}:</span>
          <a href="mailto:contact@ponture.com">&nbsp;contact@ponture.com</a>
        </div>
        <div>{t("ERROR_MSG3")}</div>
      </span>
    </div>
  );
};

export default MyApplications;
