import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Title from "./common/Title";

const CompaniesBox = () => {
  return (
    <div className={styles.companiesBox}>
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
        >
          Sök efter mitt företag
        </Button>
      </div>
      <div className={styles.companiesBox__info2}>
        <Title text="Välj ditt företag" tooltip="no tooltip" id="dd" />
        <h5>Vi har hittat följade företag. Välj det....</h5>
      </div>
      <div className={styles.companiesBox__list}>
        {[1, 2].map((item, index) => (
          <Button
            key={index}
            customClass={styles.companiesBox__customBtn}
            selected={item === 1 ? true : false}
          >
            Generelll likviditet
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CompaniesBox;
