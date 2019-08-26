import React from "react";
import "./styles.scss";
const SquareSpinner = props => {
  return (
    <div className="loading">
      <div className="square square-a state1a" />
      <div className="square square-a state2a" />
      <div className="square square-a state3a" />
      <div className="square square-a state4a" />
    </div>
  );
};
export default React.memo(SquareSpinner);
