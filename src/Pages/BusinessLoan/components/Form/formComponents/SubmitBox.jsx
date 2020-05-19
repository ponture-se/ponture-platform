import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import Checkbox from "./common/Checkbox";

const SubmitBox = () => {
  const submitBoxRef = React.useRef(null);
  React.useEffect(() => {
    if (submitBoxRef.current) {
      window.scrollTo(0, submitBoxRef.current.offsetTop);
    }
  }, []);
  return (
    <div ref={submitBoxRef} className={styles.submitBox}>
      <div className={styles.submitBox__inputs}>
        <Input
          title="Företagetsomsättning under de senaste 12 månader"
          placeholder="t.ex.  1 200 000 kr"
          extraClassStyle={styles.submitBox__inputs__turnOver}
          tooltip="no tooltip"
          id="ff"
        />
        <div className={styles.submitBox__twoColumns}>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt telefonnummer"
              placeholder="t.ex.  070 980 20 91"
              extraClassStyle={styles.submitBox__inputs__phone}
              errorText="It is required"
            />
          </div>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt e-post"
              placeholder="t.ex fredrik@comany.com"
              extraClassStyle={styles.submitBox__inputs__email}
            />
          </div>
        </div>
      </div>
      <div className={styles.submitBox__terms}>
        <Checkbox title="Härmed godkänner jag" id="termChk" />
        <a
          href="https://www.ponture.com/eula"
          target="_blank"
          rel="noopener noreferrer"
        >
          användarvillkoren.
        </a>
      </div>
      <div className={styles.submitBox__actions}>
        <Button customClass={styles.submitBox__customBtn} warning>
          Skicka
        </Button>
        <div className={styles.submitBox__actions__link}>
          <a
            href="https://www.ponture.com/eula"
            target="_blank"
            rel="noopener noreferrer"
          >
            Börja om
          </a>
          <a
            href="https://www.ponture.com/eula"
            target="_blank"
            rel="noopener noreferrer"
          >
            (Om du klicka här kommer förmuläret att nollställas)
          </a>
        </div>
      </div>
      <div className={styles.submitBox__info}>
        {[
          "Ansökan är kostnadsfritt",
          "Vi tar bara en UC kreditupplysning på ditt företag",
          "Du binder dig inte till något",
          "Våra finanskonsulter finns för att hjälpa dig inom hela processen",
        ].map((item, index) => (
          <div className={styles.rowInfo} key={index}>
            <div className={styles.rowInfo__chk} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitBox;
