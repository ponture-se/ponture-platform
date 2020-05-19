import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";

const NeedsBox = () => {
  return (
    <div className={styles.needsBox}>
      <div className={styles.needsBox__info}>
        <Title text="Anledning till lån" tooltip="no tooltip" id="bb" />
      </div>
      <h5 className={styles.needsBox__desc}>
        Om du har mer än en anledning till företagslån får du välja flera
        alternativ
      </h5>
      <div className={styles.needsBox__list}>
        {[1, 2, 3, 4, 5, 6, 7, 1, 1, 1, 1, 1].map((item, index) => (
          <Button
            key={index}
            customClass={styles.needsBox__customBtn}
            selected={item === 3 || item === 3 ? true : false}
          >
            Generelll likviditet
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NeedsBox;
