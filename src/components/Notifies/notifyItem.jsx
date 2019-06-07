import React, { useEffect } from "react";
import "./styles.scss";
const NotifyItem = props => {
  const { notify } = props;
  const timeout = setTimeout(() => {
    props.onRemove(notify);
  }, 2000);

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  });

  return (
    <div className="custom-notify">
      <div
        className="leftbox"
        style={{
          background:
            notify.type === "success"
              ? "rgb(54,179,126)"
              : notify.type === "error"
              ? "rgb(255,86,48)"
              : notify.type === "warning"
              ? "rgb(255,171,0)"
              : ""
        }}
      >
        <i className={notify.icon} />
      </div>
      <div
        className="centerbox"
        style={{
          background:
            notify.type === "success"
              ? "rgb(227,252,239)"
              : notify.type === "error"
              ? "rgb(255,235,230)"
              : notify.type === "warning"
              ? "rgb(255,250,230)"
              : "",
          color:
            notify.type === "success"
              ? "rgb(54,179,126)"
              : notify.type === "error"
              ? "rgb(255,86,48)"
              : notify.type === "warning"
              ? "rgb(255,171,0)"
              : ""
        }}
      >
        {notify.message}
      </div>
      <div
        className="rightbox"
        style={{
          background:
            notify.type === "success"
              ? "rgb(227,252,239)"
              : notify.type === "error"
              ? "rgb(255,235,230)"
              : notify.type === "warning"
              ? "rgb(255,250,230)"
              : ""
        }}
        onClick={() => props.onRemove(notify)}
      >
        <i
          className="icon-cross"
          style={{
            color:
              notify.type === "success"
                ? "rgb(54,179,126)"
                : notify.type === "error"
                ? "rgb(255,86,48)"
                : notify.type === "warning"
                ? "rgb(255,171,0)"
                : ""
          }}
        />
      </div>
    </div>
  );
};

export default NotifyItem;
