import React from "react";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import { useFormContext } from "react-hook-form";
import { IoMdBusiness } from "react-icons/io";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";

const CompaniesBox = () => {
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
        <Title text="Välj ditt företag" tooltip="no tooltip" id="dd" />
        <h5>Vi har hittat följade företag. Välj det....</h5>
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
              <ion-icon name="business-outline"></ion-icon>
              <IoMdBusiness className={styles.companiesBox__customBtn__icon} />
              {item.companyName}
            </Button>
          ))}
      </div>
      {!selectedCompany && (
        <div className={styles.companiesBox__guide1}>
          Välj ditt företag som du söker finansiering till för att gå vidare.
        </div>
      )}
    </div>
  );
};

export default CompaniesBox;
