import React from "react";
import "./styles.scss";
const RowSkeleton = props => {
  return (
    <>
      <div className="rowSkeleton">
        <div className="post">
          <div className="avatar" />
          <div className="lines">
            <div className="line" />
            <div className="line" />
          </div>
        </div>
      </div>
      <div className="rowSkeleton">
        <div className="post">
          <div className="avatar" />
          <div className="lines">
            <div className="line" />
            <div className="line" />
          </div>
        </div>
      </div>
    </>
  );
};

export default RowSkeleton;
