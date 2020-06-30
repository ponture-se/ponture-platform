import React from "react";
import Empty from "components/Commons/ErrorsComponent/EmptySVG";
const EmptyCompanies = () => {
  return (
    <div className="emptyCompanies">
      <div className="emptyCompanies__icon">
        <Empty />
      </div>
      <h2 className="title">Title</h2>
      <span className="text1">text1.</span>
      <span className="text2">text2.</span>
      <span className="text3">actions title</span>
      <div className="emptyCompanies__actions">
        <button>företagslån</button>
        <button>fakturaköp</button>
      </div>
      <span className="text4">description</span>
    </div>
  );
};
export default EmptyCompanies;
