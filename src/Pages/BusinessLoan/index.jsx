import React from "react";
import styles from "./styles.module.scss";
import Header from "./components/Header";
import Content from "./components/Content";
import ErrorBox from "./components/ErrorBox";
import { LoanProvider } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";
import useLocale from "hooks/useLocale";
const ApplyLoan = (props) => {
  const { t } = useLocale();
  const { getNeeds } = useLoanApi();
  const [loading, toggleLoading] = React.useState(true);
  const [error, toggleErrorBox] = React.useState(false);
  const init = () => {
    getNeeds(
      (needs) => {
        toggleLoading(false);
      },
      () => {
        toggleLoading(false);
        toggleErrorBox(true);
      }
    );
  };
  React.useEffect(init, []);
  return loading ? (
    <div className="loaderBox">
      <div className="loader" />
      {t("MAIN_SPINNER_LOADING_TEXT")}
    </div>
  ) : (
    <div className={styles.wrapper}>
      <Header />
      {!error ? <Content /> : <ErrorBox />}
    </div>
  );
};

export default ApplyLoan;
