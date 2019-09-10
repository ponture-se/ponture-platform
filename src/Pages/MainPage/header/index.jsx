import React, { useState, useCallback } from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import { useGlobalState, useLocale } from "hooks";

const Header = props => {
  const [{ userInfo }, dispatch] = useGlobalState();
  const { t } = useLocale();
  function handleSignout() {
    sessionStorage.removeItem("@ponture-customer-bankid");
    Cookies.remove("@ponture-customer-portal/token");
    dispatch({
      type: "LOGOUT"
    });
  }
  return (
    <div className="mainHeader">
      <div className="mainHeader__top">
        <div className="mainHeader__img">
          <img src={require("assets/logo-c.png")} alt="logo" />
        </div>
        <div className="mainHeader__userInfo">
          {userInfo && userInfo.firstName + " " + userInfo.lastName}
        </div>
        <div className="mainHeader__signout" onClick={handleSignout}>
          <span>{t("SIGN_OUT")}</span>
          <i className="icon-sign-out" />
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
