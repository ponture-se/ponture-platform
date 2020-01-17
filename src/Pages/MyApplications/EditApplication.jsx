import React, { useEffect, useState, useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import "../BusinessLoan/styles.scss";
import SquareSpinner from "components/SquareSpinner";
import UploaderApiIncluded from "components/UploaderApiIncluded";

const EditAppliation = props => {
  //Initialization
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
  const data = props.data;
  const BA = props.data.acquisition;
  const validations = props.isSubmit
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
        experience: false
      }
    : {
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
        experience: true
      };

  //customValidation: func
  const checkValidation = (name, value, customValidation) => {
    let isValid = true;
    let eMessage = "";
    if (typeof customValidation !== "function") {
      if (!validations[name] && (!value || value.length === 0)) {
        isValid = false;
        eMessage = t("REQUIRED_FIELD");
      }
    } else {
      if (!customValidation()) {
        isValid = false;
        eMessage = t("REQUIRED_FIELD");
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
    value: BA.available_guarantees,
    ...checkValidation("purchaserGuaranteesAvailable", BA.available_guarantees)
  });
  const [
    purchaserGuaranteesDescription,
    setPurchaserGuaranteesDescription
  ] = useState({
    value: BA.available_guarantees_description,
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
    value: BA.purchaser_profile,
    ...checkValidation("experience", BA.purchaser_profile)
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
  return null;
  //      <>
  //      <div className="bl bl__infoBox">
  //    <div className="bl__infoBox__header">
  //      {/* <div className="bl__infoBox__circleIcon">
  //        <i className="icon-info" />
  //      </div> */}
  //      <span>{t("EDIT") + " "+ t("BL_NEW_COMPANY")}</span>
  //      <span className="icon-cross modal-close" onClick={toggleEditModal}></span>
  //    </div>
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!selectedREType.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label
  //          className="bl__input__label"
  //          style={{ marginBottom: "0" }}
  //        >
  //          {t("BL_REALESTATE_USAGE_CATEGORY")}
  //        </label>
  //        <div style={{ margin: "auto -8px" }}>
  //          {/* <div className="element-group"> */}
  //          <div className="element-group__center">
  //            <div className="options">
  //              {RETypeOpts.length > 0 &&
  //                RETypeOpts.map((opt, idx) => {
  //                  const isSelected =
  //                    opt === selectedREType.value;
  //                  return (
  //                    <div
  //                      key={idx}
  //                      className={
  //                        "btnReason " +
  //                        (isSelected ? "--active" : "")
  //                      }
  //                      onClick={() => handleREType({target:{value:opt}})}
  //                    >
  //                      <div className="btnReason__title">
  //                        {opt}
  //                      </div>
  //                      {isSelected && (
  //                        <div className="btnReason__active">
  //                          <span className="icon-checkmark" />
  //                        </div>
  //                      )}
  //                    </div>
  //                  );
  //                })}
  //            </div>
  //            {/* </div> */}
  //          </div>
  //          {!selectedREType.isValid && (
  //            <span className="validation-messsage" style={{paddingLeft:"10px"}}>
  //              {selectedREType.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div>
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REAreaIsValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_SIZE")}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="number"
  //                className="my-input"
  //                placeholder="Sqm"
  //                value={REArea}
  //                onChange={handleREAreaChange}
  //              />
  //            </div>
  //          </div>
  //          {!REAreaIsValid && (
  //            <span className="validation-messsage">
  //              {REAreaValidationMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REPriceIsValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_PRICE") + " (Kr)"}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                placeholder="3 000 000"
  //                value={REPrice.visualValue}
  //                onChange={handleREPriceChanged}
  //              />
  //            </div>
  //          </div>
  //          {!REPriceIsValid && (
  //            <span className="validation-messsage">
  //              {REPriceValidationMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div>
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!selectedREUsageCategory.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label
  //          className="bl__input__label"
  //          style={{ marginBottom: "0" }}
  //        >
  //          {t("BL_REALESTATE_USAGE_CATEGORY")}
  //        </label>
  //        <div style={{ margin: "auto -8px" }}>
  //          {/* <div className="element-group"> */}
  //          <div className="element-group__center">
  //            <div className="options">
  //              {REUsageCategoryOpts.length > 0 &&
  //                REUsageCategoryOpts.map((opt, idx) => {
  //                  const isSelected =
  //                    selectedREUsageCategory.value.indexOf(opt) >
  //                    -1;
  //                  return (
  //                    <div
  //                      key={idx}
  //                      className={
  //                        "btnReason " +
  //                        (isSelected ? "--active" : "")
  //                      }
  //                      onClick={() => handleREUsageCategory(opt)}
  //                    >
  //                      <div className="btnReason__title">
  //                        {opt}
  //                      </div>
  //                      {isSelected && (
  //                        <div className="btnReason__active">
  //                          <span className="icon-checkmark" />
  //                        </div>
  //                      )}
  //                    </div>
  //                  );
  //                })}
  //            </div>
  //            {/* </div> */}
  //          </div>
  //          {!selectedREUsageCategory.isValid && (
  //            <span className="validation-messsage" style={{paddingLeft:"10px"}}>
  //              {selectedREUsageCategory.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div>
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!RETaxationValue.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_TAXATION_VALUE") + " (Kr)"}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                placeholder="3 000 000"
  //                value={RETaxationValue.value.visualValue}
  //                onChange={handleRETaxationValue}
  //              />
  //            </div>
  //          </div>
  //          {!RETaxationValue.isValid && (
  //            <span className="validation-messsage">
  //              {RETaxationValue.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REAddress.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_ADDRESS")}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                value={REAddress.value}
  //                onChange={handleREAddress}
  //              />
  //            </div>
  //          </div>
  //          {!REAddress.isValid && (
  //            <span className="validation-messsage">
  //              {REAddress.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div>
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!RECity.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_CITY")}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                value={RECity.value}
  //                onChange={handleRECity}
  //              />
  //            </div>
  //          </div>
  //          {!RECity.isValid && (
  //            <span className="validation-messsage">
  //              {RECity.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!RELink.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label
  //          className="bl__input__label"
  //          style={{ fontSize: "12px", lineHeight: "1.84" }}
  //        >
  //          {t("BL_REALESTATE_LINK")}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                value={RELink.value}
  //                onChange={handleRELink}
  //              />
  //            </div>
  //          </div>
  //          {!RELink.isValid && (
  //            <span className="validation-messsage">
  //              {RELink.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div>
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REDescription.isValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_DESCRIPTION")}
  //        </label>
  //        <div className="bl__input__element">
  //          {/* <div className="element-group">
  //             <div className="element-group__center"> */}
  //          <textarea
  //            className="my-input"
  //            value={REDescription.value}
  //            onChange={handleREDescription}
  //            style={{
  //              maxWidth: "100%",
  //              minWidth: "100%",
  //              border: "1px solid lightgrey",
  //              minHeight: "100px",
  //              padding: "10px"
  //            }}
  //          ></textarea>
  //          {/* </div>
  //          </div> */}
  //          {!REDescription.isValid && (
  //            <span className="validation-messsage">
  //              {REDescription.eMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //      {/* <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REPriceIsValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("PRICE") + " (Kr)"}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                placeholder="3 000 000"
  //                value={REPrice.visualValue}
  //                onChange={handleREPriceChanged}
  //              />
  //            </div>
  //          </div>
  //          {!REPriceIsValid && (
  //            <span className="validation-messsage">
  //              {REPriceValidationMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div> */}
  //    </div>
  //    {/* <br/>
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REPriceIsValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("PRICE") + " (Kr)"}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                placeholder="3 000 000"
  //                value={REPrice.visualValue}
  //                onChange={handleREPriceChanged}
  //              />
  //            </div>
  //          </div>
  //          {!REPriceIsValid && (
  //            <span className="validation-messsage">
  //              {REPriceValidationMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REPriceIsValid ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("PRICE") + " (Kr)"}
  //        </label>
  //        <div className="bl__input__element">
  //          <div className="element-group">
  //            <div className="element-group__center">
  //              <input
  //                type="text"
  //                className="my-input"
  //                placeholder="3 000 000"
  //                value={REPrice.visualValue}
  //                onChange={handleREPriceChanged}
  //              />
  //            </div>
  //          </div>
  //          {!REPriceIsValid && (
  //            <span className="validation-messsage">
  //              {REPriceValidationMessage}
  //            </span>
  //          )}
  //        </div>
  //      </div>
  //    </div> */}
  //    <br />
  //    <div className="userInputs">
  //      <div
  //        className={
  //          "bl__input animated fadeIn " +
  //          (!REFile ? "--invalid" : "")
  //        }
  //      >
  //        <label className="bl__input__label">
  //          {t("BL_REALESTATE_FILE")}
  //        </label>
  //        {/* <div className="bl__input__element"> */}
  //        <div
  //          className="element-group"
  //          style={{ margin: "auto -8px" }}
  //        >
  //          <div className="element-group__center">
  //            <UploaderApiIncluded
  //              name="File"
  //              innerText="File upload"
  //              onChange={(name, result) => setREFile(result.id)}
  //            />
  //          </div>
  //        </div>
  //        {!REFile.isValid && (
  //          <span className="validation-messsage">
  //            {REFile.eMessage}
  //          </span>
  //        )}
  //      </div>
  //    </div>
  //    {/* </div> */}
  //    <br />
  //    <br />
  //  </div>
  //  <div className="modal-footer">

  //    {/* <button className="btn" onClick={toggleEditModal}>
  //  <span className="icon-cross"></span>
  //  &nbsp;
  //      {t("CLOSE")}
  //    </button> */}
  //  <button className="btn --success" onClick={toggleEditModal}>
  //    <span className="icon-checkmark"></span>
  //    &nbsp;
  //    {t("SUBMIT")}
  //    </button>
  //  </div>
  //  </>
};

export default EditAppliation;
