import React from "react";
import useLocale from "hooks/useLocale";
import { IoMdPhonePortrait } from "react-icons/io";
import isMobileDevice from "utils/isMobileDevice";
import Signs from "./Signs";
import VerifyBankIdModalNew from "components/VerifyBankIdModalNew";
import styles from "../styles.module.scss";
import track from "utils/trackAnalytic";

const BankIdMenu = ({
  oppId,
  onSuccessBankId,
  onCanceledBankId,
  onErrorBankId,
}) => {
  const { t } = useLocale();
  const isMobile = isMobileDevice();
  const [bankIdDevice, setBankIdDevice] = React.useState();
  const [verifyModal, toggleVerifyModal] = React.useState();
  function handleCloseBankId(status, result) {
    toggleVerifyModal(false);
    if (status && status !== "close") {
      if (status === "success") {
        track(
          "BankID Verified",
          "Loan Application v2",
          "/app/loan/verifybankid bankid popup",
          0
        );
        onSuccessBankId(result);
      } else if (status === "canceled") {
        track(
          "BankID failed",
          "Loan Application v2",
          "/app/loan/verifybankid bankid popup",
          0
        );
        onCanceledBankId(result);
      } else {
        // onErrorBankId();
      }
    }
  }
  function openBankIdModal(btn) {
    track(
      "BankID Verification",
      "Loan Application v2",
      "/app/loan/verifybankid bankid popup",
      0
    );
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
        <h2>{t("VERIFY_MENU_TITLE")}</h2>
        <div
          className={styles.bankIdOption}
          onClick={() => openBankIdModal("first")}
        >
          <h4>
            {!isMobile
              ? t("VERIFY_MENU_OPTION_1_BROWSER_TITLE")
              : t("VERIFY_MENU_OPTION_1_MOBILE_TITLE")}
          </h4>
          <IoMdPhonePortrait className={styles.mobileIcon} />
          <img src={require("assets/bankidLogo.png")} alt="" />
        </div>
        <div
          className={styles.bankIdOption}
          onClick={() => openBankIdModal("second")}
        >
          <h4>
            {!isMobile
              ? t("VERIFY_MENU_OPTION_2_BROWSER_TITLE")
              : t("VERIFY_MENU_OPTION_2_MOBILE_TITLE")}
          </h4>
          <img src={require("assets/bankidLogo.png")} alt="" />
        </div>
        <div className={styles.info}>
          <div className={styles.info__icon}>
            <i className="icon-shield" />
          </div>
          <span className={styles.info__text}>
            {t("VERIFY_MENU_DESCRIPTION")}
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
