import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";

const CompaniesBox = () => {
  const companiesBoxRef = React.useRef(null);
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
        {[1, 2].map((item, index) => (
          <Button
            key={index}
            customClass={styles.companiesBox__customBtn}
            selected={item === 1 ? true : false}
          >
            <i className="icon-item-type" />
            Generelll likviditet
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CompaniesBox;
