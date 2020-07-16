import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { useLoanState } from "hooks/useLoan";
import useLocale from "hooks/useLocale";
import styles from "../styles.module.scss";
import "./styles.scss";
import Button from "./common/Button";

const LoanCategoriesModal = ({ onClose }) => {
  const { t } = useLocale();
  const { needs } = useLoanState();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "auto");
  }, []);

  function close(item) {
    if (onClose) onClose(item);
  }

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="acceptModal">
        <div className="acceptModal__bg" onClick={() => close()} />
        <div className="acceptModal__content animated fadeInUp faster">
          <div className="acceptModal__header">
            <span className="title">
              {t("LOAN_AMOUNT_MODAL_CATEGORIES_TITLE")}
            </span>
            <div className="icon-cross closeIcon" onClick={() => close()} />
          </div>
          <div className="acceptModal__body">
            {needs &&
              Object.keys(needs).map((item, index) => {
                return (
                  <Button
                    key={index}
                    customClass={styles.actions__customBtn}
                    showSelectedCheckMark={false}
                    onClick={() => onClose(item)}
                  >
                    {item}
                  </Button>
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
};

export default LoanCategoriesModal;
