import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import { useGlobalState, useLocale } from "hooks";

const Header = props => {
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  function handleSignout() {
    sessionStorage.removeItem("@ponture-customer-bankid");
    sessionStorage.removeItem("@ponture-agent-info");
    Cookies.remove("@ponture-customer-portal/token");
    dispatch({
      type: "LOGOUT",
      payload: { lastRole: currentRole }
    });
  }
  return (
    <div className="mainHeader">
      <div className="mainHeader__top">
        <div className="left">
          <div className="mainHeader__img">
            <img src={require("assets/logo-c.png")} alt="logo" />
          </div>
          <div className="mainHeader__title">{t("HEADER_TITLE")}</div>
        </div>
        <div className="right">
          <div className="mainHeader__userInfo">
            {userInfo && currentRole === "agent"
              ? userInfo.name
              : userInfo.firstName + " " + userInfo.lastName}
          </div>
          <div className="mainHeader__signout" onClick={handleSignout}>
            <span>{t("SIGN_OUT")}</span>
            <i className="icon-sign-out" />
          </div>
        </div>
      </div>
      <div className="mainHeader__bottom">
        <div className="tabItem">
          <NavLink
            to={`/app/panel/myApplications`}
            className="navLink"
            activeClassName="active"
          >
            <span>{t("HEADER_TABS_FIRST")}</span>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header;
