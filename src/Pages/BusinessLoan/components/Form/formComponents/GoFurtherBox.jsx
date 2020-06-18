import React from "react";
import useLocale from "hooks/useLocale";
import styles from "./../styles.module.scss";
import { useLoanDispatch } from "hooks/useLoan";
const FurtherMoreBox = () => {
  const { t } = useLocale();
  const dispatch = useLoanDispatch();
  function handleClick() {
    dispatch({
      type: "NEXT_STEP",
      payload: {
        finishedStep: "loanAmountBox",
        nextStep: "personalNumberBox",
      },
    });
  }
  return (
    <div className={styles.furtherMoreBox} onClick={handleClick}>
      <h4>{t("LOAN_AMOUNT_GO_FURTHER")}</h4>
      <span className="icon-down-chevron" />
      <span className="icon-down-chevron" />
    </div>
  );
};
export default FurtherMoreBox;
