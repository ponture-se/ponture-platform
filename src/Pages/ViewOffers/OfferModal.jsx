import React from "react";
//
import Modal from "components/Modal";
import separateNumberByChar from "utils/separateNumberByChar";
import { useLocale } from "hooks";

const IssueOffer = props => {
  const { t } = useLocale();
  const { offer, app } = props;
  function closeModal() {
    if (props.onClose) props.onClose();
  }
  return (
    <Modal size="lg" onClose={closeModal}>
      <div className="offerDetail">
        <div className="offerDetail__header">
          <div className="left">
            <span className="title">{app.RecordType}</span>
            <span className="offerNumber">{offer.Offer_Number}</span>
          </div>
          <div className="right" onClick={closeModal}>
            <span className="icon-cross closeIcon" />
          </div>
        </div>
        <div className="offerDetail__body">
          <div className="row">
            <span>{t("OFFER_LOAN_AMOUNT")}</span>
            <span>{separateNumberByChar(offer.Amount)} Kr</span>
          </div>
          <div className="row">
            <span>{t("OFFER_LOAN_PERIOD")}</span>
            <span>
              {offer.Repayment_Period} {t("MONTH_S")}
            </span>
          </div>
          <div className="row">
            <span>{t("OFFER_MONTHLY_FEE")}</span>
            <span>
              {offer.detail && separateNumberByChar(offer.detail.Monthly_fee)}{" "}
              Kr
            </span>
          </div>
          <div className="row">
            <span>{t("OFFER_MONTHLY_REPAYMENT")}</span>
            <span>
              {separateNumberByChar(offer.Monthly_Repayment_Amount)} Kr
            </span>
          </div>
          <div className="row">
            <span>{t("OFFER_TOTAL_MONTHLY_PAYMENT")}</span>
            <span>
              {offer.detail &&
                separateNumberByChar(offer.detail.Total_monthly_payment)}{" "}
              Kr
            </span>
          </div>
          <div className="row">
            <span>{t("OFFER_GUARANTEE_NEEDED")}</span>
            <span>{offer.Other_Guarantees_Type}</span>
          </div>
          <div className="extra">
            <span>{"lllllllllllllllllllllll"}</span>
            {/* <span>{offer.Extra_Offer_Description}</span> */}
          </div>
        </div>
      </div>
      <div className="offerDetail__footer">
        <button className="btn --success" onClick={closeModal}>
          {t("CLOSE")}
        </button>
      </div>
    </Modal>
  );
};

export default IssueOffer;
