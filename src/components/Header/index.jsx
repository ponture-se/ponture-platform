import React from "react";
import { useLoanState } from "hooks/useLoan";
import styles from "./styles.module.scss";
import HeaderStep from "./HeaderStep";
const Header = ({ headerBottom }) => {
  const [isOpenMenu, toggleMenu] = React.useState(false);
  const { formStatus, isUrlNeeds, steps, currentStep } = useLoanState();
  function getStepValue() {
    const index = steps[currentStep].index;
    return isUrlNeeds && index > 2 ? index - 1 : index;
  }
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__top}>
          <div className={styles.logo}>
            <img
              src="https://www.ponture.com/wp-content/uploads/2019/04/logo-color-no-bg-500png.png"
              alt="logo"
            />
            <div className={styles.financeLogo}>
              <span>Ponture AB är registrerade hos Finansinspektionen</span>
              <img
                src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
                alt=""
              />
            </div>
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
            <img
              src="https://www.ponture.com/wp-content/uploads/2020/05/google-rating-without-text-1.png"
              alt=""
            />
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
              <div className={styles.financeLogo}>
                <img
                  src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
                  alt=""
                />
                <span>Ponture AB är registrerade hos Finansinspektionen</span>
              </div>
              <img
                className={styles.rating}
                src="https://www.ponture.com/wp-content/uploads/2020/05/google-rating-without-text-1.png"
                alt=""
              />
            </div>
          )}
        </div>
        {headerBottom && formStatus === "form" && (
          <div className={styles.header__bottom}>
            <div className={styles.header__bottomContent}>
              <div className={styles.stepWrapper}>
                <HeaderStep
                  step={steps["loanAmountBox"]}
                  currentStep={currentStep}
                />
                {!isUrlNeeds && (
                  <HeaderStep
                    step={steps["needsBox"]}
                    currentStep={currentStep}
                  />
                )}
                <HeaderStep
                  step={steps["personalNumberBox"]}
                  currentStep={currentStep}
                />
                <HeaderStep
                  step={steps["companiesBox"]}
                  currentStep={currentStep}
                />
                <HeaderStep
                  step={steps["submitBox"]}
                  currentStep={currentStep}
                />
              </div>
              <h5 className={styles.stepText}>
                Steg {getStepValue()} av {isUrlNeeds ? 4 : 5}
              </h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
