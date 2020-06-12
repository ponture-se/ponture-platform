import React from "react";
import CircleSpinner from "components/CircleSpinner";
import styles from "../styles.module.scss";

const SuccessFullBankId = () => {
  return (
    <div className={styles.submitSpinner}>
      <span>We are saving your bankid</span>
      <CircleSpinner show={true} size="large" bgColor="white" />
    </div>
  );
};
export default SuccessFullBankId;
