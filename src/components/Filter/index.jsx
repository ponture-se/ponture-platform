import React, { useState } from "react";
import { useLocale } from "hooks";
import { isPersonalNumber, isPhoneNumber, validateEmail } from "../../utils";
import "./style.scss";
import "Pages/MyApplications/styles.scss";
const Filter = props => {
  const orgNumberFormatRegex = new RegExp(/^([0-9]){6}-?([0-9]){4}$/);
  //state initialization
  const { t } = useLocale();
  const [filter, setFilter] = useState({
    org_number: "",
    org_name: "",
    email: "",
    phone: "",
    opp_number: "",
    contact_name: "",
    personal_number: ""
  });
  const [filterErrorMessage, setFilterErrorMessage] = useState({
    org_number: "",
    org_name: "",
    email: "",
    phone: "",
    opp_number: "",
    contact_name: "",
    personal_number: ""
  });
  //pNum: personalNumber
  //BankId function
  function applyFilter() {
    let isFormValid = true;
    for (const vMessage in filterErrorMessage) {
      if (filterErrorMessage[vMessage]) {
        isFormValid = false;
      }
    }
    if (isFormValid) {
      const _filter = {
        ...filter,
        personal_number: filter.personal_number.replace("-", "")
      };
      if (typeof props.searchFunc === "function") {
        props.searchFunc(_filter);
      }
    }
  }
  function updateFilters(e) {
    let errorMessage = "";
    const { name, value } = e.target;
    switch (name) {
      case "org_number":
        if (value.length > 0 && !orgNumberFormatRegex.test(value)) {
          errorMessage = t("INVALID_ORGNUMBER");
        } else {
          errorMessage = "";
        }
        break;
      case "org_name":
        break;
      case "email":
        if (value.length > 0 && !validateEmail(value)) {
          errorMessage = t("EMAIL_IN_CORRECT");
        } else {
          errorMessage = "";
        }
        break;
      case "phone":
        if (value.length > 0 && !isPhoneNumber(value)) {
          errorMessage = t("PHONE_NUMBER_IN_CORRECT");
        } else {
          errorMessage = "";
        }
        break;
      // case "opp_number":
      //   if (value.length > 0 && !isNumber(value)) {
      //     errorMessage = t("INVALID_VALUE");
      //   } else {
      //     errorMessage = "";
      //   }
      //   break;
      case "contact_name":
        break;
      case "personal_number":
        if (value.length > 0 && !isPersonalNumber(value)) {
          errorMessage = t("PERSONAL_NUMBER_IN_CORRECT");
        } else {
          errorMessage = "";
        }
        break;
      default:
    }
    setFilter({
      ...filter,
      [name]: value
    });
    setFilterErrorMessage({
      ...filterErrorMessage,
      [name]: errorMessage
    });
  }
  return (
    <div className="filter application animated fadeIn">
      {/* Application header info */}
      <div className="application__header">
        <div className="left">
          <div className="icon">
            <i className="icon-filter"></i>
          </div>
        </div>
        <div className="right">
          <div className="info">
            <span>{t("FILTER")}</span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="application__body">
        <div className="filter__items-box" key={"contact_name"}>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("Contact name")}
              {/* //T */}
            </label>
            <input
              // key={"contact_name"}
              name="contact_name"
              onChange={updateFilters}
              value={filter.contact_name}
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.contact_name}
            </span>
          </div>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("Organization name")}
              {/* //T */}
            </label>
            <input
              name="org_name"
              value={filter.org_name}
              onChange={updateFilters}
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.org_name}
            </span>
          </div>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("Organization number")}
              {/* //T */}
            </label>
            <input
              name="org_number"
              onChange={updateFilters}
              value={filter.org_number}
              placeholder={t("ORGNUMBER_PLACEHOLDER")}
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.org_number}
            </span>
          </div>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("Personal number")}
              {/* //T */}
            </label>
            <input
              name="personal_number"
              onChange={updateFilters}
              type="text"
              value={filter.personal_number}
              placeholder="i,e: 193701301111"
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.personal_number}
            </span>
          </div>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("SEARCH_OPP_NUMBER")}
              {/* //T */}
            </label>
            <input
              name="opp_number"
              onChange={updateFilters}
              value={filter.opp_number}
              placeholder="i,e: LO0000000601"
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.opp_number}
            </span>
          </div>

          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("E-Mail")}
              {/* //T */}
            </label>
            <input
              name="email"
              value={filter.email}
              onChange={updateFilters}
              placeholder="i,e: example@mail.com"
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.email}
            </span>
          </div>
          <div className="filter__items-box__search-item">
            <label htmlFor="" className="filter__items-box__search-item__label">
              {t("Phone number")}
              {/* //T */}
            </label>
            <input
              name="phone"
              placeholder="i,e: 0790266255"
              value={filter.phone}
              onChange={updateFilters}
              className="filter__items-box__search-item__input my-input"
            />
            <span className="validation-messsage">
              {filterErrorMessage.phone}
            </span>
          </div>
        </div>
        <div className="filter__footer">
          <button
            className="filter__footer__apply-filters btn --success"
            onClick={applyFilter}
          >
            {t("APPLY")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Filter;
