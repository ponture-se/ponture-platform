import React from "react";
import { useLoanState } from "hooks/useLoan";
import styles from "../styles.module.scss";
import HeaderStep from "./HeaderStep";
const Header = () => {
  const [isOpenMenu, toggleMenu] = React.useState(false);
  const { steps, formStatus } = useLoanState();
  function getStepValue() {
    const isCurrentItem = steps.findIndex((item) => item.isCurrent);
    return isCurrentItem || isCurrentItem === 0
      ? isCurrentItem + 1
      : steps.length;
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
              <img src={require("assets/icons/chat.png")} alt="" />
              <span>Chat</span>
            </span>
            <span className={styles.info__item}>
              <img src={require("assets/icons/phone.png")} alt="" />
              <span>010 129 29 20</span>
            </span>
            <span className={styles.info__item}>
              <span>Contact@openratio.cm</span>
            </span>
          </div>
          <div className={styles.menu}>
            <input
              type="checkbox"
              className={styles.menu__checkbox}
              id="navi-toggle"
              checked={isOpenMenu}
              onChange={(e) => toggleMenu(e.target.checked)}
            />

            <label htmlFor="navi-toggle" className={styles.menu__button}>
              <span className={styles.menu__icon}></span>
            </label>
          </div>
          {isOpenMenu && (
            <div className={styles.info__mobile}>
              <span className={styles.item}>
                <img src={require("assets/icons/chat.png")} alt="" />
                <span>Chat</span>
              </span>
              <span className={styles.item}>
                <img src={require("assets/icons/phone.png")} alt="" />
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
              <h5 className={styles.stepText}>
                Steg {getStepValue()} av {steps.length}
              </h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
