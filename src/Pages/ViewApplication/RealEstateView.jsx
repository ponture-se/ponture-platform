import React from "react";
import {
  //useGlobalState,
  useLocale
} from "hooks";
import "./styles.scss";
import "../BusinessLoan/styles.scss";
import { downloadAppAsset } from "api/main-api";
import SafeValue from "utils/SafeValue";
const RealEstateView = props => {
  //Initialization
  // const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const RE = props.data.real_estate;

  // additional_details: null;

  //fields
  const realEstateType = SafeValue(
    RE,
    "real_estate_type",
    "string",
    t("NOT_SPECIFIED")
  );
  const realEstateSize = SafeValue(
    RE,
    "real_estate_size",
    "string",
    t("NOT_SPECIFIED")
  );
  const realEstatePrice = String(
    SafeValue(RE, "real_estate_price", "nubmer", "0")
  ).replace(numberFormatRegex, "$1 ");
  const realEstateUsageCategory = SafeValue(
    RE,
    "real_estate_usage_category",
    "array",
    []
  );
  const realEstateTaxationValue = String(
    SafeValue(RE, "real_estate_taxation_value", "number", "0")
  ).replace(numberFormatRegex, "$1 ");
  const realEstateAddress = SafeValue(
    RE,
    "real_estate_address",
    "string",
    t("NOT_SPECIFIED")
  );
  const realEstateCity = SafeValue(
    RE,
    "real_estate_city",
    "string",
    t("NOT_SPECIFIED")
  );
  const realEstateLink = SafeValue(
    RE,
    "real_estate_link",
    "string",
    t("NOT_SPECIFIED")
  );
  const realEstateDescription = SafeValue(
    RE,
    "real_estate_description",
    "string",
    t("NOT_SPECIFIED")
  );
  const ownInvestmentAmount = String(
    SafeValue(RE, "own_investment_amount", "number", "0")
  ).replace(numberFormatRegex, "$1 ");
  const description = SafeValue(
    RE,
    "description",
    "string",
    t("NOT_SPECIFIED")
  );
  // const additionalDetails = SafeValue(
  //   RE,
  //   "additional_details",
  //   "string",
  //   t("NOT_SPECIFIED")
  // );
  const realEstateDocument = SafeValue(
    RE,
    "real_estate_document",
    "string",
    ""
  );
  // const purchaserGuaranteesDescription = SafeValue(
  //   RE,
  //   "available_guarantees_description",
  //   "string",
  //   t("NOT_SPECIFIED")
  // );
  //
  return (
    <>
      <div className="bl viewApplication bl__infoBox ">
        <div className="bl__infoBox__header">
          {/* <div className="bl__infoBox__circleIcon">
         <i className="icon-info" />
       </div> */}
          <span>{t("APP_VIEW_APPLICATION")}</span>
          <span className="icon-cross modal-close" onClick={props.close}></span>
        </div>
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_TYPE")}
            </label>
            <div className="element-group__center">
              <span className="tag">{realEstateType}</span>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_SIZE")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{realEstateSize}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_PRICE")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{realEstatePrice}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">
              {t("BL_REALESTATE_USAGE_CATEGORY")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {realEstateUsageCategory.length > 0
                ? realEstateUsageCategory.map((item, key) => (
                    <span className="tag" key={key}>
                      {item}
                    </span>
                  ))
                : t("NOT_SPECIFIED")}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_TAXATION_VALUE")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">
                {realEstateTaxationValue + " Kr"}
              </div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_ADDRESS")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{realEstateAddress}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_CITY")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{realEstateCity}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_LINK")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{realEstateLink}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("BL_REALESTATE_DESCRIPTION")}
            </label>
            <div className="bl__input__element">{realEstateDescription}</div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_OWN_INVESTMENT_AMOUNT")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{ownInvestmentAmount}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_PURCHASE_DESCRIPTION")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{description}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("BL_REALESTATE_FILE")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {realEstateDocument ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, realEstateDocument)}
                    target="_blank"
                  >
                    Attachment 1
                  </a>
                </>
              ) : (
                t("NOT_SPECIFIED")
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button className="btn --success" onClick={props.close}>
          <span className="icon-cross"></span>
          &nbsp;
          {t("CLOSE")}
        </button>
      </div>
    </>
  );
};

export default RealEstateView;
