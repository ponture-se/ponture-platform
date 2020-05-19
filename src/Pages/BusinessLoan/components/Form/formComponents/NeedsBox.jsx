import React from "react";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";
import { useLoanDispatch } from "hooks/useLoan";

const needs = [
  {
    id: 1,
    name: "",
    displayName: "Köp av fordon",
  },
  {
    id: 2,
    name: "",
    displayName: "Anställa Personal",
  },
  {
    id: 3,
    name: "",
    displayName: "Renovering",
  },
  {
    id: 4,
    name: "",
    displayName: "Hyra Lokal",
  },
  {
    id: 5,
    name: "",
    displayName: "Seasonsfinansiering",
  },
  {
    id: 6,
    name: "",
    displayName: "Inköp av varo lager",
  },
  {
    id: 7,
    name: "",
    displayName: "Köp/Hyr av utrustning",
  },
  {
    id: 8,
    name: "",
    displayName: "Oväntade utgifter",
  },
  {
    id: 9,
    name: "",
    displayName: "Ansökan om tillstånd",
  },
  {
    id: 10,
    name: "",
    displayName: "Betala av andra skulder",
  },
  {
    id: 11,
    name: "",
    displayName: "Ospecificerad",
  },
  {
    id: 12,
    name: "",
    displayName: "Ospecificerad",
  },
];
const NeedsBox = () => {
  const dispatch = useLoanDispatch();
  const [needsList, setNeeds] = React.useState(needs);
  const needsBoxRef = React.useRef(null);
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
    }
    const n = needsList.map((need) => {
      if (need.id === item.id) {
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
        {needsList.map((item, index) => (
          <Button
            key={index}
            customClass={styles.needsBox__customBtn}
            selected={item.selected}
            onClick={() => selectNeed(item)}
          >
            Generelll likviditet
          </Button>
        ))}
      </div>
    </div>
  );
};

export default NeedsBox;
