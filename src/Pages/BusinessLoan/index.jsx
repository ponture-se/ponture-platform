import React from "react";
import styles from "./styles.module.scss";
import Header from "components/Header";
import ErrorBox from "components/ErrorBox";
import Content from "./components/Content";
import { useLoanState } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";
import useLocale from "hooks/useLocale";

const ApplyLoan = ({ headerBottom }) => {
  const { errorBox } = useLoanState();
  const { t } = useLocale();
  const { getNeeds } = useLoanApi();
  const [loading, toggleLoading] = React.useState(true);
  const init = () => {
    getNeeds(
      (needs) => toggleLoading(false),
      () => toggleLoading(false)
    );
  };
  React.useEffect(init, []);
  return loading ? (
    <div className="loaderBox">
      <div className="loader" />
      {t("Loading loan wizard form")}
    </div>
  ) : (
    <div className={styles.wrapper}>
      <Header headerBottom={headerBottom} />
      {!errorBox ? <Content /> : <ErrorBox />}
    </div>
  );
};

export default ApplyLoan;
