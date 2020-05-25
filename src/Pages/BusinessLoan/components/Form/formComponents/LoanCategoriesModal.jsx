import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "../styles.module.scss";
import "./styles.scss";
import Button from "./common/Button";
import { loanTypes } from "./LoanAmount";
const LoanCategoriesModal = ({ onClose }) => {
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
        <div className="acceptModal__bg" onClick={close} />
        <div className="acceptModal__content animated fadeInUp faster">
          <div className="acceptModal__header">
            <span className="title">Choose a category</span>
            <div className="icon-cross closeIcon" onClick={close} />
          </div>
          <div className="acceptModal__body">
            {loanTypes.map((item, index) => {
              return (
                <Button
                  key={index}
                  customClass={styles.actions__customBtn}
                  showSelectedCheckMark={false}
                  onClick={() => onClose(item)}
                >
                  {item.displayName}
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
