import React, { useEffect, useState, useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import "./EditApplication.scss";
import "../BusinessLoan/styles.scss";
import SquareSpinner from "components/SquareSpinner";
import UploaderApiIncluded from "components/UploaderApiIncluded";
const EditAppliation = props => {
  //Initialization
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const data = props.data;
  const { toggleEditModal } = props;
  const BA = props.data.acquisition;
  const validations =
    props.action === "submit"
      ? //false: Mandatory, true:Optional
        {
          // objectName: "Mandatory",
          // objectCompanyName: "Mandatory",
          // objectOrganizationNumber: "Mandatory",
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
          additional_files: true,
          business_plan: false,
          own_investment_amount: false,
          own_investment_description: true
        }
      : props.action === "edit"
      ? {
          // objectName: true,
          // objectCompanyName: true,
          // objectOrganizationNumber: true,
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
          additional_files: true,
          business_plan: true,
          own_investment_amount: true,
          own_investment_description: true
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
      if (!customValidation()) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
    }
    return { isValid: isValid, eMessage: eMessage };
  };
  // acquisition_object
  // acquisition_object
  // acquisition_object
  // object_industry
  // object_price
  // object_valuation_letter
  // object_annual_report
  // object_balance_sheet
  // object_income_statement
  // account_balance_sheet
  // account_income_statement
  // available_guarantees
  // available_guarantees_description
  // purchaser_profile
  // const [objectName, setObjectName] = useState({
  //   value: BA.,
  //   isValid: true,
  //   eMessage: ""
  // });
  // const [objectCompanyName, setObjectCompanyName] = useState({
  //       value: BA.,
  //       isValid: true,
  //       eMessage: ""
  //     });
  // const [objectOrganizationNumber, setObjectOrganizationNumber] = useState({
  //       value: BA.,
  //       isValid: true,
  //       eMessage: ""
  //     });
  const [objectIndustryBranch, setObjectIndustryBranch] = useState({
    value: BA.object_industry,
    ...checkValidation("objectIndustryBranch", BA.object_industry)
  });
  const [objectPrice, setObjectPrice] = useState({
    value: {
      realValue: BA.object_price,
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
  // const [purchaserCompanyOrganizationNumber,setPurchaserCompanyOrganizationNumber] = useState({
  //   value: BA.object_income_Statement,
  //   ...checkValidation(
  //     "objectLatestIncomeStatement",
  //     BA.object_income_Statement
  //   )
  // });
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
  // const [purchaserPersonalNumber, setPurchaserPersonalNumber] = useState({
  //       value: BA.,
  //       isValid: true,
  //       eMessage: ""
  //     });
  const [experience, setExperience] = useState({
    value: BA.purchaser_profile ? BA.purchaser_profile : "",
    ...checkValidation("experience", BA.purchaser_profile)
  });
  const [purchaseType, setPurchaseType] = useState({
    value: BA.purchaseType ? BA.purchaseType : "",
    ...checkValidation("purchaseType", BA.purchaseType)
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
  // const handleObjectName = useCallback(
  //   e => {
  //     const { value } = e.target;
  //     let isValid = true,
  //       eMessage = "";
  //     // if (value.length === 0) {
  //     //   isValid = false;
  //     //   eMessage = t("REQUIRED_FIELD");
  //     // }
  //     setObjectName({
  //       isValid: isValid,
  //       eMessage: eMessage,
  //       value: value
  //     });
  //   },
  //   [objectName]
  // );

  // //company name
  // const handleObjectCompanyName = useCallback(
  //   e => {
  //     const { value } = e.target;
  //     let isValid = true,
  //       eMessage = "";
  //     setObjectCompanyName({
  //       isValid: isValid,
  //       eMessage: eMessage,
  //       value: value
  //     });
  //   },
  //   [objectCompanyName]
  // );

  // //Orgnumber
  // const handleObjectOrganizationNumber = useCallback(
  //   e => {
  //     const { value } = e.target;
  //     let isValid = true,
  //       eMessage = "";
  //     setObjectOrganizationNumber({
  //       isValid: isValid,
  //       eMessage: eMessage,
  //       value: value
  //     });
  //   },
  //   [objectOrganizationNumber]
  // );

  //Industry branch
  const handleObjectIndustryBranch = useCallback(
    e => {
      const { value } = e.target;
      let _newOpt = "";
      let isValid = true;
      let eMessage = "";
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
      let { value, name } = e.target;
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
      let isValid = true;
      let eMessage = "";
      setObjectLatestIncomeStatement({
        value: value,
        ...checkValidation("objectLatestIncomeStatement", value)
      });
    },
    [objectLatestIncomeStatement]
  );
  // const handlePurchaserCompanyOrganizationNumber = useCallback(
  //   e => {
  //     let { value } = e.target;
  //     let isValid = true;
  //     let eMessage = "";
  //     setPurchaserCompanyOrganizationNumber({
  //       value: value,
  //       ...checkValidation("purchaserCompanyOrganizationNumber", value, () => {
  //         return value.length < 10 && value.length > 11;
  //       })
  //     });
  //   },
  //   [purchaserCompanyOrganizationNumber]
  // );
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
      let _newOpts = Array.from(purchaseType.value);
      let eMessage = "";
      let isValid = true;
      if (purchaseType.value.indexOf(e) > -1) {
        _newOpts.splice(_newOpts.indexOf(e), 1);
      } else {
        _newOpts.push(e);
      }
      if (_newOpts.length === 0) {
        eMessage = t("MANDATORY_FIELD");
        isValid = false;
      }
      setPurchaseType({
        isValid: isValid,
        eMessage: eMessage,
        value: _newOpts
      });
    },
    [purchaseType]
  );
  const editApplication = () => {
    props.onEdit({
      acquisition: {
        object_industry:
          objectIndustryBranch.value === null ? "" : objectIndustryBranch.value,
        object_price: String(objectPrice.value.realValue),
        object_valuation_letter:
          objectValuationLetter.value === null
            ? ""
            : objectValuationLetter.value,
        object_annual_report:
          objectAnnualReport.value === null ? "" : objectAnnualReport.value,
        object_balance_sheet:
          objectLatestBalanceSheet.value === null
            ? ""
            : objectLatestBalanceSheet.value,
        object_income_statement:
          objectLatestIncomeStatement.value === null
            ? ""
            : objectLatestIncomeStatement.value,
        account_balance_sheet:
          purchaserCompanyLatestBalanceSheet.value === null
            ? ""
            : purchaserCompanyLatestBalanceSheet.value,
        account_income_statement:
          purchaserCompanyLatestIncomeStatement.value === null
            ? ""
            : purchaserCompanyLatestIncomeStatement.value,
        available_guarantees:
          purchaserGuaranteesAvailable.value === null
            ? ""
            : purchaserGuaranteesAvailable.value,
        available_guarantees_description:
          purchaserGuaranteesDescription.value === null
            ? ""
            : purchaserGuaranteesDescription.value,
        purchaser_profile: experience.value === null ? "" : experience.value,
        purchase_type: purchaseType.value === null ? "" : purchaseType.value
        // own_investment_amount:,
        // own_investment_details:,
        // business_plan:,
        // additional_details:,
      }
    });
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
        <br />
        <span className="section-header">{t("APP_BUSINESS_ACQ1")}</span>
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
          {/* <div
          className={
            "bl__input animated fadeIn " + (!REAreaIsValid ? "--invalid" : "")
          }
        >
          <label className="bl__input__label">{t("BL_REALESTATE_SIZE")}</label>
          <div className="bl__input__element">
            <div className="element-group">
              <div className="element-group__center">
                <input
                  type="number"
                  className="my-input"
                  placeholder="Sqm"
                  value={REArea}
                  onChange={handleREAreaChange}
                />
              </div>
            </div>
            {!REAreaIsValid && (
              <span className="validation-messsage">
                {REAreaValidationMessage}
              </span>
            )}
          </div>
        </div> */}
        </div>
        <br />
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!objectValuationLetter.value ? "--invalid" : "")
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
              (!objectLatestBalanceSheet.value ? "--invalid" : "")
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
        <div className="userInputs">
          <div
            className={
              "bl__input animated fadeIn " +
              (!experience.isValid ? "--invalid" : "")
            }
          >
            <label
              className="bl__input__label"
              style={{ fontSize: "15px", marginBottom: "12px" }}
            >
              {t("APP_EXPERIENCE")}
            </label>
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
        <button className="btn --success" onClick={editApplication}>
          <span className="icon-checkmark"></span>
          &nbsp;
          {t("SUBMIT")}
        </button>
      </div>
    </>
  );
};

export default EditAppliation;
