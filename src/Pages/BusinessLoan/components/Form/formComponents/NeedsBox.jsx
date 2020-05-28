import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";

const NeedsBox = () => {
  const needsBoxRef = React.useRef(null);
  const dispatch = useLoanDispatch();
  const { selectedNeedCategory } = useLoanState();
  const { getNeedsByCategory } = useLoanApi();
  const [needsList, setNeeds] = React.useState(
    JSON.parse(JSON.stringify(getNeedsByCategory(selectedNeedCategory)))
  );
  const updateNeeds = () => {
    dispatch({
      type: "SET_CURRENT_STEP",
      payload: 2,
    });
    setNeeds(
      JSON.parse(JSON.stringify(getNeedsByCategory(selectedNeedCategory)))
    );
  };
  React.useEffect(updateNeeds, [selectedNeedCategory]);

  React.useEffect(() => {
    if (needsBoxRef.current) {
      window.scrollTo(0, needsBoxRef.current.offsetTop);
    }
  }, []);
  function selectNeed(item) {
    if (!needsList.some((n) => n.selected)) {
      dispatch({
        type: "SET_FINISHED_STEP",
        payload: 2,
      });
    } else {
      dispatch({
        type: "SET_CURRENT_STEP",
        payload: 2,
      });
    }
    const n = needsList.map((need) => {
      if (need.API_Name === item.API_Name) {
        need.selected = !need.selected;
      }
      return need;
    });
    setNeeds(n);
  }
  return (
    <div ref={needsBoxRef} className={"animated fadeIn " + styles.needsBox}>
      <div className={styles.needsBox__info}>
        <Title text="Anledning till lån" tooltip="no tooltip" id="bb" />
      </div>
      <h5 className={styles.needsBox__desc}>
        Om du har mer än en anledning till företagslån får du välja flera
        alternativ
      </h5>
      <div className={styles.needsBox__list}>
        {needsList &&
          needsList.map((item, index) => (
            <Button
              key={item.API_Name}
              customClass={styles.needsBox__customBtn}
              selected={item.selected}
              onClick={() => selectNeed(item)}
            >
              {item.Label}
            </Button>
          ))}
      </div>
      {needsList && !needsList.some((n) => n.selected) && (
        <div className={styles.guide}>
          Välj minst en anledning från listan för att gå vidare.
        </div>
      )}
    </div>
  );
};

export default NeedsBox;
