import React from "react";
import "./styles.scss";
import { useGlobalState } from "./../../hooks";
import NotifyItem from "./notifyItem";
import { CSSTransition, TransitionGroup } from "react-transition-group";
const Notifies = props => {
  const [{ notifies }, dispatch] = useGlobalState();
  function remove(item) {
    dispatch({
      type: "REMOVE_NOTIFY",
      value: item,
    });
  }
  return (
    <div className="notifies">
      <TransitionGroup>
        {notifies.map(notify => {
          if (notify.type === "success") {
            notify.icon = "icon-checkmark";
          } else if (notify.type === "error") {
            notify.icon = "icon-shield";
          } else {
            notify.icon = "icon-warning";
          }
          return (
            <CSSTransition key={notify.id} timeout={500} classNames="item">
              <NotifyItem notify={notify} onRemove={remove} />
            </CSSTransition>
          );
        })}
      </TransitionGroup>
    </div>
  );
};

export default Notifies;
