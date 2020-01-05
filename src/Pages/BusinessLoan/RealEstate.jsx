import React, { useState, useEffect, useCallback } from "react";
import InputRange from "react-input-range";
import Cookies from "js-cookie";
import "react-input-range/lib/css/index.css";
import classnames from "classnames";
//
import {
  getParameterByName,
  isBankId,
  isNumber,
  isPersonalNumber,
  isPhoneNumber,
  validateEmail
} from "./../../utils";
import CircleSpinner from "./../../components/CircleSpinner";
import {
  useGlobalState,
  useLocale,
  useCookie,
  useNumberRegex
} from "./../../hooks";

export default function RealEstate(props) {
  const [{ b_loan_moreInfo_visibility }, dispatch] = useGlobalState();
  const { t, appLocale, currentLang } = useLocale();
  const [sqMeter, priceIsValid] = props;
  return (
    <div className="bl__infoBox">
      <div className="bl__infoBox__header">
        <div className="bl__infoBox__circleIcon">
          <i className="icon-info" />
        </div>
        <span>{t("BL_REALESTATE_INFO")}</span>
      </div>
      <div className="userInputs">
        <div
          className={
            "bl__input animated fadeIn " + (!priceIsValid ? "--invalid" : "")
          }
        >
          <label className="bl__input__label">{t("PRICE")}</label>
          <div className="bl__input__element">
            <div className="element-group">
              <div className="element-group__center">
                <input
                  type="text"
                  className="my-input"
                  placeholder=""
                  value={orgName}
                  onChange={meterChange}
                />
              </div>
            </div>
            {!sqMeter && (
              <span className="validation-messsage">{sqMeter.validation}</span>
            )}
          </div>
        </div>
        <div
          className={
            "bl__input animated fadeIn " + (!priceIsValid ? "--invalid" : "")
          }
        >
          <label className="bl__input__label">{t("PRICE") + " (Kr)"}</label>
          <div className="bl__input__element">
            <div className="element-group">
              <div className="element-group__center">
                <input
                  type="text"
                  className="my-input"
                  placeholder="3 000 000"
                  value={newOrgPrice.visualValue}
                  onChange={handleNewOrgPriceChanged}
                />
              </div>
            </div>
            {!priceIsValid && (
              <span className="validation-messsage">
                {realEstatePriceValidationMessage}
              </span>
            )}
          </div>
        </div>
      </div>
      <br />
      <br />
    </div>
  );
}
