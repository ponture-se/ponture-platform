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
import EditAppliation from "../EditApplication";
import BusinessAcquisitionView from "../ViewApplication/BusinessAcquisitionView";
import RealEstateView from "../ViewApplication/RealEstateView";
import Pagination from "react-js-pagination";
import "./pagination.scss";
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
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: process.env.REACT_APP_MINASIDOR_RESULT_LIMIT,
    totalRecords: 0,
    activePage: 1
  });
  const [editModal, setEditModal] = useState({
    visibility: false,
    action: undefined,
    data: undefined,
    loading: false
  });
  const [viewModal, setViewModal] = useState({
    visibility: false,
    data: undefined,
    type: undefined
  });
  const [itemData, setItemData] = useState(undefined);
  //pNum: personalNumber
  //BankId function
  function handleVerifyApplication(item, successCallback, failedCallback) {
    const pNum = item.contactInfo.personalNumber;
    setItemData(item);
    handleBankIdClicked(pNum, {
      success: successCallback,
      failed: failedCallback
    });
  }
  function handleSuccessBankId(result) {
    setStartResult(undefined);
    dispatch({
      type: "ADD_NOTIFY",
      value: {
        type: "success",
        message: "Ansökan varifierades, Sparar data."
      }
    });
    toggleVerifyModal(false);
    saveApplication(
      {
        ...itemData,
        bankid: result
      },
      () => {
        if (typeof lastCallback.success === "function") {
          // _getMyApplications();
          lastCallback.success(result);
        }
        setItemData(undefined);
      }
    );
    // if (typeof lastCallback.failed === "function") {
    //   lastCallback.failed(result, () => {
    //     setItemData(undefined);
    //     toggleVerifyModal(false);
    //   });
    // }
  }

  //Side effects
  //componentDidMount
  useEffect(() => {
    toggleLoading(true);
    const { skip, limit } = pagination;
    _getMyApplications(skip, limit, () => {
      toggleLoading(false);
    });
    return () => {
      didCancel = true;
    };
  }, []);

  useEffect(() => {
    const { skip, limit } = pagination;
    toggleLoading(true);
    _getMyApplications(skip, limit, () => {
      toggleLoading(false);
    });
  }, [pagination.activePage]);
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
      // saveApplication({
      //   bankid: result
      // });
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

  function _getMyApplications(_skip, _limit, callback) {
    getMyApplications()
      .onOk(result => {
        if (!didCancel) {
          if (result.total)
            setPagination({
              ...pagination,
              totalRecords: result.total
            });
          setData(result);
          if (typeof callback === "function") {
            callback(result);
          }
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
        }
      })
      .notFound(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
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
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call(
        userInfo &&
          (currentRole === "agent"
            ? { currentRole: "agent", id: userInfo.broker_id }
            : { currentRole: "customer", id: userInfo.personalNumber }),
        _skip,
        _limit
      );
  }
  function handleSuccessCancel() {
    const { skip, limit } = pagination;
    toggleLoading(true);
    _getMyApplications(skip, limit, () => {
      toggleLoading(false);
    });
  }

  //Submit application function
  function handleSubmitApplication(apiData, appData, callback) {
    const { skip, limit } = pagination;
    // for (const key in obj) {
    //   if (itemData[key] === null) {
    //     itemData[key] = "";
    //   }
    // }
    // for (const key in itemData.real_estate) {
    //   if (itemData.real_estate[key] === null) {
    //     itemData.real_estate[key] = "";
    //   }
    // }
    // for (const key in itemData.acquisition) {
    //   if (itemData.acquisition[key] === null) {
    //     itemData.acquisition[key] = "";
    //   }
    // }
    // const _obj = {
    //   ...obj,
    //   // lastName: itemData.contactInfo.lastName,
    //   amourtizationPeriod: itemData.amortizationPeriod,
    //   // personalNumber: itemData.contactInfo.personalNumber,
    //   need: itemData.need.map(item => item.apiName)
    // };
    // // if (obj.bankid) {
    // //   _obj["personalNumber"] = obj.userInfo.personalNumber;
    // //   _obj["lastName"] = obj.userInfo.surname;
    // // } else if (obj.contactInfo) {
    // //   _obj["personalNumber"] = obj.contactInfo.personalNumber;
    // //   _obj["lastName"] = obj.contactInfo.lastName;
    // // }
    // if (userInfo.broker_id) {
    //   _obj.broker_id = userInfo.broker_id;
    // }
    // if (itemData.need[0] !== "purchase_of_business") {
    //   _obj.orgName = itemData.Name;
    // }
    const _obj = {
      ...apiData
    };
    submitLoan()
      .onOk(result => {
        if (!didCancel) {
          if (result.errors && result.errors.length > 0) {
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
            if (
              !result.success &&
              appData.RecordType === "Business Acquisition Loan"
            ) {
              setEditModal({
                visibility: true,
                action: "submit",
                data: appData
              });
            }
          } else {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: "Skicka har varit framgångsrikt"
              }
            });
            _getMyApplications(skip, limit, () => {
              if (typeof callback === "function") {
                callback(result);
              }
            });
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
          if (appData.RecordType === "Business Acquisition Loan") {
            setEditModal({
              visibility: true,
              action: "submit",
              data: appData
            });
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
      .onInvalidRequest(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          if (appData.RecordType === "Business Acquisition Loan") {
            setEditModal({
              visibility: true,
              action: "submit",
              data: appData
            });
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
      .unAuthorized(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          if (appData.RecordType === "Business Acquisition Loan") {
            setEditModal({
              visibility: true,
              action: "submit",
              data: appData
            });
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Ogiltlig"
            }
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          if (appData.RecordType === "Business Acquisition Loan") {
            setEditModal({
              visibility: true,
              action: "submit",
              data: appData
            });
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
      .call(_obj, true);
  }
  // function editApplication(data, _callback) {
  //   saveApplication(data, res => {

  //   });
  // }
  function saveApplication(data, _callback) {
    //replace null values with "" ,because of Api bug
    //Api returns null but doesn't accept null when POST or PUT going to update or submit data
    for (const key in data) {
      if (data[key] === null) {
        data[key] = "";
      }
    }
    for (const key in data.real_estate) {
      if (data.real_estate[key] === null) {
        data.real_estate[key] = "";
      }
    }
    for (const key in data.acquisition) {
      if (data.acquisition[key] === null) {
        data.acquisition[key] = "";
      }
    }
    const _obj = {
      ...data,
      amourtizationPeriod: data.amortizationPeriod,
      //personalNumber: data.contactInfo.personalNumber,
      need: data.need.map(item => item.apiName),
      oppId: data.opportunityID
      //lastName: data.contactInfo.lastName
    };
    if (data.bankid) {
      _obj["personalNumber"] = data.bankid.userInfo.personalNumber;
      _obj["lastName"] = data.bankid.userInfo.surname;
    } else if (data.contactInfo) {
      _obj["personalNumber"] = data.contactInfo.personalNumber;
      _obj["lastName"] = data.contactInfo.lastName;
    }
    if (userInfo.broker_id) {
      _obj.broker_id = userInfo.broker_id;
    }
    if (data.need[0] !== "purchase_of_business") {
      _obj.orgName = data.Name;
    }
    saveLoan(currentRole)
      .onOk(result => {
        if (!didCancel) {
          if (!result.success || (result.errors && result.errors.length > 0)) {
            // if (window.analytics)
            //   window.analytics.track("Failure", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: 0
            //   });
            // setError({
            //   sender: "submitLoan"
            // });
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Kan inte spara data, var god försök igen"
              }
            });
            if (typeof _callback === "function") {
              _callback(result);
            }
          } else {
            if (typeof _callback === "function") {
              _callback(result);
            }
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: "Ansökan har sparats"
              }
            });
            // dispatch({
            //   type: "ADD_NOTIFY",
            //   value: {
            //     type: "success",
            //     message: "klart" //T
            //   }
            // });
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
          if (typeof _callback === "function") {
            _callback(result);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Kan inte spara data, var god försök igen"
            }
          });
        }
      })
      .call(_obj, true);
  }
  function toggleEditModal(data, action) {
    //If modal is open then it's time to make itemData state empty
    if (editModal.visibility) {
      setEditModal({
        visibility: false,
        data: data,
        action: undefined,
        loading: false
      });
    } else {
      setEditModal({
        visibility: true,
        data: data,
        action: action,
        loading: false
      });
    }
  }
  function toggleViewModal(data, type) {
    if (viewModal.visibility) {
      setViewModal({ visibility: false, data: undefined, type: undefined });
    } else {
      setViewModal({ visibility: true, data: data, type: type });
    }
  }
  function triggerPagination(num, e) {
    setPagination({
      ...pagination,
      activePage: num,
      skip: (num - 1) * pagination.limit
    });
  }
  // function Pagination(props) {
  //   const { totalPages, onChange, activePage } = props;
  //   if (totalPages > 1) {
  //     let paginationItems = [];
  //     for (let num = 1; num <= totalPages; num++) {
  //       paginationItems.push(
  //         <a
  //           key={num}
  //           className={activePage === num ? "active" : ""}
  //           onClick={e => onChange(num, e)}
  //         >
  //           {num}
  //         </a>
  //       );
  //     }
  //     return <div className="pagination">{paginationItems}</div>;
  //   }
  // }
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
          {data.oppList.map(app => (
            <Item
              key={app.opportunityID}
              item={app}
              onCancelSuccess={handleSuccessCancel}
              verify={handleVerifyApplication}
              submit={handleSubmitApplication}
              edit={toggleEditModal}
              view={toggleViewModal}
            />
          ))}
          {/* pagination */}
          <Pagination
            pageRangeDisplayed={8}
            onChange={triggerPagination}
            itemsCountPerPage={parseInt(pagination.limit)}
            totalItemsCount={pagination.totalRecords}
            activePage={pagination.activePage}
          />

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
      {editModal.visibility && (
        <Modal
          className="minasidor-modals"
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
            action={editModal.action}
            data={editModal.data}
            loading={editModal.loading}
            onEdit={item => {
              setEditModal({
                ...editModal,
                loading: true
              });
              saveApplication(item, res => {
                const { skip, limit } = pagination;
                if (res && res.success) {
                  _getMyApplications(skip, limit, () => {
                    setEditModal({
                      visibility: false,
                      data: data,
                      action: undefined,
                      loading: false
                    });
                  });
                } else {
                  setEditModal({
                    ...editModal,
                    loading: false
                  });
                }
              });
            }}
          />
        </Modal>
      )}
      {viewModal.visibility && (
        <Modal
          className="minasidor-modals"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "0"
          }}
        >
          {viewModal.type === "RE" && (
            <RealEstateView close={toggleViewModal} data={viewModal.data} />
          )}
          {viewModal.type === "BA" && (
            <BusinessAcquisitionView
              close={toggleViewModal}
              data={viewModal.data}
            />
          )}
        </Modal>
      )}
    </div>
  );
};

export default MyApplications;
