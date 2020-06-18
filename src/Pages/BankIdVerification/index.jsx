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
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("INTERNAL_SERVER_ERROR"),
          });
        })
        .onBadRequest((result) => {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("BAD_REQUEST"),
          });
        })
        .unAuthorized((result) => {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UN_AUTHORIZED"),
          });
        })
        .unKnownError((result) => {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("UNKNOWN_ERROR"),
          });
        })
        .forbiddenError((result) => {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t(result.errorCode),
          });
        })
        .onRequestError((result) => {
          toggleMainSpinner(false);
          setError({
            type: "",
            message: t("ON_REQUEST_ERROR"),
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
        setError(true);
        // track("Failure", "Loan Application", "/app/loan/ wizard", 0);
      })
      .onBadRequest((result) => {})
      .notFound((result) => {
        setError(true);
      })
      .unKnownError((result) => {
        setError(true);
      })
      .call(obj);
  }
  function handleErrorBankId() {}
  function handleCanceledBankId(startResult) {
    setBankIdStatus("unSuccess");
    if (startResult) cancelVerify().call(startResult.orderRef);
  }
  return (
    <div className={styles.container}>
      <Header headerBottom={headerBottom} />
      <div className={styles.mainContent}>
        {loading ? (
          <Loading />
        ) : isError ? (
          <ErrorBox />
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
