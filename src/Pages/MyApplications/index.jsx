import React, { useEffect, useState } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import Item from "./item";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getMyApplications } from "api/main-api";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import { startBankId, cancelVerify } from "api/business-loan-api";
//
const MyApplications = props => {
  let didCancel = false;
  const [{ userInfo, currentRole }] = useGlobalState();
  const { t } = useLocale();
  const [selectedApp, setApp] = useState();
  const [loading, toggleLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const [verifyModal, toggleVerifyModal] = useState(false);
  const [startResult, setStartResult] = useState(undefined);
  const [personalNumber, setPersonalNumber] = useState("");
  const [lastCallback, setLastCallback] = useState(() => {
    return;
  });
  //componentDidMount
  useEffect(() => {
    _getMyApplications();
    return () => {
      didCancel = true;
    };
  }, []);

  //pNum: personalNumber
  //BankId function
  function handleVerifyApplication(pNum, callback) {
    toggleVerifyModal(true);
    handleBankIdClicked(pNum, callback);
  }
  function handleSuccessBankId(result) {
    if (result.progressStatus === "COMPLETE") {
      if (lastCallback === "function") {
        lastCallback(result);
        toggleVerifyModal(false);
        setStartResult(undefined);
      }
      // setLastCallback(() => {
      //   return;
      // });
    }
  }
  //After bankId
  function handleBankIdClicked(pNum, callback) {
    startBankId()
      .onOk(result => {
        if (!didCancel) {
          setStartResult(result);
          if (typeof callback === "function") {
            setLastCallback(callback);
          }
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
      // .onServerError(result => {
      //   if (!didCancel) {
      //     setError({
      //       sender: "verifyBankId"
      //     });
      //   }
      // })
      // .onBadRequest(result => {
      //   if (!didCancel) {
      //     toggleVerifyingSpinner(false);
      //     changeTab(3);
      //     setError({
      //       sender: "verifyBankId"
      //     });
      //   }
      // })
      // .unAuthorized(result => {
      //   if (!didCancel) {
      //     toggleVerifyingSpinner(false);
      //     changeTab(3);
      //     setError({
      //       sender: "verifyBankId"
      //     });
      //   }
      // })
      // .unKnownError(result => {
      //   if (!didCancel) {
      //     toggleVerifyingSpinner(false);
      //     changeTab(3);
      //     setError({
      //       sender: "verifyBankId"
      //     });
      //   }
      // })
      .call(pNum);
  }
  function handleCancelVerify() {
    // toggleVerifyModal(false);
    // if (window.analytics)
    // window.analytics.track("BankID Failed", {
    //   category: "Loan Application",
    //   label: "/app/loan/ bankid popup",
    //   value: 0
    // });
    cancelVerify()
      .onOk(result => {
        console.info("handleCancelVerify", result);
      })
      .onServerError(result => {
        if (!didCancel) {
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
        }
      })
      .call(startResult.orderRef);
  }
  function handleCloseVerifyModal(isSuccess, result, bIdResult) {
    toggleVerifyModal(false);
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
      console.error("handleCloseVerifyModal", result);
    } else {
      // changeTab(3);
      setError({
        sender: "submitLoan"
      });
    }
  }
  //Submit application function
  function handleSubmitApplication() {}

  function _getMyApplications() {
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
            />
          ))}
          {verifyModal && (
            <VerifyBankIdModal
              startResult={startResult}
              personalNumber={personalNumber}
              onClose={handleCloseVerifyModal}
              onVerified={handleSuccessBankId}
              onCancelVerify={handleCancelVerify}
              config={{
                companyList: false,
                isLogin: true
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default MyApplications;
