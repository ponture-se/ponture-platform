import React from "react";
import Cookies from "js-cookie";
import { NavLink } from "react-router-dom";
import "./styles.scss";
import { useGlobalState, useLocale } from "hooks";

const Header = (props) => {
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  function handleSignout() {
    sessionStorage.removeItem("@ponture-customer-bankid");
    sessionStorage.removeItem("@ponture-user-info");
    Cookies.remove("@ponture-customer-portal/token");
    dispatch({
      type: "LOGOUT",
      payload: { lastRole: currentRole },
    });
  }
  return (
    <div className="mainHeader">
      <div className="mainHeader__top">
        <div className="left">
          <div className="mainHeader__img">
            <img src={require("assets/logo-c.png")} alt="logo" />
          </div>
          <div className="mainHeader__title">
            <span>{t("HEADER_TITLE_MY")}</span>{" "}
            <span>{t("HEADER_TITLE_OFFERS")}</span>
          </div>
        </div>
        <div className="right">
          <div className="mainHeader__signout" onClick={handleSignout}>
            <span>{t("SIGN_OUT")}</span>
          </div>
          <div className="mainHeader__userInfo hidden-xs">
            {userInfo &&
              (["admin", "agent"].indexOf(currentRole) > -1
                ? userInfo.name
                : userInfo.firstName + " " + userInfo.lastName)}
          </div>
        </div>
      </div>
      <div className="mainHeader__bottom">
        <div className="tabItem"></div>
      </div>
    </div>
  );
};

export default Header;
