import React from "react";
import {
  //useGlobalState,
  useLocale
} from "hooks";
import "./styles.scss";
import "../BusinessLoan/styles.scss";
import { downloadAppAsset } from "api/main-api";
import SafeValue from "utils/SafeValue";
const BusinessAcquisitionView = props => {
  //Initialization
  // const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const BA = props.data.acquisition;

  //fields
  const objectName = SafeValue(BA, "object_name", "string", t("NOT_SPECIFIED"));
  const objectCompanyName = SafeValue(
    BA,
    "object_company_name",
    "string",
    t("NOT_SPECIFIED")
  );
  const objectOrgNumber = SafeValue(
    BA,
    "object_organization_number",
    "string",
    t("NOT_SPECIFIED")
  );
  const objectIndustryBranch = SafeValue(
    BA,
    "object_industry",
    "string",
    t("NOT_SPECIFIED")
  );
  const objectPrice = String(BA.object_price).replace(numberFormatRegex, "$1 ");
  const objectValuationLetter = SafeValue(
    BA,
    "object_valuation_letter",
    "string",
    ""
  );
  const objectAnnualReport = SafeValue(
    BA,
    "object_annual_report",
    "string",
    ""
  );
  const objectLatestBalanceSheet = SafeValue(
    BA,
    "object_balance_sheet",
    "string",
    ""
  );
  const objectLatestIncomeStatement = SafeValue(
    BA,
    "object_income_statement",
    "string",
    ""
  );
  const purchaserCompanyLatestBalanceSheet = SafeValue(
    BA,
    "account_balance_sheet",
    "string",
    ""
  );
  const purchaserCompanyLatestIncomeStatement = SafeValue(
    BA,
    "account_income_statement",
    "string",
    ""
  );
  const purchaserGuaranteesAvailable = SafeValue(
    BA,
    "available_guarantees",
    "string",
    t("NOT_SPECIFIED")
  );
  const purchaserGuaranteesDescription = SafeValue(
    BA,
    "available_guarantees_description",
    "string",
    t("NOT_SPECIFIED")
  );
  const experience = SafeValue(
    BA,
    "purchaser_profile",
    "string",
    t("NOT_SPECIFIED")
  );
  const purchaseType = SafeValue(
    BA,
    "purchase_type",
    "string",
    t("NOT_SPECIFIED")
  );
  const ownInvestmentAmount = String(BA.own_investment_amount).replace(
    numberFormatRegex,
    "$1 "
  );
  const ownInvestmentDetails = SafeValue(
    BA,
    "own_investment_details",
    "string",
    ""
  );
  const additionalFiles = SafeValue(BA, "additional_files.0", "string", "");
  const businessPlan = SafeValue(BA, "business_plan.0", "string", "");
  const additionalDetails = SafeValue(
    BA,
    "additional_details",
    "string",
    t("NOT_SPECIFIED")
  );
  const description = SafeValue(
    BA,
    "description",
    "string",
    t("NOT_SPECIFIED")
  );
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

        <span className="section-header">{t("APP_GENERAL_INFO")}</span>
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_BA_PURCHASE_TYPE")}
            </label>
            <div className="element-group__center">
              <div className="options">{purchaseType}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OWN_INVESTMENT_AMOUNT") + " (Kr)"}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{ownInvestmentAmount}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_ADDITIONAL_DETAILS")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{additionalDetails}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">
              {t("APP_ADDITIONAL_FILES")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {additionalFiles.length !== 0 ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, additionalFiles)}
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
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">{t("APP_BUSINESS_PLAN")}</label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {businessPlan ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, businessPlan)}
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
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("APP_OWN_INVESTMENT_DETAILS")}
            </label>
            <div className="bl__input__element">{ownInvestmentDetails}</div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("APP_PURCHASE_OF_DESCRIPTION")}
            </label>
            <div className="bl__input__element">{description}</div>
          </div>
        </div>
        <br />
        <br />
        <span className="section-header">{t("APP_BUSINESS_ACQ1")}</span>
        <div className="userInputs">
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">{t("APP_OBJECT_NAME")}</label>
            <div className="bl__input__element">
              <div className="element-group__center">{objectName}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">
              {t("APP_OBJECT_COMPANY_NAME")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{objectCompanyName}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OBJECT_ORG_NUMBER")}
            </label>
            <div className="bl__input__element">
              <div className="element-group__center">{objectOrgNumber}</div>
            </div>
          </div>
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">{t("APP_OBJECT_PRICE")}</label>
            <div className="bl__input__element">
              <div className="element-group__center">{objectPrice + " Kr"}</div>
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label" style={{ marginBottom: "0" }}>
              {t("APP_OBJECT_INDUSTRY_BRANCH")}
            </label>
            {/* <div className="element-group"> */}
            <div className="element-group__center">{objectIndustryBranch}</div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OBJECT_VALUATION_LETTER")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {objectValuationLetter ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, objectValuationLetter)}
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
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OBJECT_ANNUAL_REPORT")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {objectAnnualReport ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, objectAnnualReport)}
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
        <br />
        {/* // */}
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OBJECT_LATEST_BALANCE_SHEET")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {objectLatestBalanceSheet ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(this, objectLatestBalanceSheet)}
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
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_OBJECT_LATEST_INCOME_STATEMENT")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group__center">
              {objectLatestIncomeStatement ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(
                      this,
                      objectLatestIncomeStatement
                    )}
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
        <br />
        <br />
        {/* Purchaser */}
        <span className="section-header">{t("APP_BUSINESS_ACQ2")}</span>
        <div className="userInputs">
          <div className="bl__input animated fadeIn">
            <label className="bl__input__label">
              {t("APP_PURCHASER_COMPANY_LATEST_BALANCE_SHEET")}
            </label>
            <div className="element-group__center">
              {purchaserCompanyLatestBalanceSheet ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(
                      this,
                      purchaserCompanyLatestBalanceSheet
                    )}
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
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_PURCHASER_COMPANY_LATEST_INCOME_STATEMENT")}
            </label>
            <div className="element-group__center">
              {purchaserCompanyLatestIncomeStatement ? (
                <>
                  <i className="icon-file-plus-o"></i>&nbsp;
                  <a
                    href={downloadAppAsset.call(
                      this,
                      purchaserCompanyLatestIncomeStatement
                    )}
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
        <br />
        <div className="userInputs">
          <div className="bl__input animated fadeIn ">
            <label className="bl__input__label">
              {t("APP_PURCHASER_GUARANTEES_AVAILABLE")}
            </label>
            <div className="element-group__center">
              {purchaserGuaranteesAvailable}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className={"bl__input animated fadeIn "}>
            <label className="bl__input__label">
              {t("APP_PURCHASER_GUARANTEES_DESCRIPTION")}
            </label>
            <div className="bl__input__element">
              {purchaserGuaranteesDescription}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div className={"bl__input animated fadeIn "}>
            <label className="bl__input__label">{t("APP_EXPERIENCE")}</label>
            <div className="bl__input__element">{experience}</div>
          </div>
        </div>
        <br />
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

export default BusinessAcquisitionView;
