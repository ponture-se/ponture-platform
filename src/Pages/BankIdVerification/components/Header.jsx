import React from "react";
import styles from "../styles.module.scss";
const Header = () => {
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
      </div>
    </div>
  );
};

export default Header;
