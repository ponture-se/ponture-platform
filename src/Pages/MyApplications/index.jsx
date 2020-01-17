import React, { useEffect, useState,useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import "../BusinessLoan/styles.scss";
import Item from "./item";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getMyApplications } from "api/main-api";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { startBankId, cancelVerify, submitLoan } from "api/business-loan-api";
import Modal from "components/Modal";
import UploaderApiIncluded from "components/UploaderApiIncluded";
//
const MyApplications = props => {
  let didCancel = false;
  const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;

  //state initialization
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const { t } = useLocale();
  const [selectedApp, setApp] = useState();
  const [loading, toggleLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [verifyModal, toggleVerifyModal] = useState(false);
  const [startResult, setStartResult] = useState(undefined);
  const [personalNumber, setPersonalNumber] = useState("");
  const [lastCallback, setLastCallback] = useState(undefined);
  const [editModal, setEditModal] = useState(false);
  const [editModalData, setEditModalData] = useState(undefined);
  //ATTENTION: NEEDS REFACTOR
  const REUsageCategoryOpts = [
    "Bostäder",
    "Kontor",
    "Butiker",
    "Industrier/Verkstäder",
    "Lager/Logistik",
    "Övrigt"
  ];
  const RETypeOpts = ["Fastighet med mark", "Fastighet utan mark"];




  

  // const handleREUsageCategoryOpts = useCallback(
  //   e => {
  //     let _newOpts = Array.from(selectedREUsageCategoryOpts);

  //     if (selectedREUsageCategoryOpts.indexOf(e) > -1) {
  //       _newOpts.splice(_newOpts.indexOf(e), 1);
  //     } else {
  //       _newOpts.push(e);
  //     }

  //     setSelectedREUsageCategoryOpts(_newOpts);
  //   },
  //   [selectedREUsageCategoryOpts]
  // );
  const [REPrice, setREPrice] = useState({
    realValue: 0,
    visualValue: ""
  });
  const [REPriceIsValid, setREPriceIsValid] = useState(true);
  const [REPriceValidationMessage, setREPriceValidationMessage] = useState();
  const [REArea, setREArea] = useState();
  const [REAreaIsValid, setREAreaIsValid] = useState(true);
  const [REAreaValidationMessage, setREAreaValidationMessage] = useState();
  const [selectedREType, setSelectedREType] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REUsageCategory, setREUsageCategory] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RETaxationValue, setRETaxationValue] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REAddress, setREAddress] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RECity, setRECity] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RELink, setRELink] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REDescription, setREDescription] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REFile, setREFile] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [selectedREUsageCategory, setSelectedREUsageCategory] = useState({
    value: [],
    isValid: true,
    eMessage: ""
  });
  const handleREUsageCategory = useCallback(
    e => {
      let _newOpts = Array.from(selectedREUsageCategory.value);
      let eMessage = "";
      let isValid = true;
      if (selectedREUsageCategory.value.indexOf(e) > -1) {
        _newOpts.splice(_newOpts.indexOf(e), 1);
      } else {
        _newOpts.push(e);
      }
      if (_newOpts.length === 0) {
        eMessage = t("MANDATORY_FIELD");
        isValid = false;
      }
      setSelectedREUsageCategory({
        isValid: isValid,
        eMessage: eMessage,
        value: _newOpts
      });
    },
    [selectedREUsageCategory]
  );

  //ATTENTION: NEEDS REFACTOR
  const handleREAreaChange = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";

      if (value.length === 0) {
        isValid = false;
        validationMessage = t("BL_REALESTATE_AREA_IS_REQUIRED");
      }
      setREArea(value);
      setREAreaIsValid(isValid);
      setREAreaValidationMessage(validationMessage);
    },
    [REArea, REPriceIsValid, REAreaValidationMessage]
  );
  const handleREPriceChanged = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setREPrice({
          realValue: 0,
          visualValue: ""
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setREPrice({
            realValue: _value,
            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
          });
        }
      }
      setREPriceIsValid(isValid);
      setREPriceValidationMessage(validationMessage);
    },
    [REPrice, REPriceIsValid, REPriceValidationMessage]
  );

  const handleREType = useCallback(
    e => {
      const { value } = e.target;
      let _newOpt = "";
      let isValid = true;
      let eMessage = "";
      if (selectedREType !== value) {
        _newOpt = value;
      }
      if (
        !selectedREType ||
        (Array.isArray(selectedREType) && selectedREType.length === 0)
      ) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setSelectedREType({
        value: _newOpt,
        isValid: isValid,
        eMessage: eMessage
      });
    },
    [selectedREType]
  );
  const handleRETaxationValue = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setRETaxationValue({
          isValid: isValid,
          eMessage: validationMessage,
          value: { realValue: 0, visualValue: "" }
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setRETaxationValue({
            isValid: isValid,
            eMessage: validationMessage,
            value: {
              realValue: _value,
              visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
            }
          });
        }
      }
    },
    [RETaxationValue]
  );
  const handleREAddress = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setREAddress({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REAddress]
  );
  const handleRECity = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setRECity({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [RECity]
  );
  const handleRELink = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setRELink({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [RELink]
  );
  const handleREDescription = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setREDescription({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REDescription]
  );
  const handleREFile = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      setREFile({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REFile]
  );
  
  //pNum: personalNumber
  //BankId function
  function handleVerifyApplication(pNum, successCallback, failedCallback) {
    handleBankIdClicked(pNum, {
      success: successCallback,
      failed: failedCallback
    });
  }
  function handleSuccessBankId(result) {
    setStartResult(undefined);
    if (typeof lastCallback.success === "function") {
      // _getMyApplications();
      lastCallback.success(result, () => toggleVerifyModal(false));
    }

    // setLastCallback(() => {
    //   return;
    // });
  }

  //Side effects
    //componentDidMount
    useEffect(() => {
      _getMyApplications();
      return () => {
        didCancel = true;
      };
    }, []);
    
    useEffect(()=>{
      if(editModalData){
        setREPrice({
          realValue: editModalData.real_estate.real_estate_price,
          visualValue: String(editModalData.real_estate.real_estate_price).replace(numberFormatRegex, "$1 ")
        });
        setREPriceIsValid(true);
        setREPriceValidationMessage();
        setREArea(editModalData.real_estate.real_estate_size);
        setREAreaIsValid(true);
        setREAreaValidationMessage();
        setSelectedREType({
          value: editModalData.real_estate.real_estate_type,
          isValid: true,
          eMessage: ""
        });
        setREUsageCategory({
          value: editModalData.real_estate.real_estate_usage_category,
          isValid: true,
          eMessage: ""
        });
        setRETaxationValue({
          value: editModalData.real_estate.real_estate_taxation_value,
          isValid: true,
          eMessage: ""
        });
        setREAddress({
          value: editModalData.real_estate.real_estate_address,
          isValid: true,
          eMessage: ""
        });
        setRECity({
          value: editModalData.real_estate.real_estate_city,
          isValid: true,
          eMessage: ""
        });
        setRELink({
          value: editModalData.real_estate.real_estate_link,
          isValid: true,
          eMessage: ""
        });
        setREDescription({
          value: editModalData.real_estate.real_estate_description,
          isValid: true,
          eMessage: ""
        });
        setREFile({
          value: editModalData.real_estate.real_estate_document,
          isValid: true,
          eMessage: ""
        });
        setSelectedREUsageCategory({
          value: editModalData.real_estate.real_estate_usage_category,
          isValid: true,
          eMessage: ""
        });
      }
    },[editModalData]);
  //After bankId
  function handleBankIdClicked(pNum, callbacksObj) {
    if (typeof callbacksObj === "object") {
      setLastCallback(callbacksObj);
    }
    startBankId()
      .onOk(result => {
        if (!didCancel) {
          setStartResult(result);
          toggleVerifyModal(true);
          // save result in session storage to use in customer portal
          // Cookies.set("@ponture-customer-portal/token", result);
          // if (window.analytics)
          //   window.analytics.track("BankID Verification", {
          //     category: "Loan Application",
          //     label: "/app/loan/ bankid popup",
          //     value: 0
          //   });
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          callbacksObj.failed(result, () => setLastCallback(undefined));
          setError({
            sender: "verifyBankId"
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          callbacksObj.failed(result, () => setLastCallback(undefined));
          setError({
            sender: "verifyBankId"
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          callbacksObj.failed(result, () => setLastCallback(undefined));
          setError({
            sender: "verifyBankId"
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          callbacksObj.failed(result, () => setLastCallback(undefined));
          setError({
            sender: "verifyBankId"
          });
        }
      })
      .call(pNum);
  }
  function handleCancelVerify() {
    // if (window.analytics)
    // window.analytics.track("BankID Failed", {
    //   category: "Loan Application",
    //   label: "/app/loan/ bankid popup",
    //   value: 0
    // });
    toggleVerifyModal(false);
    cancelVerify()
      .onOk(result => {
        if (typeof lastCallback.failed === "function") {
          lastCallback.failed(result, () => setLastCallback(undefined));
        }
        setStartResult(false);
      })
      .onServerError(result => {
        if (!didCancel) {
          if (typeof lastCallback === "function") {
            lastCallback.failed(result, () => setLastCallback(undefined));
          }
          toggleVerifyModal(false);
          setStartResult(false);
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          if (typeof lastCallback === "function") {
            lastCallback.failed(result, () => setLastCallback(undefined));
          }
          toggleVerifyModal(false);
          setStartResult(false);
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          if (typeof lastCallback === "function") {
            lastCallback.failed(result, () => setLastCallback(undefined));
          }
          toggleVerifyModal(false);
          setStartResult(false);
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          if (typeof lastCallback === "function") {
            lastCallback.failed(result, () => setLastCallback(undefined));
          }
          toggleVerifyModal(false);
          setStartResult(false);
        }
      })
      .call(startResult.orderRef);
  }
  function handleCloseVerifyModal(isSuccess, result, bIdResult) {
    if (isSuccess) {
      // dispatch({
      //   type: "TOGGLE_B_L_MORE_INFO",
      //   value: true
      // });
      // save bank id result to us ein customer
      // dispatch({
      //   type: "VERIFY_BANK_ID_SUCCESS",
      //   payload: bIdResult
      // });
      // sessionStorage.setItem(
      //   "@ponture-customer-bankid",
      //   JSON.stringify(bIdResult)
      // );
      // lastCallback(result);
      if (typeof lastCallback.success === "function") {
        lastCallback.success(result);
      }
      dispatch({
        type: "ADD_NOTIFY",
        value: {
          type: "success",
          message: "BankId lyckades"
        }
      });
      // toggleVerifyModal(false);
      // setLastCallback(undefined);
      // setStartResult(false);
    } else {
      if (typeof lastCallback.failed === "function") {
        lastCallback.failed(result);
      }
      toggleVerifyModal(false);
      setLastCallback(undefined);
      setStartResult(false);
      dispatch({
        type: "ADD_NOTIFY",
        value: {
          type: "error",
          message: "BankId misslyckades"
        }
      });
    }
  }
  //Submit verification
  function handleSaveBankId() {}
  //Submit application function
  function handleSubmitApplication(data, callback) {
    submitLoan()
      .onOk(result => {
        if (!didCancel) {
          if (result.errors) {
            //failed
            // if (window.analytics)
            //   window.analytics.track("Failure", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: 0
            //   });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Skicka misslyckades"
              }
            });
          } else {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: "Skicka har varit framgångsrikt"
              }
            });
            if (typeof callback === "function") {
              _getMyApplications();
              callback(false);
            }
            //success
            // if (window.analytics)
            //   window.analytics.track("Submit", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: loanAmount
            //   });
          }
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Skicka misslyckades"
            }
          });
        }
      })
      .call(data);
  }

  function _getMyApplications() {
    toggleLoading(true);
    getMyApplications()
      .onOk(result => {
        if (!didCancel) {
          setData(result);
          toggleLoading(false);
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleLoading(false);
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call(
        userInfo && currentRole === "agent"
          ? { currentRole: "agent", id: userInfo.broker_id }
          : { currentRole: "customer", id: userInfo.personalNumber }
      );
  }
  function handleSuccessCancel() {
    toggleLoading(true);
    _getMyApplications();
  }
  function toggleEditModal(data) {
    //If modal is open then it's time to make editModalData state empty
    if(editModal){
      setEditModalData(undefined);
    }else{
      setEditModalData(data);
    }
    setEditModal(!editModal);
  }
  return (
    <div className="myApps">
      {loading ? (
        <div className="page-loading">
          <SquareSpinner />
          <h2>{t("MY_APPS_LOADING_TEXT")}</h2>
        </div>
      ) : error ? (
        <div className="page-list-error animated fadeIn">
          <Wrong />
          <h2>{error && error.title}</h2>
          <span>{error && error.message}</span>
        </div>
      ) : !data || data.length === 0 ? (
        <div className="page-empty-list animated fadeIn">
          <Empty />
          <h2>{t("MY_APPS_EMPTY_LIST_TITLE")}</h2>
          <span>{t("MY_APPS_EMPTY_LIST_MSG")}</span>
        </div>
      ) : (
        <>
          {data.map(app => (
            <Item
              key={app.opportunityID}
              item={app}
              onCancelSuccess={handleSuccessCancel}
              verify={handleVerifyApplication}
              submit={handleSubmitApplication}
              edit={toggleEditModal}
            />
          ))}
          {verifyModal && (
            <VerifyBankIdModal
              startResult={startResult}
              personalNumber={personalNumber}
              onClose={handleCloseVerifyModal}
              // onVerified={handleSuccessBankId}
              onSuccess={handleSuccessBankId}
              onCancelVerify={handleCancelVerify}
              config={{
                companyList: false,
                isLogin: true
              }}
            />
          )}
        </>
      )}
      {editModal && (
        <Modal>
          <div className="bl bl__infoBox">
                    <div className="bl__infoBox__header">
                      {/* <div className="bl__infoBox__circleIcon">
                        <i className="icon-info" />
                      </div> */}
                      <span>{t("EDIT") + " "+ t("BL_REALESTATE_INFO")}</span>
                      <span className="icon-cross modal-close" onClick={toggleEditModal}></span>
                    </div>
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!selectedREType.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ marginBottom: "0" }}
                        >
                          {t("BL_REALESTATE_USAGE_CATEGORY")}
                        </label>
                        <div style={{ margin: "auto -8px" }}>
                          {/* <div className="element-group"> */}
                          <div className="element-group__center">
                            <div className="options">
                              {RETypeOpts.length > 0 &&
                                RETypeOpts.map((opt, idx) => {
                                  const isSelected =
                                    opt === selectedREType.value;
                                  return (
                                    <div
                                      key={idx}
                                      className={
                                        "btnReason " +
                                        (isSelected ? "--active" : "")
                                      }
                                      onClick={() => handleREType({target:{value:opt}})}
                                    >
                                      <div className="btnReason__title">
                                        {opt}
                                      </div>
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
                          {!selectedREType.isValid && (
                            <span className="validation-messsage" style={{paddingLeft:"10px"}}>
                              {selectedREType.eMessage}
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
                          (!REAreaIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_SIZE")}
                        </label>
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
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REPrice.visualValue}
                                onChange={handleREPriceChanged}
                              />
                            </div>
                          </div>
                          {!REPriceIsValid && (
                            <span className="validation-messsage">
                              {REPriceValidationMessage}
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
                          (!selectedREUsageCategory.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ marginBottom: "0" }}
                        >
                          {t("BL_REALESTATE_USAGE_CATEGORY")}
                        </label>
                        <div style={{ margin: "auto -8px" }}>
                          {/* <div className="element-group"> */}
                          <div className="element-group__center">
                            <div className="options">
                              {REUsageCategoryOpts.length > 0 &&
                                REUsageCategoryOpts.map((opt, idx) => {
                                  const isSelected =
                                    selectedREUsageCategory.value.indexOf(opt) >
                                    -1;
                                  return (
                                    <div
                                      key={idx}
                                      className={
                                        "btnReason " +
                                        (isSelected ? "--active" : "")
                                      }
                                      onClick={() => handleREUsageCategory(opt)}
                                    >
                                      <div className="btnReason__title">
                                        {opt}
                                      </div>
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
                          {!selectedREUsageCategory.isValid && (
                            <span className="validation-messsage" style={{paddingLeft:"10px"}}>
                              {selectedREUsageCategory.eMessage}
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
                          (!RETaxationValue.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_TAXATION_VALUE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={RETaxationValue.value.visualValue}
                                onChange={handleRETaxationValue}
                              />
                            </div>
                          </div>
                          {!RETaxationValue.isValid && (
                            <span className="validation-messsage">
                              {RETaxationValue.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REAddress.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_ADDRESS")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={REAddress.value}
                                onChange={handleREAddress}
                              />
                            </div>
                          </div>
                          {!REAddress.isValid && (
                            <span className="validation-messsage">
                              {REAddress.eMessage}
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
                          (!RECity.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_CITY")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={RECity.value}
                                onChange={handleRECity}
                              />
                            </div>
                          </div>
                          {!RECity.isValid && (
                            <span className="validation-messsage">
                              {RECity.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!RELink.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ fontSize: "12px", lineHeight: "1.84" }}
                        >
                          {t("BL_REALESTATE_LINK")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={RELink.value}
                                onChange={handleRELink}
                              />
                            </div>
                          </div>
                          {!RELink.isValid && (
                            <span className="validation-messsage">
                              {RELink.eMessage}
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
                          (!REDescription.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_DESCRIPTION")}
                        </label>
                        <div className="bl__input__element">
                          {/* <div className="element-group">
                             <div className="element-group__center"> */}
                          <textarea
                            className="my-input"
                            value={REDescription.value}
                            onChange={handleREDescription}
                            style={{
                              maxWidth: "100%",
                              minWidth: "100%",
                              border: "1px solid lightgrey",
                              minHeight: "100px",
                              padding: "10px"
                            }}
                          ></textarea>
                          {/* </div>
                          </div> */}
                          {!REDescription.isValid && (
                            <span className="validation-messsage">
                              {REDescription.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      {/* <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REPrice.visualValue}
                                onChange={handleREPriceChanged}
                              />
                            </div>
                          </div>
                          {!REPriceIsValid && (
                            <span className="validation-messsage">
                              {REPriceValidationMessage}
                            </span>
                          )}
                        </div>
                      </div> */}
                    </div>
                    {/* <br/>
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REPrice.visualValue}
                                onChange={handleREPriceChanged}
                              />
                            </div>
                          </div>
                          {!REPriceIsValid && (
                            <span className="validation-messsage">
                              {REPriceValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REPrice.visualValue}
                                onChange={handleREPriceChanged}
                              />
                            </div>
                          </div>
                          {!REPriceIsValid && (
                            <span className="validation-messsage">
                              {REPriceValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div> */}
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REFile ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_FILE")}
                        </label>
                        {/* <div className="bl__input__element"> */}
                        <div
                          className="element-group"
                          style={{ margin: "auto -8px" }}
                        >
                          <div className="element-group__center">
                            <UploaderApiIncluded
                              name="File"
                              innerText="File upload"
                              onChange={(name, result) => setREFile(result.id)}
                            />
                          </div>
                        </div>
                        {!REFile.isValid && (
                          <span className="validation-messsage">
                            {REFile.eMessage}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* </div> */}
                    <br />
                    <br />
                  </div>
                  <div className="modal-footer">
                  
                    {/* <button className="btn" onClick={toggleEditModal}>
                  <span className="icon-cross"></span>
                  &nbsp;
                      {t("CLOSE")}
                    </button> */}
                  <button className="btn --success" onClick={toggleEditModal}>
                    <span className="icon-checkmark"></span>
                    &nbsp;
                    {t("SUBMIT")}
                    </button>
                  </div>
        </Modal>
      )}
    </div>
  );
};

export default MyApplications;
