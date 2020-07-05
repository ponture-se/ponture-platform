import React from "react";
import { useFormContext } from "react-hook-form";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Title from "./common/Title";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";
import useLocale from "hooks/useLocale";
import track from "utils/trackAnalytic";

const NeedsBox = () => {
  const { t } = useLocale();
  const needsBoxRef = React.useRef(null);
  const { setValue } = useFormContext();
  const dispatch = useLoanDispatch();
  const { selectedNeedCategory, currentStep, steps, tracking } = useLoanState();
  const { getNeedsByCategory } = useLoanApi();
  const [needsList, setNeeds] = React.useState(
    JSON.parse(JSON.stringify(getNeedsByCategory(selectedNeedCategory)))
  );
  const [isDoneNextStepAction, setIsDoneNextStep] = React.useState(false);
  const updateNeeds = () => {
    setNeeds(
      JSON.parse(JSON.stringify(getNeedsByCategory(selectedNeedCategory)))
    );
    return () => {
      setIsDoneNextStep(false);
    };
  };
  React.useEffect(updateNeeds, [selectedNeedCategory]);
  const scroll = () => {
    if (needsBoxRef.current && currentStep === "needsBox") {
      window.scrollTo(0, needsBoxRef.current.offsetTop);
    }
  };
  React.useEffect(scroll, []);
  function checkTracking() {
    if (
      steps.needsBox.isTouched &&
      !steps.needsBox.isFinished &&
      !tracking.needsBox
    ) {
      dispatch({
        type: "SET_TRACKING",
        payload: {
          name: "needsBox",
        },
      });
      track("Step 2", "Loan Application v2", "/app/loan/ wizard", 0);
    }
  }
  React.useEffect(checkTracking, []);
  function selectNeed(item) {
    const n = needsList.map((need) => {
      if (need.API_Name === item.API_Name) {
        need.selected = !need.selected;
      }
      return need;
    });
    const selectedNeeds = n.filter((need) => need.selected);
    setValue("need", selectedNeeds);
    if (selectedNeeds.length === 0) {
      dispatch({
        type: "SET_STEP_TO_NOT_FINISHED",
        payload: {
          step: "needsBox",
        },
      });
      setIsDoneNextStep(false);
    } else {
      if (!isDoneNextStepAction) {
        dispatch({
          type: "NEXT_STEP",
          payload: {
            finishedStep: "needsBox",
            nextStep: "personalNumberBox",
          },
        });
        setIsDoneNextStep(true);
      }
    }
    setNeeds(n);
  }
  return (
    <div ref={needsBoxRef} className={"animated fadeIn " + styles.needsBox}>
      <div className={styles.needsBox__info}>
        <Title text={t("NEEDS_LABEL")} tooltip={t("NEEDS_TOOLTIP")} id="bb" />
      </div>
      <h5 className={styles.needsBox__desc}>{t("NEEDS_DESCRIPTION")}</h5>
      <div className={styles.needsBox__list}>
        {needsList &&
          needsList.map((item, index) => (
            <Button
              key={item.API_Name}
              customClass={styles.needsBox__customBtn}
              selected={item.selected}
              onMouseDown={() => selectNeed(item)}
            >
              {item.Label}
            </Button>
          ))}
      </div>
      {needsList && !needsList.some((n) => n.selected) && (
        <div className={styles.guide}>{t("NEEDS_GUIDE")}</div>
      )}
    </div>
  );
};

export default NeedsBox;
