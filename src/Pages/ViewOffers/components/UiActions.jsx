import React from "react";
import useGlobalState from "hooks/useGlobalState";
import useLocale from "hooks/useLocale";
import track from "utils/trackAnalytic";
import { Tags, BothTagsId } from "../helper";

const UiActions = ({ hasUiActionsSame }) => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();

  function scrollCheapest() {
    track("Clicked Cheapest offer", "Customer Portal v2", "Customer Portal", 0);
    let name = Tags.cheapest;
    if (hasUiActionsSame) {
      name = BothTagsId;
    }
    dispatch({
      type: "SET_OFFER_UI_ACTION",
      payload: { isClicked: true, name, className: Tags.cheapest },
    });
  }
  function scrollBiggest() {
    track("Clicked Biggest offer", "Customer Portal v2", "Customer Portal", 0);
    let name = Tags.biggest;
    if (hasUiActionsSame) {
      name = BothTagsId;
    }
    dispatch({
      type: "SET_OFFER_UI_ACTION",
      payload: { isClicked: true, name, className: Tags.biggest },
    });
  }
  return (
    <div className="uiActions">
      <span className="row-title">{t("OFFERS_ACTIONS_TITLE")}</span>
      <div className="uiActions__btns">
        <button className="button redbutton" onClick={scrollCheapest}>
          {t("OFFERS_ACTIONS_CHEAPEST_BTN")}
        </button>
        <button className="button greenbutton" onClick={scrollBiggest}>
          {t("OFFERS_ACTIONS_BIGGEST_BTN")}
        </button>
      </div>
    </div>
  );
};
export default UiActions;
