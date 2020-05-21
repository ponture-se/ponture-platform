import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Title from "./common/Title";
import { useLoanDispatch } from "hooks/useLoan";

const PersonalNumberBox = () => {
  const dispatch = useLoanDispatch();
  const pNumberBoxRef = React.useRef(null);
  React.useEffect(() => {
    if (pNumberBoxRef.current) {
      window.scrollTo(0, pNumberBoxRef.current.offsetTop);
    }
  }, []);
  function searchCompanies() {
    dispatch({
      type: "SET_FINISHED_STEP",
      payload: 3,
    });
  }
  return (
    <div ref={pNumberBoxRef} className={styles.companiesBox}>
      <div className={styles.companiesBox__info}>
        <Title
          text="Ange ditt personnummer och klicka på “Sök” för att hitta ditt företag"
          showTooltip={false}
        />
      </div>
      <div className={styles.companiesBox__input}>
        <Input
          title="Ange personnummer"
          placeholder="19830611-1222"
          extraClassStyle={styles.companiesBox__input__personalNumber}
          errorText=""
          tooltip="no tooltip"
          id="cc"
        />
        <Button
          customClass={styles.companiesBox__input__customBtn}
          selected={true}
          showSelectedCheckMark={false}
          onClick={searchCompanies}
        >
          Sök efter mitt företag
        </Button>
      </div>
      <div className={styles.companiesBox__guid}>
        <span className={styles.companiesBox__guid_title}>
          Det personnummer som kan accepteras är:
        </span>
        <ul>
          <li>- Ägare av företaget </li>
          <li>- Styrelsemedlemmar i företaget</li>
          <li>- Suppleant</li>
          <li>- En firmatecknare av företag</li>
        </ul>
      </div>
    </div>
  );
};

export default PersonalNumberBox;
