import React from "react";
import Header from "components/Header";
import Loading from "./components/Loading";
import ErrorBox from "components/ErrorBox";
import BankIDMenu from "./components/BankIDMenu";
import SuccessFullBankId from "./components/SuccessFullBankId";
import UnSuccessFullBankId from "./components/UnSuccessFullBankId";
import SubmitLoading from "./components/SubmitLoading";
import styles from "./styles.module.scss";
import {
  checkCriteria,
  submitLoanNew,
  cancelVerify,
} from "api/business-loan-api";
import { getParameterByName, isNumber } from "utils";
import useLocale from "hooks/useLocale";
import useGlobalState from "hooks/useGlobalState";
import track from "utils/trackAnalytic";

const BankIdVerification = ({ match, headerBottom }) => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const [bankIdStatus, setBankIdStatus] = React.useState("verify");
  const [loading, toggleMainSpinner] = React.useState(true);
  const [isSubmitting, toggleIsSubmitting] = React.useState(false);
  const [isError, setError] = React.useState(match.params.oppId ? false : true);
  function init() {
    if (match.params.oppId)
      checkCriteria()
        .onOk((result) => {
          toggleMainSpinner(false);
        })
        .onServerError((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
          toggleMainSpinner(false);
          setError({
            type: "common",
          });
        })
        .onBadRequest((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
          toggleMainSpinner(false);
          setError({
            type: "common",
          });
        })
        .unAuthorized((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
          toggleMainSpinner(false);
          setError({
            type: "common",
          });
        })
        .unKnownError((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
          toggleMainSpinner(false);
          setError({
            type: "common",
          });
        })
        .forbiddenError((result) => {
          toggleMainSpinner(false);
          setError({
            type: "forbidden",
          });
        })
        .onRequestError((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
          toggleMainSpinner(false);
          setError({
            type: "common",
          });
        })
        .call(match.params.oppId);
  }
  React.useEffect(init, []);

  function handleSuccessBankId(result) {
    toggleIsSubmitting(true);
    const pCode = getParameterByName("pcode");
    let obj = {
      oppId: match.params.oppId,
      bankid: result,
    };
    if (pCode && pCode.length > 0 && isNumber(pCode)) obj["pcode"] = pCode;
    submitLoanNew()
      .onOk((submitResult) => {
        track(
          "Finished with BankID",
          "Loan Application v2",
          "/app/loan/ wizard",
          0
        );
        toggleIsSubmitting(false);
        setBankIdStatus("success");
        sessionStorage.setItem(
          "@ponture-customer-bankid",
          JSON.stringify(result)
        );
        dispatch({
          type: "VERIFY_BANK_ID_SUCCESS",
          payload: result,
        });
      })
      .onServerError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        setError({
          type: "common",
        });
      })
      .forbiddenError((result) => {
        setError({
          type: "forbidden",
        });
      })
      .onBadRequest((result) => {})
      .notFound((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        setError({
          type: "common",
        });
      })
      .unKnownError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        setError({
          type: "common",
        });
      })
      .call(obj);
  }
  function handleErrorBankId() {}
  function handleCanceledBankId(startResult) {
    setBankIdStatus("unSuccess");
    if (startResult)
      cancelVerify()
        .unKnownError((result) => {
          track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        })
        .call(startResult.orderRef);
  }
  return (
    <div className={styles.container}>
      <Header headerBottom={headerBottom} />
      <div className={styles.mainContent}>
        {loading ? (
          <Loading />
        ) : isError ? (
          <ErrorBox
            title={
              isError && isError.type === "forbidden"
                ? t("FORBIDDEN_VERIFY_WARNING")
                : null
            }
          />
        ) : bankIdStatus === "verify" ? (
          <BankIDMenu
            oppId={match.params.oppId}
            onSuccessBankId={handleSuccessBankId}
            onCanceledBankId={handleCanceledBankId}
            onErrorBankId={handleErrorBankId}
          />
        ) : bankIdStatus === "success" ? (
          <SuccessFullBankId />
        ) : bankIdStatus === "unSuccess" ? (
          <UnSuccessFullBankId />
        ) : null}
        {isSubmitting && <SubmitLoading />}
      </div>
    </div>
  );
};
export default BankIdVerification;
