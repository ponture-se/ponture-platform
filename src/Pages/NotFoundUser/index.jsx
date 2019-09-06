import React from "react";
import { Link } from "react-router-dom";
import { useLocale } from "hooks";
import NoData from "components/Commons/ErrorsComponent/NoData";
import "./styles.scss";
//
const NotFoundUser = props => {
  const { t } = useLocale();
  return (
    <div className="noApplied animated fadeIn">
      <div className="box">
        <NoData />
        <span className="title">{t("CUSTOMER_LOGIN_NO_APP_TITLE")}</span>
        <span className="info1">{t("CUSTOMER_LOGIN_NO_APP_INFO1")}</span>
        <span className="info2">{t("CUSTOMER_LOGIN_NO_APP_INFO2")}</span>
        <span className="question">{t("CUSTOMER_LOGIN_NO_APP_QUESTION")}</span>
        <div className="actions">
          <button className="btn --success">
            <Link to="/app/loan">{t("CUSTOMER_LOGIN_NO_APP_BTN_LOAN")}</Link>
          </button>
          <button className="btn --success">
            <a href="https://www.ponture.com/fakturakop/">
              {t("CUSTOMER_LOGIN_NO_APP_BTN_F")}
            </a>
          </button>
        </div>
        <span className="info3">{t("CUSTOMER_LOGIN_NO_APP_INFO3")}</span>
      </div>
    </div>
  );
};

export default NotFoundUser;
