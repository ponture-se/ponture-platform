import React from "react";
import useGlobalState from "hooks/useGlobalState";
import useLocale from "hooks/useLocale";
import { Tags, BothTagsId } from "../helper";

const UiActions = ({ hasUiActionsSame }) => {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();

  function scrollCheapest() {
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
