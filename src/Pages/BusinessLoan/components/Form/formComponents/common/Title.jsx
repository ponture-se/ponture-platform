import React from "react";
import styles from "../../styles.module.scss";
import Tooltip from "./Tooltip";
const Title = ({ id, text, tooltip, showTooltip = true }) => {
  return (
    <div className={styles.title}>
      <h4>{text}</h4>
      {showTooltip && <Tooltip text={tooltip} id={id} />}
    </div>
  );
};

export default Title;
