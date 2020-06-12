import React from "react";
import ReactTooltip from "react-tooltip";
import styles from "../../styles.module.scss";
const Tooltip = ({ id, text }) => {
  const ref = React.useRef();
  function closeTooltip() {
    ReactTooltip.hide(ref);
  }
  return (
    <>
      <div className={styles.tooltip} data-for={id} data-tip="">
        ?
      </div>
      <ReactTooltip
        backgroundColor="#ddf2f4"
        id={id}
        className={styles.tooltip__customClass}
      >
        <div className={styles.tooltip__container}>
          <i className="icon-cross" ref={ref} onClick={closeTooltip} />
          <span>{text}</span>
        </div>
      </ReactTooltip>
    </>
  );
};

export default Tooltip;
