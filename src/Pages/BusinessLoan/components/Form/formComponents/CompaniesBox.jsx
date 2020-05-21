import React from "react";
import { useLoanDispatch } from "hooks/useLoan";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";

const CompaniesBox = () => {
  const companiesBoxRef = React.useRef(null);
  const dispatch = useLoanDispatch();
  const [companies, setCompanies] = React.useState([
    { id: 1, name: "a", displayName: "Generelll likviditet" },
    { id: 2, name: "aa", displayName: "Generelll likviditet" },
    { id: 3, name: "aaa", displayName: "Generelll likviditet" },
    { id: 4, name: "aaa", displayName: "Generelll likviditet" },
    { id: 5, name: "aaaa", displayName: "Generelll likviditet" },
  ]);
  const [selectedCompany, setCompany] = React.useState();
  function handleSelectCompany(item) {
    setCompany(item);
    if (!selectedCompany)
      dispatch({
        type: "SET_FINISHED_STEP",
        payload: 4,
      });
  }
  React.useEffect(() => {
    if (companiesBoxRef.current) {
      window.scrollTo(0, companiesBoxRef.current.offsetTop);
    }
  }, []);
  return (
    <div ref={companiesBoxRef} className={styles.companiesBox}>
      <div className={styles.companiesBox__info2}>
        <Title text="Välj ditt företag" tooltip="no tooltip" id="dd" />
        <h5>Vi har hittat följade företag. Välj det....</h5>
      </div>
      <div className={styles.companiesBox__list}>
        {companies.map((item, index) => (
          <Button
            key={index}
            customClass={styles.companiesBox__customBtn}
            selected={selectedCompany && selectedCompany.id === item.id}
            onClick={() => handleSelectCompany(item)}
          >
            <i
              className={
                "icon-item-type " + styles.companiesBox__customBtn__icon
              }
            />
            {item.displayName}
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
