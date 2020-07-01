import React from "react";
import Cookies from "js-cookie";
import { IoMdBusiness } from "react-icons/io";
import "./styles.scss";
import { useGlobalState, useLocale } from "hooks";

const Header = (props) => {
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const [isOpenMenu, toggleMenu] = React.useState(false);
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
  function openPonturSite() {
    window.open("https://www.ponture.com", "_blank");
  }
  function handleChangeCompanies() {
    if (isOpenMenu) {
      toggleMenu(false);
    }
    dispatch({
      type: "TOGGLE_COMPANIES_MODAL",
    });
  }

  return (
    <div className="mainHeader">
      <div className="mainHeader__top">
        <div className="left">
          <div className="mainHeader__img" onClick={openPonturSite}>
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
            <span className="icon-sign-out"></span>
          </div>
          {userInfo.companies && userInfo.companies.length > 1 ? (
            <>
              <div
                className="mainHeader__changeCompany"
                onClick={handleChangeCompanies}
              >
                <span>{t("OFFERS_HEADER_CHANGE_COMPANIES_TEXT")}</span>
                <IoMdBusiness className="icon" />
              </div>
              <div className="menu">
                <input
                  type="checkbox"
                  className={"menu__checkbox"}
                  id="navi-toggle"
                  checked={isOpenMenu}
                  onChange={(e) => toggleMenu(e.target.checked)}
                />

                <label htmlFor="navi-toggle" className={"menu__button"}>
                  <span className={"menu__icon"}></span>
                </label>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {isOpenMenu ? (
        <div className="mainHeader__bottom">
          <div className="tabItem" onClick={handleChangeCompanies}>
            <IoMdBusiness className="icon" />
            <span>{t("OFFERS_HEADER_CHANGE_COMPANIES_TEXT")}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Header;
