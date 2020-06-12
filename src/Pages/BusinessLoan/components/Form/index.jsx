import React from "react";
import styles from "./styles.module.scss";
import { useForm, FormContext } from "react-hook-form";
import { getParameterByName } from "utils";
import LoanAmount from "./formComponents/LoanAmount";
import FurtherBox from "./formComponents/GoFurtherBox";
import NeedsBox from "./formComponents/NeedsBox";
import PersonalNumberBox from "./formComponents/PersonalNumberBox";
import CompaniesBox from "./formComponents/CompaniesBox";
import SubmitBox from "./formComponents/SubmitBox";
import Footer from "./formComponents/Footer";
import { useLoanState } from "hooks/useLoan";
const title = getParameterByName("ptitle");
//
const LoanForm = () => {
  const { steps, isUrlNeeds } = useLoanState();
  const methods = useForm({
    mode: "onChange",
  });
  const { register } = methods;
  function init() {
    register({ name: "company" }, { required: true });
  }
  React.useEffect(init, []);

  return (
    <FormContext {...methods}>
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <h2>{title && title.length > 0 ? title : "Ansök om företagslån"}</h2>
        <LoanAmount />
        {isUrlNeeds && !steps["loanAmountBox"].isFinished && <FurtherBox />}

        {!isUrlNeeds &&
          steps["loanAmountBox"].isFinished &&
          steps["needsBox"].isTouched && <NeedsBox />}

        {((isUrlNeeds && steps["loanAmountBox"].isFinished) ||
          (!isUrlNeeds &&
            steps["loanAmountBox"].isFinished &&
            steps["needsBox"].isFinished)) &&
          steps["personalNumberBox"].isTouched && <PersonalNumberBox />}

        {((isUrlNeeds &&
          steps["loanAmountBox"].isFinished &&
          steps["personalNumberBox"].isFinished) ||
          (!isUrlNeeds &&
            steps["loanAmountBox"].isFinished &&
            steps["needsBox"].isFinished &&
            steps["personalNumberBox"].isFinished)) &&
          steps["companiesBox"].isTouched && <CompaniesBox />}

        {((isUrlNeeds &&
          steps["loanAmountBox"].isFinished &&
          steps["personalNumberBox"].isFinished &&
          steps["companiesBox"].isFinished) ||
          (!isUrlNeeds &&
            steps["loanAmountBox"].isFinished &&
            steps["needsBox"].isFinished &&
            steps["personalNumberBox"].isFinished &&
            steps["companiesBox"].isFinished)) &&
          steps["submitBox"].isTouched && <SubmitBox />}
      </form>
      <Footer />
    </FormContext>
  );
};

export default LoanForm;
