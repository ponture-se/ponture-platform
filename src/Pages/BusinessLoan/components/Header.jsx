import React from "react";
import { useLoanState } from "hooks/useLoan";
import styles from "../styles.module.scss";
import HeaderStep from "./HeaderStep";
const Header = () => {
  const [isOpenMenu, toggleMenu] = React.useState(false);
  const { steps, formStatus } = useLoanState();
  function getStepValue() {
    return steps.find((item) => item.isCurrent).id;
  }
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
          <div
            className={styles.menu}
            onClick={() => toggleMenu((prev) => !prev)}
          >
            <i className="icon-bars" />
          </div>
          {isOpenMenu && (
            <div className={styles.info__mobile}>
              <span className={styles.item}>
                <i className="icon-envelope" />
                <span>Chat</span>
              </span>
              <span className={styles.item}>
                <i className="icon-envelope" />
                <span>010 129 29 20</span>
              </span>
              <span className={styles.item}>
                <span>Contact@openratio.cm</span>
              </span>
            </div>
          )}
        </div>
        {formStatus === "form" && (
          <div className={styles.header__bottom}>
            <div className={styles.header__bottomContent}>
              <div className={styles.stepWrapper}>
                {steps.map((item) => (
                  <HeaderStep key={item.id} step={item} />
                ))}
              </div>
              <h5 className={styles.stepText}>Steg {getStepValue()} av 5</h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
