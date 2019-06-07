import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLocale, useLayout, useTheme } from "./../../../hooks";
import { useGlobalState } from "../../../services";
import "./styles.scss";

export default function Header() {
  const { setLocale, appLocale } = useLocale();
  const [lang, changeLang] = useState({ lang: "fa", layout: "rtl" });

  useTheme("theme1");
  useLayout(lang ? lang.layout : "ltr");

  useEffect(() => {
    setLocale(lang ? lang.lang : "en");
  }, [lang]);

  function changeLanguage(lang) {
    changeLang({ lang, layout: lang === "en" ? "ltr" : "rtl" });
  }

  function t(key) {
    return appLocale ? appLocale[key] : "";
  }
  return (
    <div className="mp-header">
      <div className="mp-header__content">
        <div className="mp-header__left">
          <img
            src={require("./../../../assets/logo.png")}
            alt="logo"
            className="mp-header__logo"
          />
          <h5 className="mp-header__logoTitle">
            {appLocale && appLocale["REQTER"]}
          </h5>
        </div>
        <div className="mp-header__center">
          <ul className="mp-header__menuWrapper">
            <li className="mp-header__menuItem">
              <NavLink
                to="/overview"
                className="mp-header__link"
                activeClassName="--active"
              >
                {t("MARKET_HEADER_MENU_TAB1")}
              </NavLink>
            </li>
            <li className="mp-header__link">
              <NavLink
                to="/market"
                className="mp-header__menuItem"
                activeClassName="--active"
              >
                {t("MARKET_HEADER_MENU_TAB2")}
              </NavLink>
            </li>
            <li className="mp-header__link">
              <NavLink
                to="/about"
                className="mp-header__menuItem"
                activeClassName="--active"
              >
                {t("MARKET_HEADER_MENU_TAB3")}
              </NavLink>
            </li>
            <li className="mp-header__link">
              <NavLink
                to="/blog"
                className="mp-header__menuItem"
                activeClassName="--active"
              >
                {t("MARKET_HEADER_MENU_TAB4")}
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="mp-header__right">
          <div className="langs">
            <span onClick={() => changeLanguage("en")}>EN</span>/
            <span onClick={() => changeLanguage("fa")}>فا</span>
          </div>
        </div>
      </div>
    </div>
  );
}
