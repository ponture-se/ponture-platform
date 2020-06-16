import React from "react";
import { IoMdPhonePortrait } from "react-icons/io";
import isMobileDevice from "utils/isMobileDevice";
import Signs from "./Signs";
import VerifyBankIdModalNew from "components/VerifyBankIdModalNew";
import styles from "../styles.module.scss";

const BankIdMenu = ({
  oppId,
  onSuccessBankId,
  onCanceledBankId,
  onErrorBankId,
}) => {
  const isMobile = isMobileDevice();
  const [bankIdDevice, setBankIdDevice] = React.useState();
  const [verifyModal, toggleVerifyModal] = React.useState();
  function handleCloseBankId(status, result) {
    toggleVerifyModal(false);
    if (status && status !== "close") {
      if (status === "success") {
        onSuccessBankId(result);
      } else if (status === "canceled") {
        onCanceledBankId(result);
      } else {
        // onErrorBankId();
      }
    }
  }
  function openBankIdModal(btn) {
    if (btn === "first") {
      if (isMobile) {
        setBankIdDevice("mobile");
      }
    } else {
      if (!isMobile) {
        setBankIdDevice("browser");
      }
    }
    // onSuccessBankId();
    toggleVerifyModal(true);
  }
  return (
    <>
      <div className={styles.bankIdMenu}>
        <h2>Välj inloggningsalternativ</h2>
        <div
          className={styles.bankIdOption}
          onClick={() => openBankIdModal("first")}
        >
          <h4>
            {!isMobile
              ? "Mobilt BankID på annan enhet"
              : "Mobilt BankID på denna enhet"}
          </h4>
          <IoMdPhonePortrait className={styles.mobileIcon} />
          <img src={require("assets/bankidLogo.png")} alt="" />
        </div>
        <div
          className={styles.bankIdOption}
          onClick={() => openBankIdModal("second")}
        >
          <h4>
            {!isMobile ? "BankID på denna enhet" : "BankID på annan enhet"}
          </h4>
          <img src={require("assets/bankidLogo.png")} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.info__icon}>
            <i className="icon-shield" />
          </div>
          <span className={styles.info__text}>
            Vår kundsäkerhet är av yttersta vikt för oss därför kräver vi att
            verfiera våra kunder genom BankID. Detta gör dig möjlighet att få
            snabba erbjudanden från oss.
          </span>
        </div>
        <Signs />
      </div>
      {verifyModal && (
        <VerifyBankIdModalNew
          bankIdDevice={bankIdDevice}
          oppId={oppId}
          onClose={handleCloseBankId}
          onSuccess={() => {
            if (window.analytics)
              window.analytics.track("BankID Verified", {
                category: "Loan Application",
                label: "/app/loan/ bankid popup",
                value: 0,
              });
          }}
          onFailedBankId={() => {
            if (window.analytics)
              window.analytics.track("BankID Failed", {
                category: "Loan Application",
                label: "/app/loan/ bankid popup",
                value: 0,
              });
          }}
        />
      )}
    </>
  );
};
export default BankIdMenu;
