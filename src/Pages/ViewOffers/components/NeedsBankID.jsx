import React from "react";

const NeedsBankId = ({ opportunity }) => {
  return (
    <div className="needBankIdBox">
      <h3>To be continue you must verify your application</h3>
      <button className="btn btn-success1">
        <a href={`/app/loan/verifybankid/${opportunity.opportunityID}/`}>
          Click to verify
        </a>
      </button>
    </div>
  );
};

export default NeedsBankId;
