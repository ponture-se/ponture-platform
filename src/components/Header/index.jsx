import React from "react";
import loadScript from "utils/loadScript";
import { useLoanState } from "hooks/useLoan";
import useLocale from "hooks/useLocale";
import styles from "./styles.module.scss";
import HeaderStep from "./HeaderStep";
import track from "utils/trackAnalytic";

const Header = ({ headerBottom }) => {
  const [isOpenMenu, toggleMenu] = React.useState(false);
  const { loanFormStatus, isUrlNeeds, steps, currentStep } =
    useLoanState() || {};
  const { t } = useLocale();
  function getStepValue() {
    const index = steps[currentStep].index;
    return isUrlNeeds && index > 2 ? index - 1 : index;
  }
  function openChat() {
    if (window.tidioChatApi || document.tidioChatApi) {
      window.tidioChatApi.display(true);
      track("Chat clicked", "Loan Application v2", "/app/loan wizard", 0);
    } else {
      if (process.env.REACT_APP_ENABLE_LIVE_VIEW === "true") {
        loadScript(
          "//code.tidio.co/txtwqfpyw2wwumoqftw0v2ejphnagywz.js",
          () => {
            if (window.tidioChatApi) window.tidioChatApi.display(true);
            track("Chat clicked", "Loan Application v2", "/app/loan wizard", 0);
          }
        );
      }
    }
  }
  function handleLogoClicked() {
    track("Logo clicked", "Loan Application v2", "/app/loan wizard", 0);
  }
  function handlePhoneNumberClicked() {
    track("Phone clicked", "Loan Application v2", "/app/loan wizard", 0);
  }
  function handleEmailClicked() {
    track("Email clicked", "Loan Application v2", "/app/loan wizard", 0);
  }
  return (
    <div className={styles.header}>
      <div className={styles.header__content}>
        <div className={styles.header__top}>
          <div className={styles.logo}>
            <a
              href="https://www.ponture.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleLogoClicked}
            >
              <img
                src="https://www.ponture.com/wp-content/uploads/2019/04/logo-color-no-bg-500png.png"
                alt="logo"
              />
            </a>
            <div className={styles.financeLogo}>
              <span>{t("LOGO_TEXT")}</span>
              <img
                src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
                alt=""
              />
            </div>
          </div>
          <div className={styles.info}>
            <span
              className={styles.info__item}
              onClick={openChat}
              style={{ cursor: "pointer" }}
            >
              <img src={require("assets/icons/chat.png")} alt="" />
              <span>Chat</span>
            </span>
            <span
              className={styles.info__item}
              onClick={handlePhoneNumberClicked}
            >
              <img src={require("assets/icons/phone.png")} alt="" />
              <a href="tel:0101292920">010 129 29 20</a>
            </span>
            <span className={styles.info__item} onClick={handleEmailClicked}>
              <a href="mailto:contact@ponture.cm">contact@ponture.com</a>
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
              <span
                className={styles.item}
                onClick={openChat}
                style={{ cursor: "pointer" }}
              >
                <img src={require("assets/icons/chat.png")} alt="" />
                <span>Chat</span>
              </span>
              <span className={styles.item} onClick={handlePhoneNumberClicked}>
                <img src={require("assets/icons/phone.png")} alt="" />
                <a href="tel:0101292920">010 129 29 20</a>
              </span>
              <span className={styles.item} onClick={handleEmailClicked}>
                <span>
                  <a href="mailto:contact@openratio.cm">contact@ponture.com</a>
                </span>
              </span>
              <div className={styles.financeLogo}>
                <img
                  src="https://www.ponture.com/wp-content/uploads/2019/04/financial_supervisory_authority.png"
                  alt=""
                />
                <span>{t("LOGO_TEXT")}</span>
              </div>
              <img
                className={styles.rating}
                src="https://www.ponture.com/wp-content/uploads/2020/05/google-rating-without-text-1.png"
                alt=""
              />
            </div>
          )}
        </div>
        {headerBottom && loanFormStatus === "form" && (
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
                {t("STEP")} {getStepValue()} av {isUrlNeeds ? 4 : 5}
              </h5>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
