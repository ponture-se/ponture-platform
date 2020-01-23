import React, { useEffect, useState, useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import "../BusinessLoan/styles.scss";
import Item from "./item";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getMyApplications } from "api/main-api";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import {
  startBankId,
  cancelVerify,
  submitLoan,
  saveLoan
} from "api/business-loan-api";
import Modal from "components/Modal";
import UploaderApiIncluded from "components/UploaderApiIncluded";
import EditAppliation from "./EditApplication";
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
  const [itemData, setItemData] = useState(undefined);

  //pNum: personalNumber
  //BankId function
  function handleVerifyApplication(data, successCallback, failedCallback) {
    const pNum = data.contactInfo.personalNumber;
    setItemData(data);
    handleBankIdClicked(pNum, {
      success: successCallback,
      failed: failedCallback
    });
  }
  function handleSuccessBankId(result) {
    setStartResult(undefined);
    if (typeof lastCallback.success === "function") {
      // _getMyApplications();
      lastCallback.success(result, () => {
        toggleVerifyModal(false);
        saveApplication({
          bankid: result
        });
      });
    }
  }

  //Side effects
  //componentDidMount
  useEffect(() => {
    _getMyApplications();
    return () => {
      didCancel = true;
    };
  }, []);

  // useEffect(() => {
  //   if (itemData) {
  //     setREPrice({
  //       realValue: itemData.real_estate.real_estate_price,
  //       visualValue: String(
  //         itemData.real_estate.real_estate_price
  //       ).replace(numberFormatRegex, "$1 ")
  //     });
  //     setREPriceIsValid(true);
  //     setREPriceValidationMessage();
  //     setREArea(itemData.real_estate.real_estate_size);
  //     setREAreaIsValid(true);
  //     setREAreaValidationMessage();
  //     setSelectedREType({
  //       value: itemData.real_estate.real_estate_type,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setREUsageCategory({
  //       value: itemData.real_estate.real_estate_usage_category,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setRETaxationValue({
  //       value: itemData.real_estate.real_estate_taxation_value,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setREAddress({
  //       value: itemData.real_estate.real_estate_address,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setRECity({
  //       value: itemData.real_estate.real_estate_city,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setRELink({
  //       value: itemData.real_estate.real_estate_link,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setREDescription({
  //       value: itemData.real_estate.real_estate_description,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setREFile({
  //       value: itemData.real_estate.real_estate_document,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //     setSelectedREUsageCategory({
  //       value: itemData.real_estate.real_estate_usage_category,
  //       isValid: true,
  //       eMessage: ""
  //     });
  //   }
  // }, [itemData]);
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
      saveApplication({
        bankid: result
      });
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

  function _getMyApplications(callback) {
    toggleLoading(true);
    getMyApplications()
      .onOk(result => {
        if (!didCancel) {
          setData(result);
          toggleLoading(false);
          if (typeof callback === "function") {
            callback(true);
          }
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleLoading(false);
          if (typeof callback === "function") {
            callback(false);
          }
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleLoading(false);
          if (typeof callback === "function") {
            callback(false);
          }
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (typeof callback === "function") {
          callback(false);
        }
        if (!didCancel) {
          toggleLoading(false);
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleLoading(false);
          if (typeof callback === "function") {
            callback(false);
          }
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          toggleLoading(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
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
  function saveApplication(obj) {
    debugger;
    for (const key in itemData) {
      if (itemData[key] === null) {
        itemData[key] = "";
      }
    }
    for (const key in itemData.real_estate) {
      if (itemData.real_estate[key] === null) {
        itemData.real_estate[key] = "";
      }
    }
    const _obj = {
      ...itemData,
      ...obj,
      lastName: itemData.contactInfo.lastName,
      amourtizationPeriod: itemData.amortizationPeriod,
      personalNumber: itemData.contactInfo.personalNumber,
      need: itemData.need.map(item => item.apiName)
    };
    if (userInfo.broker_id) {
      _obj.broker_id = userInfo.broker_id;
    }
    if (itemData.need[0] !== "purchase_of_business") {
      _obj.orgName = itemData.Name;
    }
    saveLoan(currentRole)
      .onOk(result => {
        if (!didCancel) {
          if (result.errors && result.length > 0) {
            // if (window.analytics)
            //   window.analytics.track("Failure", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: 0
            //   });
            setError({
              sender: "submitLoan"
            });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Unsuccessful"
              }
            });
          } else {
            _getMyApplications(() => {
              setEditModal(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "success",
                  message: "Successful"
                }
              });
            });

            // if (window.analytics)
            //   window.analytics.track("Create", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: loanAmount
            //   });
          }
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          // toggleSubmitSpinner(false);
          setError({
            sender: "submitLoan"
          });
        }
      })
      .call(_obj);
  }
  function toggleEditModal(data) {
    //If modal is open then it's time to make itemData state empty
    if (editModal) {
      setItemData(undefined);
    } else {
      setItemData(data);
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
        <Modal
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "0"
          }}
        >
          {/* <div className="bl__infoBox__header">
            <span style={{ fontSize: "15px" }}>
              {t("EDIT") + " " + t("BL_COMPANY_INFO")}
            </span>
            <span
              className="icon-cross modal-close"
              onClick={toggleEditModal}
            ></span>
          </div> */}
          <EditAppliation
            cancelEdit={toggleEditModal}
            action={"edit"}
            data={itemData}
            onEdit={saveApplication}
          />
        </Modal>
      )}
    </div>
  );
};

export default MyApplications;
