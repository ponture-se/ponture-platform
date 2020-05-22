import React from "react";
import Header from "./components/Header";
import BankIDMenu from "./components/BankIDMenu";
import SuccessFullBankId from "./components/SuccessFullBankId";
import UnSuccessFullBankId from "./components/UnSuccessFullBankId";
import styles from "./styles.module.scss";

const BankIdVerification = () => {
  const [bankIdStatus, setBankIdStatus] = React.useState("success");
  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.mainContent}>
        {bankIdStatus === "verify" ? (
          <BankIDMenu />
        ) : bankIdStatus === "success" ? (
          <SuccessFullBankId />
        ) : bankIdStatus === "unSuccess" ? (
          <UnSuccessFullBankId />
        ) : null}
      </div>
    </div>
  );
};
export default BankIdVerification;
