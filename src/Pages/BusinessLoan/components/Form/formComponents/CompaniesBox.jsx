import React from "react";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import { useFormContext } from "react-hook-form";
import { IoMdBusiness } from "react-icons/io";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";
import useLocale from "hooks/useLocale";

const CompaniesBox = () => {
  const { t } = useLocale();
  const companiesBoxRef = React.useRef(null);
  const dispatch = useLoanDispatch();
  const { errors, setValue } = useFormContext();
  const { selectedCompany, companies, currentStep } = useLoanState();

  function handleSelectCompany(item) {
    setValue("company", item);
    dispatch({
      type: "SET_SELECTED_COMPANY",
      payload: item,
    });
    dispatch({
      type: "NEXT_STEP",
      payload: {
        finishedStep: "companiesBox",
        nextStep: "submitBox",
      },
    });
  }
  const init = () => {
    if (companiesBoxRef.current && currentStep === "companiesBox") {
      window.scrollTo(0, companiesBoxRef.current.offsetTop);
    }
    if (selectedCompany) setValue("company", selectedCompany);
  };
  React.useEffect(init, []);
  return (
    <div ref={companiesBoxRef} className={styles.companiesBox}>
      <div className={styles.companiesBox__info2}>
        <Title
          text={t("COMPANIES_LABEL")}
          tooltip={t("COMPANIES_TOOLTIP")}
          id="dd"
        />
        <h5>{t("COMPANIES_DESCRIPTION")}</h5>
      </div>
      <div className={styles.companiesBox__list}>
        {companies &&
          companies.map((item, index) => (
            <Button
              key={item.companyId}
              customClass={styles.companiesBox__customBtn}
              selected={
                selectedCompany && selectedCompany.companyId === item.companyId
              }
              onClick={() => handleSelectCompany(item)}
            >
              <IoMdBusiness className={styles.companiesBox__customBtn__icon} />
              {item.companyName}
            </Button>
          ))}
      </div>
      {!selectedCompany && (
        <div className={styles.companiesBox__guide1}>
          {t("COMPANIES_GUIDE")}
        </div>
      )}
    </div>
  );
};

export default CompaniesBox;
