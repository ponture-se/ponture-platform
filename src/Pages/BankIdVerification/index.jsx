import React from "react";
import Header from "components/Header";
import ErrorBox from "components/ErrorBox";
import BankIDMenu from "./components/BankIDMenu";
import SuccessFullBankId from "./components/SuccessFullBankId";
import UnSuccessFullBankId from "./components/UnSuccessFullBankId";
import SubmitLoading from "./components/SubmitLoading";
import styles from "./styles.module.scss";
import { submitLoanNew } from "api/business-loan-api";

const BankIdVerification = ({ match, headerBottom }) => {
  const [bankIdStatus, setBankIdStatus] = React.useState("verify");
  const [isSubmitting, toggleIsSubmitting] = React.useState(false);
  const [isError, toggleIsError] = React.useState(
    match.params.oppId ? false : true
  );
  function handleSuccessBankId(result) {
    toggleIsSubmitting(true);
    submitLoanNew()
      .onOk((result) => {
        toggleIsSubmitting(false);
        setBankIdStatus("success");
      })
      .onServerError((result) => {
        toggleIsError(true);
        // track("Failure", "Loan Application", "/app/loan/ wizard", 0);
      })
      .onBadRequest((result) => {})
      .notFound((result) => {
        toggleIsError(true);
      })
      .unKnownError((result) => {
        toggleIsError(true);
      })
      .call(match.params.oppId, result);
  }
  function handleErrorBankId() {}
  function handleCanceledBankId() {
    setBankIdStatus("unSuccess");
  }
  return (
    <div className={styles.container}>
      <Header headerBottom={headerBottom} />
      <div className={styles.mainContent}>
        {isError ? (
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
