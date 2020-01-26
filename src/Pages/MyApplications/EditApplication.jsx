import React, { useEffect, useState, useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import "./EditApplication.scss";
import "../BusinessLoan/styles.scss";
import SquareSpinner from "components/SquareSpinner";
import UploaderApiIncluded from "components/UploaderApiIncluded";
import SafeValue from "utils/SafeValue";
import { CircleSpinner } from "components";
const EditAppliation = props => {
  //Initialization
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const orgNumberFormatRegex = new RegExp(/^([0-9]){6}-?([0-9]){4}$/);
  const data = props.data;
  const { toggleEditModal } = props;
  const BA = props.data.acquisition;
  const validations =
    props.action === "submit"
      ? //false: Mandatory, true:Optional
        {
          objectName: false,
          objectCompanyName: false,
          objectOrgNumber: false,
          objectIndustryBranch: false,
          objectPrice: false,
          objectValuationLetter: false,
          objectAnnualReport: false,
          objectLatestBalanceSheet: false,
          objectLatestIncomeStatement: false,
          purchaserCompanyOrganizationNumber: false, //IMP
          purchaserCompanyLatestBalanceSheet: false, //IMP
          purchaserCompanyLatestIncomeStatement: false, //IMP
          purchaserGuaranteesAvailable: false,
          purchaserGuaranteesDescription: true,
          purchaserPersonalNumber: false,
          experience: false,
          purchaseType: false,
          additionalFiles: true,
          additionalDetails: true,
          businessPlan: false,
          ownInvestmentAmount: false,
          ownInvestmentDetails: true,
          description: false
        }
      : props.action === "edit"
      ? {
          objectName: true,
          objectCompanyName: true,
          objectOrgNumber: true,
          objectIndustryBranch: true,
          objectPrice: true,
          objectValuationLetter: true,
          objectAnnualReport: true,
          objectLatestBalanceSheet: true,
          objectLatestIncomeStatement: true,
          purchaserCompanyOrganizationNumber: false,
          purchaserCompanyLatestBalanceSheet: true,
          purchaserCompanyLatestIncomeStatement: true,
          purchaserGuaranteesAvailable: true,
          purchaserGuaranteesDescription: true,
          purchaserPersonalNumber: false,
          experience: true,
          purchaseType: true,
          additionalFiles: true,
          additionalDetails: true,
          businessPlan: true,
          ownInvestmentAmount: true,
          ownInvestmentDetails: true,
          description: false
        }
      : {};

  //customValidation: func
  const checkValidation = (name, value, customValidation) => {
    let isValid = true;
    let eMessage = "";
    if (typeof customValidation !== "function") {
      if (!validations[name] && (!value || value.length === 0)) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
    } else {
      //Do not check validation for Optional fields with zero value length
      if (!(validations[name] && value.length === 0)) {
        if (!customValidation()) {
          isValid = false;
          eMessage = t("INVALID_VALUE");
        }
      }
    }
    return { isValid: isValid, eMessage: eMessage };
  };
  const [buttonSpinner, toggleButtonSpinner] = useState(false);
  const [objectName, setObjectName] = useState({
    value: BA.object_name,
    isValid: true,
    eMessage: ""
  });
  const [objectCompanyName, setObjectCompanyName] = useState({
    value: BA.object_company_name,
    isValid: true,
    eMessage: ""
  });
  const [objectOrgNumber, setObjectOrgNumber] = useState({
    value: BA.object_organization_number,
    isValid: true,
    eMessage: ""
  });
  const [objectIndustryBranch, setObjectIndustryBranch] = useState({
    value: BA.object_industry,
    ...checkValidation("objectIndustryBranch", BA.object_industry)
  });
  const [objectPrice, setObjectPrice] = useState({
    value: {
      realValue: String(BA.object_price),
      visualValue: String(BA.object_price).replace(numberFormatRegex, "$1 ")
    },
    ...checkValidation("objectPrice", BA.object_price)
  });
  const [objectValuationLetter, setObjectValuationLetter] = useState({
    value: BA.object_valuation_letter,
    ...checkValidation("objectValuationLetter", BA.object_valuation_letter)
  });
  const [objectAnnualReport, setObjectAnnualReport] = useState({
    value: BA.object_annual_report,
    ...checkValidation("objectAnnualReport", BA.object_annual_report)
  });
  const [objectLatestBalanceSheet, setObjectLatestBalanceSheet] = useState({
    value: BA.object_balance_sheet,
    ...checkValidation("objectLatestBalanceSheet", BA.object_balance_sheet)
  });
  const [
    objectLatestIncomeStatement,
    setObjectLatestIncomeStatement
  ] = useState({
    value: BA.object_income_Statement,
    ...checkValidation(
      "objectLatestIncomeStatement",
      BA.object_income_Statement
    )
  });
  const [
    purchaserCompanyLatestBalanceSheet,
    setPurchaserCompanyLatestBalanceSheet
  ] = useState({
    value: BA.object_balance_sheet,
    ...checkValidation(
      "purchaserCompanyLatestBalanceSheet",
      BA.object_balance_sheet
    )
  });
  const [
    purchaserCompanyLatestIncomeStatement,
    setPurchaserCompanyLatestIncomeStatement
  ] = useState({
    value: BA.object_income_statement,
    ...checkValidation(
      "purchaserCompanyLatestIncomeStatement",
      BA.object_income_statement
    )
  });
  const [
    purchaserGuaranteesAvailable,
    setPurchaserGuaranteesAvailable
  ] = useState({
    value: BA.available_guarantees ? BA.available_guarantees : [],
    ...checkValidation("purchaserGuaranteesAvailable", BA.available_guarantees)
  });
  const [
    purchaserGuaranteesDescription,
    setPurchaserGuaranteesDescription
  ] = useState({
    value: BA.available_guarantees_description
      ? BA.available_guarantees_description
      : "",
    ...checkValidation(
      "purchaserGuaranteesDescription",
      BA.available_guarantees_description
    )
  });
  const [experience, setExperience] = useState({
    value: BA.purchaser_profile ? BA.purchaser_profile : "",
    ...checkValidation("experience", BA.purchaser_profile)
  });
  const [purchaseType, setPurchaseType] = useState({
    value: BA.purchase_type ? BA.purchase_type : "",
    ...checkValidation("purchaseType", BA.purchase_type)
  });
  const [ownInvestmentAmount, setOwnInvestmentAmount] = useState({
    value: {
      realValue: String(BA.own_investment_amount),
      visualValue: String(BA.own_investment_amount).replace(
        numberFormatRegex,
        "$1 "
      )
    },
    ...checkValidation("ownInvestmentAmount", BA.own_investment_amount)
  });
  const [ownInvestmentDetails, setOwnInvestmentDetails] = useState({
    value: SafeValue(BA, "own_investment_details", "string", ""),
    ...checkValidation("ownInvestmentDetails", BA.own_investment_details)
  });
  const [additionalFiles, setAdditionalFiles] = useState({
    value: SafeValue(BA, "additional_files", "array", []),
    ...checkValidation("additionalFiles", BA.additional_files)
  });
  const [businessPlan, setBusinessPlan] = useState({
    value: SafeValue(BA, "business_plan", "array", []),
    ...checkValidation("businessPlan", BA.business_plan)
  });
  const [additionalDetails, setAdditionalDetails] = useState({
    value: SafeValue(BA, "additional_details", "string", ""),
    ...checkValidation("additionalDetails", BA.additional_details)
  });
  const [description, setDescription] = useState({
    value: SafeValue(BA, "description", "string", ""),
    ...checkValidation("description", BA.description)
  });
  //
  const objectIndustryBranch_opts = [
    "Butiker",
    "Bygg och entreprenad",
    "Hotell/Turistföretag",
    "Restauranger/Caféer",
    "Tillverkande företag",
    "Tjänsteföretag",
    "Handel/e-handel",
    "Vård & Hälsa",
    "Transportföretag",
    "Övrigt"
  ];
  const purchaserGuaranteesAvailable_opts = [
    "Personligborgen",
    "Fastighet",
    "Mark",
    "Företagsteckningar"
  ];
  const purchaseType_opts = ["Ren overlåtesle", "Köp av inkråmet"];
  //ObjectName
  const handleObjectName = useCallback(
    e => {
      const { value } = e.target;
      setObjectName({
        value: value,
        ...checkValidation("objectName", value)
      });
    },
    [objectName]
  );

  // //company name
  const handleObjectCompanyName = useCallback(
    e => {
      const { value } = e.target;
      setObjectCompanyName({
        value: value,
        ...checkValidation("objectCompanyName", value)
      });
    },
    [objectCompanyName]
  );

  //Orgnumber
  const handleObjectOrgNumber = useCallback(
    e => {
      const { value } = e.target;
      setObjectOrgNumber({
        value: value,
        ...checkValidation("objectOrgNumber", value, () => {
          return orgNumberFormatRegex.test(value);
        })
      });
    },
    [objectOrgNumber]
  );

  //Industry branch
  const handleObjectIndustryBranch = useCallback(
    e => {
      const { value } = e.target;
      let _newOpt = "";
      if (objectIndustryBranch.value !== value) {
        _newOpt = value;
      }
      // if (
      //   !objectIndustryBranch ||
      //   (Array.isArray(objectIndustryBranch) &&
      //     objectIndustryBranch.length === 0)
      // ) {
      //   isValid = false;
      //   eMessage = t("MANDATORY_FIELD");
      // }
      setObjectIndustryBranch({
        value: _newOpt,
        ...checkValidation("objectIndustryBranch", _newOpt)
      });
    },
    [objectIndustryBranch]
  );

  //object price
  const handleObjectPrice = useCallback(
    e => {
      const { value } = e.target;
      let _value = "";
      _value = value.replace(/\s/g, "");
      if (Number(_value)) {
        setObjectPrice({
          value: {
            realValue: _value,
            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
          },
          ...checkValidation("objectPrice", _value)
        });
      }
    },
    [objectPrice]
  );
  //Object Valuation Letter
  const handleObjectValuationLetter = useCallback(
    e => {
      let { value } = e.target;
      setObjectValuationLetter({
        value: value,
        ...checkValidation("objectValuationLetter", value)
      });
    },
    [objectValuationLetter]
  );

  //Object Annual Report
  const handleObjectAnnualReport = useCallback(
    e => {
      let { value } = e.target;
      setObjectAnnualReport({
        value: value,
        ...checkValidation("objectAnnualReport", value)
      });
    },
    [objectAnnualReport]
  );

  //Object latest balance sheet
  const handleObjectLatestBalanceSheet = useCallback(
    e => {
      let { value } = e.target;
      setObjectLatestBalanceSheet({
        value: value,
        ...checkValidation("objectLatestBalanceSheet", value)
      });
    },
    [objectLatestBalanceSheet]
  );
  const handleObjectLatestIncomeStatement = useCallback(
    e => {
      let { value, name } = e.target;
      setObjectLatestIncomeStatement({
        value: value,
        ...checkValidation("objectLatestIncomeStatement", value)
      });
    },
    [objectLatestIncomeStatement]
  );
  const handlePurchaserCompanyLatestBalanceSheet = useCallback(
    e => {
      let { value } = e.target;
      setPurchaserCompanyLatestBalanceSheet({
        value: value,
        ...checkValidation("purchaserCompanyLatestBalanceSheet", value)
      });
    },
    [purchaserCompanyLatestBalanceSheet]
  );
  const handlePurchaserCompanyLatestIncomeStatement = useCallback(
    e => {
      let { value } = e.target;
      setPurchaserCompanyLatestIncomeStatement({
        value: value,
        ...checkValidation("purchaserCompanyLatestIncomeStatement", value)
      });
    },
    [purchaserCompanyLatestIncomeStatement]
  );
  const handlePurchaserGuaranteesAvailable = useCallback(
    e => {
      let _newOpts = Array.from(purchaserGuaranteesAvailable.value);
      let eMessage = "";
      let isValid = true;
      if (purchaserGuaranteesAvailable.value.indexOf(e) > -1) {
        _newOpts.splice(_newOpts.indexOf(e), 1);
      } else {
        _newOpts.push(e);
      }
      if (_newOpts.length === 0) {
        eMessage = t("MANDATORY_FIELD");
        isValid = false;
      }
      setPurchaserGuaranteesAvailable({
        isValid: isValid,
        eMessage: eMessage,
        value: _newOpts
      });
    },
    [purchaserGuaranteesAvailable]
  );
  const handlePurchaserGuaranteesDescription = useCallback(
    e => {
      let { value } = e.target;

      setPurchaserGuaranteesDescription({
        value: value,
        ...checkValidation("purchaserGuaranteesDescription", value)
      });
    },
    [purchaserGuaranteesDescription]
  );
  const handleExperience = useCallback(
    e => {
      let { value } = e.target;
      setExperience({
        value: value,
        ...checkValidation("experience", value)
      });
    },
    [experience]
  );
  const handlePurchaseType = useCallback(
    e => {
      const { value } = e.target;
      let _newOpts = "";
      if (purchaseType.value !== value) {
        _newOpts = value;
      }
      setPurchaseType({
        value: _newOpts,
        ...checkValidation("purchaseType", _newOpts)
      });
    },
    [purchaseType]
  );
  const handleOwnInvestmentAmount = useCallback(
    e => {
      const { value } = e.target;
      let _value = "";
      _value = value.replace(/\s/g, "");
      if (Number(_value)) {
        setOwnInvestmentAmount({
          value: {
            realValue: _value,
            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
          },
          ...checkValidation("ownInvestmentAmount", _value)
        });
      }
    },
    [ownInvestmentAmount]
  );
  const handleOwnInvestmentDetails = useCallback(
    e => {
      let { value } = e.target;
      setOwnInvestmentDetails({
        value: value,
        ...checkValidation("ownInvestmentDetails", value)
      });
    },
    [ownInvestmentDetails]
  );
  const handleAdditionalDetails = useCallback(
    e => {
      let { value } = e.target;
      setAdditionalDetails({
        value: value,
        ...checkValidation("additionalDetails", value)
      });
    },
    [additionalDetails]
  );
  const handleDescription = useCallback(
    e => {
      let { value } = e.target;
      setDescription({
        value: value,
        ...checkValidation("description", value)
      });
    },
    [description]
  );
  const handleBusinessPlan = useCallback(
    e => {
      let { value } = e.target;
      setBusinessPlan({
        value: value,
        ...checkValidation("businessPlan", value)
      });
    },
    [businessPlan]
  );
  const handleAdditionalFiles = useCallback(
    e => {
      let { value } = e.target;
      setAdditionalFiles({
        value: value,
        ...checkValidation("additionalFiles", value)
      });
    },
    [additionalFiles]
  );
  const editApplication = () => {
    toggleButtonSpinner(true);
    const API_obj = {
      acquisition: {
        object_name: SafeValue(objectName, "value", "string", ""),
        object_company_name: SafeValue(
          objectCompanyName,
          "value",
          "string",
          ""
        ),
        object_organization_number: SafeValue(
          objectOrgNumber,
          "value",
          "string",
          ""
        ),
        object_industry: SafeValue(objectIndustryBranch, "value", "string", ""),
        object_price: SafeValue(objectPrice, "value.realValue", "string", "0"),
        object_valuation_letter: SafeValue(
          objectValuationLetter,
          "value",
          "string",
          ""
        ),
        object_annual_report: SafeValue(
          objectAnnualReport,
          "value",
          "string",
          ""
        ),
        object_balance_sheet: SafeValue(
          objectLatestBalanceSheet,
          "value",
          "string",
          ""
        ),
        object_income_statement: SafeValue(
          objectLatestIncomeStatement,
          "value",
          "string",
          ""
        ),
        account_balance_sheet: SafeValue(
          purchaserCompanyLatestBalanceSheet,
          "value",
          "string",
          ""
        ),
        account_income_statement: SafeValue(
          purchaserCompanyLatestIncomeStatement,
          "value",
          "string",
          ""
        ),
        available_guarantees: String(
          SafeValue(purchaserGuaranteesAvailable, "value", "array", [])
        ), //BUG
        available_guarantees_description: SafeValue(
          purchaserGuaranteesDescription,
          "value",
          "string",
          ""
        ),
        purchaser_profile: SafeValue(experience, "value", "string", ""),
        purchase_type: SafeValue(purchaseType, "value", "string", ""),
        own_investment_amount: SafeValue(
          ownInvestmentAmount,
          "value.realValue",
          "string",
          "0"
        ),
        own_investment_details: SafeValue(
          ownInvestmentDetails,
          "value",
          "string",
          ""
        ),
        business_plan: SafeValue(businessPlan, "value", "array", []),
        additional_files: SafeValue(additionalFiles, "value", "array", []),
        additional_details: SafeValue(additionalDetails, "value", "string", ""),
        description: SafeValue(description, "value", "string", "")
      }
    };
    props.onEdit(API_obj);
  };
  //  const handleREUsageCategory = useCallback(
  //    e => {
  //      let _newOpts = Array.from(selectedREUsageCategory.value);
  //      let eMessage = "";
  //      let isValid = true;
  //      if (selectedREUsageCategory.value.indexOf(e) > -1) {
  //        _newOpts.splice(_newOpts.indexOf(e), 1);
  //      } else {
  //        _newOpts.push(e);
  //      }
  //      if (_newOpts.length === 0) {
  //        eMessage = t("MANDATORY_FIELD");
  //        isValid = false;
  //      }
  //      setSelectedREUsageCategory({
  //        isValid: isValid,
  //        eMessage: eMessage,
  //        value: _newOpts
  //      });
  //    },
  //    [selectedREUsageCategory]
  //  );

  //  //ATTENTION: NEEDS REFACTOR
  //  const handleREAreaChange = useCallback(
  //    e => {
  //      const { value } = e.target;
  //      let isValid = true,
  //        validationMessage = "";

  //      if (value.length === 0) {
  //        isValid = false;
  //        validationMessage = t("BL_REALESTATE_AREA_IS_REQUIRED");
  //      }
  //      setREArea(value);
  //      setREAreaIsValid(isValid);
  //      setREAreaValidationMessage(validationMessage);
  //    },
  //    [REArea, REPriceIsValid, REAreaValidationMessage]
  //  );
  //  const handleREPriceChanged = useCallback(
  //    e => {
  //      const { value } = e.target;
  //      let isValid = true,
  //        validationMessage = "";
  //      let _value = "";

  //      if (!value || value.length === 0 || value === 0) {
  //        isValid = false;
  //        validationMessage = t("PRICE_IS_REQUIRED");
  //        setREPrice({
  //          realValue: 0,
  //          visualValue: ""
  //        });
  //      } else {
  //        _value = value.replace(/\s/g, "");
  //        if (Number(_value)) {
  //          isValid = true;
  //          validationMessage = "";
  //          setREPrice({
  //            realValue: _value,
  //            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
  //          });
  //        }
  //      }
  //      setREPriceIsValid(isValid);
  //      setREPriceValidationMessage(validationMessage);
  //    },
  //    [REPrice, REPriceIsValid, REPriceValidationMessage]
  //  );

  //  const handleREType = useCallback(
  //    e => {
  //      const { value } = e.target;
  //      let _newOpt = "";
  //      let isValid = true;
  //      let eMessage = "";
  //      if (selectedREType !== value) {
  //        _newOpt = value;
  //      }
  //      if (
  //        !selectedREType ||
  //        (Array.isArray(selectedREType) && selectedREType.length === 0)
  //      ) {
  //        isValid = false;
  //        eMessage = t("MANDATORY_FIELD");
  //      }
  //      setSelectedREType({
  //        value: _newOpt,
  //        isValid: isValid,
  //        eMessage: eMessage
  //      });
  //    },
  //    [selectedREType]
  //  );
  //  const handleRETaxationValue = useCallback(
  //    e => {
  //      const { value } = e.target;
  //      let isValid = true,
  //        validationMessage = "";
  //      let _value = "";

  //      if (!value || value.length === 0 || value === 0) {
  //        isValid = false;
  //        validationMessage = t("PRICE_IS_REQUIRED");
  //        setRETaxationValue({
  //          isValid: isValid,
  //          eMessage: validationMessage,
  //          value: { realValue: 0, visualValue: "" }
  //        });
  //      } else {
  //        _value = value.replace(/\s/g, "");
  //        if (Number(_value)) {
  //          isValid = true;
  //          validationMessage = "";
  //          setRETaxationValue({
  //            isValid: isValid,
  //            eMessage: validationMessage,
  //            value: {
  //              realValue: _value,
  //              visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
  //            }
  //          });
  //        }
  //      }
  //    },
  //    [RETaxationValue]
  //  );
  //  const handleREAddress = useCallback(
  //    e => {
  //      let { value, name } = e.target;
  //      let isValid = true;
  //      let eMessage = "";
  //      if (!value || value.length === 0) {
  //        isValid = false;
  //        eMessage = t("MANDATORY_FIELD");
  //      }
  //      setREAddress({ isValid: isValid, eMessage: eMessage, value: value });
  //    },
  //    [REAddress]
  //  );
  //  const handleRECity = useCallback(
  //    e => {
  //      let { value, name } = e.target;
  //      let isValid = true;
  //      let eMessage = "";
  //      if (!value || value.length === 0) {
  //        isValid = false;
  //        eMessage = t("MANDATORY_FIELD");
  //      }
  //      setRECity({ isValid: isValid, eMessage: eMessage, value: value });
  //    },
  //    [RECity]
  //  );
  //  const handleRELink = useCallback(
  //    e => {
  //      let { value, name } = e.target;
  //      let isValid = true;
  //      let eMessage = "";
  //      if (!value || value.length === 0) {
  //        isValid = false;
  //        eMessage = t("MANDATORY_FIELD");
  //      }
  //      setRELink({ isValid: isValid, eMessage: eMessage, value: value });
  //    },
  //    [RELink]
  //  );
  //  const handleREDescription = useCallback(
  //    e => {
  //      let { value, name } = e.target;
  //      let isValid = true;
  //      let eMessage = "";
  //      if (!value || value.length === 0) {
  //        isValid = false;
  //        eMessage = t("MANDATORY_FIELD");
  //      }
  //      setREDescription({ isValid: isValid, eMessage: eMessage, value: value });
  //    },
  //    [REDescription]
  //  );
  //  const handleREFile = useCallback(
  //    e => {
  //      let { value, name } = e.target;
  //      let isValid = true;
  //      let eMessage = "";
  //      setREFile({ isValid: isValid, eMessage: eMessage, value: value });
  //    },
  //    [REFile]
  //  );
  return (
    <>
      <div className="bl editApplication bl__infoBox ">
        <div className="bl__infoBox__header">
          {/* <div className="bl__infoBox__circleIcon">
         <i className="icon-info" />
       </div> */}
          <span>{t("APP_EDIT_APPLICATION")}</span>
          <span
            className="icon-cross modal-close"
            onClick={props.cancelEdit}
          ></span>
        </div>

        <span className="section-header">{t("APP_GENERAL_INFO")}</span>
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!purchaseType.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label" style={{ marginBottom: "0" }}>
              {t("APP_BA_PURCHASE_TYPE")}
            </label>
            <div style={{ margin: "auto -8px" }}>
              {/* <div className="element-group"> */}
              <div className="element-group__center">
                <div className="options">
                  {purchaseType_opts.length > 0 &&
                    purchaseType_opts.map((opt, idx) => {
                      const isSelected = opt === purchaseType.value;
                      return (
                        <div
                          key={idx}
                          className={
                            "btnReason " + (isSelected ? "--active" : "")
                          }
                          onClick={() =>
                            handlePurchaseType({
                              target: { value: opt }
                            })
                          }
                        >
                          <div className="btnReason__title">{opt}</div>
                          {isSelected && (
                            <div className="btnReason__active">
                              <span className="icon-checkmark" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                {/* </div> */}
              </div>
              {!purchaseType.isValid && (
                <span
                  className="validation-messsage"
                  style={{ paddingLeft: "10px" }}
                >
                  {purchaseType.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!ownInvestmentAmount.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OWN_INVESTMENT_AMOUNT") + " (Kr)"}
            </label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder="3 000 000"
                    value={ownInvestmentAmount.value.visualValue}
                    onChange={handleOwnInvestmentAmount}
                  />
                </div>
              </div>
              {!ownInvestmentAmount.isValid && (
                <span className="validation-messsage">
                  {ownInvestmentAmount.eMessage}
                </span>
              )}
            </div>
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!additionalDetails.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_ADDITIONAL_DETAILS")}
            </label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder=""
                    value={additionalDetails.value}
                    onChange={handleAdditionalDetails}
                  />
                </div>
              </div>
              {!additionalDetails.isValid && (
                <span className="validation-messsage">
                  {additionalDetails.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!additionalFiles.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_ADDITIONAL_FILES")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={additionalFiles}
                  onChange={(name, result) =>
                    handleAdditionalFiles({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!additionalFiles.isValid && (
              <span className="validation-messsage">
                {additionalFiles.eMessage}
              </span>
            )}
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!businessPlan.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">{t("APP_BUSINESS_PLAN")}</label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={businessPlan.value}
                  onChange={(name, result) =>
                    handleBusinessPlan({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!businessPlan.isValid && (
              <span className="validation-messsage">
                {businessPlan.eMessage}
              </span>
            )}
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!ownInvestmentDetails.isValid ? "--invalid" : "")
            }
          >
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("APP_OWN_INVESTMENT_DETAILS")}
            </label>
            <div className="bl__input__element">
              {/* <div className="element-group">
                             <div className="element-group__center"> */}
              <textarea
                className="my-input"
                value={ownInvestmentDetails.value}
                onChange={handleOwnInvestmentDetails}
                style={{
                  maxWidth: "200px",
                  minWidth: "100%",
                  border: "1px solid lightgrey",
                  minHeight: "100px",
                  padding: "10px"
                }}
              ></textarea>
              {!ownInvestmentDetails.isValid && (
                <span className="validation-messsage">
                  {ownInvestmentDetails.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!description.isValid ? "--invalid" : "")
            }
          >
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("APP_PURCHASE_OF_DESCRIPTION")}
            </label>
            <div className="bl__input__element">
              {/* <div className="element-group">
                             <div className="element-group__center"> */}
              <textarea
                className="my-input"
                value={description.value}
                onChange={handleDescription}
                style={{
                  maxWidth: "200px",
                  minWidth: "100%",
                  border: "1px solid lightgrey",
                  minHeight: "100px",
                  padding: "10px"
                }}
              ></textarea>
              {!description.isValid && (
                <span className="validation-messsage">
                  {description.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <br />
        <span className="section-header">{t("APP_BUSINESS_ACQ1")}</span>
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectName.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">{t("APP_OBJECT_NAME")}</label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder=""
                    value={objectName.value}
                    onChange={handleObjectName}
                  />
                </div>
              </div>
              {!objectName.isValid && (
                <span className="validation-messsage">
                  {objectName.eMessage}
                </span>
              )}
            </div>
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectCompanyName.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_COMPANY_NAME")}
            </label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder=""
                    value={objectCompanyName.value}
                    onChange={handleObjectCompanyName}
                  />
                </div>
              </div>
              {!objectCompanyName.isValid && (
                <span className="validation-messsage">
                  {objectCompanyName.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectOrgNumber.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_ORG_NUMBER")}
            </label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder="(i,e:1234561234 or 123456-1234)"
                    value={objectOrgNumber.value}
                    onChange={handleObjectOrgNumber}
                  />
                </div>
              </div>
              {!objectOrgNumber.isValid && (
                <span className="validation-messsage">
                  {objectOrgNumber.eMessage}
                </span>
              )}
            </div>
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectPrice.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_PRICE") + " (Kr)"}
            </label>
            <div className="bl__input__element">
              <div className="element-group">
                <div className="element-group__center">
                  <input
                    type="text"
                    className="my-input"
                    placeholder="3 000 000"
                    value={objectPrice.value.visualValue}
                    onChange={handleObjectPrice}
                  />
                </div>
              </div>
              {!objectPrice.isValid && (
                <span className="validation-messsage">
                  {objectPrice.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectIndustryBranch.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label" style={{ marginBottom: "0" }}>
              {t("APP_OBJECT_INDUSTRY_BRANCH")}
            </label>
            <div style={{ margin: "auto -8px" }}>
              {/* <div className="element-group"> */}
              <div className="element-group__center">
                <div className="options">
                  {objectIndustryBranch_opts.length > 0 &&
                    objectIndustryBranch_opts.map((opt, idx) => {
                      const isSelected = opt === objectIndustryBranch.value;
                      return (
                        <div
                          key={idx}
                          className={
                            "btnReason " + (isSelected ? "--active" : "")
                          }
                          onClick={() =>
                            handleObjectIndustryBranch({
                              target: { value: opt }
                            })
                          }
                        >
                          <div className="btnReason__title">{opt}</div>
                          {isSelected && (
                            <div className="btnReason__active">
                              <span className="icon-checkmark" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
                {/* </div> */}
              </div>
              {!objectIndustryBranch.isValid && (
                <span
                  className="validation-messsage"
                  style={{ paddingLeft: "10px" }}
                >
                  {objectIndustryBranch.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectValuationLetter.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_VALUATION_LETTER")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={objectValuationLetter.value}
                  onChange={(name, result) =>
                    handleObjectValuationLetter({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!objectValuationLetter.isValid && (
              <span className="validation-messsage">
                {objectValuationLetter.eMessage}
              </span>
            )}
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectAnnualReport.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_ANNUAL_REPORT")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={objectAnnualReport.value}
                  onChange={(name, result) =>
                    handleObjectAnnualReport({ target: { value: result.id } })
                  }
                />
              </div>
            </div>
            {!objectAnnualReport.isValid && (
              <span className="validation-messsage">
                {objectAnnualReport.eMessage}
              </span>
            )}
          </div>
        </div>
        <br />
        {/* // */}
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectLatestBalanceSheet.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_LATEST_BALANCE_SHEET")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={objectLatestBalanceSheet.value}
                  onChange={(name, result) =>
                    handleObjectLatestBalanceSheet({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!objectLatestBalanceSheet.isValid && (
              <span className="validation-messsage">
                {objectLatestBalanceSheet.eMessage}
              </span>
            )}
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectLatestIncomeStatement.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_OBJECT_LATEST_INCOME_STATEMENT")}
            </label>
            {/* <div className="bl__input__element"> */}
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={objectLatestIncomeStatement.value}
                  onChange={(name, result) =>
                    handleObjectLatestIncomeStatement({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!objectLatestIncomeStatement.isValid && (
              <span className="validation-messsage">
                {objectLatestIncomeStatement.eMessage}
              </span>
            )}
          </div>
        </div>
        <br />
        <br />
        {/* Purchaser */}
        {/* <div className="bl__infoBox__header"> */}
        {/* <div className="bl__infoBox__circleIcon">
         <i className="icon-info" />
       </div> */}
        <span className="section-header">{t("APP_BUSINESS_ACQ2")}</span>
        {/* </div> */}
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!purchaserCompanyLatestBalanceSheet.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_PURCHASER_COMPANY_LATEST_BALANCE_SHEET")}
            </label>
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={purchaserCompanyLatestBalanceSheet.value}
                  onChange={(name, result) =>
                    handlePurchaserCompanyLatestBalanceSheet({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!purchaserCompanyLatestBalanceSheet.isValid && (
              <span className="validation-messsage">
                {purchaserCompanyLatestBalanceSheet.eMessage}
              </span>
            )}
          </div>
          <div
            className={
              "bl__input animated fadeIn " +
              (!purchaserCompanyLatestIncomeStatement.isValid
                ? "--invalid"
                : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_PURCHASER_COMPANY_LATEST_INCOME_STATEMENT")}
            </label>
            <div className="element-group" style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <UploaderApiIncluded
                  name="File"
                  innerText="File upload"
                  defaultFile={purchaserCompanyLatestIncomeStatement.value}
                  onChange={(name, result) =>
                    handlePurchaserCompanyLatestIncomeStatement({
                      target: { value: result.id }
                    })
                  }
                />
              </div>
            </div>
            {!purchaserCompanyLatestIncomeStatement.isValid && (
              <span className="validation-messsage">
                {purchaserCompanyLatestIncomeStatement.eMessage}
              </span>
            )}
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!purchaserGuaranteesAvailable.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label" style={{ marginBottom: "0" }}>
              {t("APP_PURCHASER_GUARANTEES_AVAILABLE")}
            </label>
            <div style={{ margin: "auto -8px" }}>
              <div className="element-group__center">
                <div className="options">
                  {purchaserGuaranteesAvailable_opts.length > 0 &&
                    purchaserGuaranteesAvailable_opts.map((opt, idx) => {
                      const isSelected =
                        purchaserGuaranteesAvailable.value.indexOf(opt) > -1;
                      return (
                        <div
                          key={idx}
                          className={
                            "btnReason " + (isSelected ? "--active" : "")
                          }
                          onClick={() =>
                            handlePurchaserGuaranteesAvailable(opt)
                          }
                        >
                          <div className="btnReason__title">{opt}</div>
                          {isSelected && (
                            <div className="btnReason__active">
                              <span className="icon-checkmark" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>
              {!purchaserGuaranteesAvailable.isValid && (
                <span
                  className="validation-messsage"
                  style={{ paddingLeft: "10px" }}
                >
                  {purchaserGuaranteesAvailable.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!purchaserGuaranteesDescription.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">
              {t("APP_PURCHASER_GUARANTEES_DESCRIPTION")}
            </label>
            <div className="bl__input__element">
              {/* <div className="element-group">
                             <div className="element-group__center"> */}
              <textarea
                className="my-input"
                value={purchaserGuaranteesDescription.value}
                onChange={handlePurchaserGuaranteesDescription}
                style={{
                  maxWidth: "200px",
                  minWidth: "100%",
                  border: "1px solid lightgrey",
                  minHeight: "100px",
                  padding: "10px"
                }}
              ></textarea>
              {!purchaserGuaranteesDescription.isValid && (
                <span className="validation-messsage">
                  {purchaserGuaranteesDescription.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!experience.isValid ? "--invalid" : "")
            }
          >
            <label className="bl__input__label">{t("APP_EXPERIENCE")}</label>
            <div className="bl__input__element">
              {/* <div className="element-group">
                             <div className="element-group__center"> */}
              <textarea
                className="my-input"
                value={experience.value}
                onChange={handleExperience}
                style={{
                  maxWidth: "200px",
                  minWidth: "100%",
                  border: "1px solid lightgrey",
                  minHeight: "100px",
                  padding: "10px"
                }}
              ></textarea>
              {!experience.isValid && (
                <span className="validation-messsage">
                  {experience.eMessage}
                </span>
              )}
            </div>
          </div>
        </div>
        <br />
      </div>
      <div className="modal-footer">
        {/* <button className="btn" onClick={toggleEditModal}>
       <span className="icon-cross"></span>
       &nbsp;
           {t("CLOSE")}
         </button> */}
        <button
          className="btn --success"
          onClick={editApplication}
          disabled={buttonSpinner}
        >
          {!buttonSpinner ? (
            <>
              <span className="icon-checkmark"></span>
              &nbsp;
              {t("SUBMIT")}
            </>
          ) : (
            <CircleSpinner show={true} />
          )}
        </button>
      </div>
    </>
  );
};

export default EditAppliation;
