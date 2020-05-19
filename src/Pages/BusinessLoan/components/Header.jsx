import React from "react";
import styles from "../styles.module.scss";
import HeaderStep from "./HeaderStep";
const Header = () => {
  const [steps, setSteps] = React.useState([
    { id: 1, isFinished: false, isCurrent: true },
    { id: 2, isFinished: false, isCurrent: false },
    { id: 3, isFinished: false, isCurrent: false },
    { id: 4, isFinished: false, isCurrent: false },
    { id: 5, isFinished: false, isCurrent: false },
  ]);
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__top}>
          <div className={styles.logo}>
            <img src={require("../../../assets/logo-c.png")} alt="logo" />
          </div>
          <div className={styles.info}>
            <span className={styles.info__item}>
              <i className="icon-envelope" />
              <span>Chat</span>
            </span>
            <span className={styles.info__item}>
              <i className="icon-envelope" />
              <span>010 129 29 20</span>
            </span>
            <span className={styles.info__item}>
              <span>Contact@openratio.cm</span>
            </span>
          </div>
        </div>
        <div className={styles.header__bottom}>
          <div className={styles.header__bottomContent}>
            <div className={styles.stepWrapper}>
              {steps.map((item) => (
                <HeaderStep key={item.id} step={item} />
              ))}
            </div>
            <h5 className={styles.stepText}>Steg 1 av 5</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
