import React from "react";
import "./styles.scss";
const SquareSpinner = ({ text }) => {
  return (
    <div className="loadingContainer">
      <div className="loading">
        <div className="square square-a state1a" />
        <div className="square square-a state2a" />
        <div className="square square-a state3a" />
        <div className="square square-a state4a" />
      </div>
      <h2>{text}</h2>
    </div>
  );
};
export default React.memo(SquareSpinner);
