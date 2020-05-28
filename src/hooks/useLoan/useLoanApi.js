import {
  startBankId,
  cancelVerify,
  submitLoan,
  getNeedsList,
} from "api/business-loan-api";
import track from "utils/trackAnalytic";
import useLocale from "hooks/useLocale";
import { useLoanState, useLoanDispatch } from "./index";

const useLoanApi = () => {
  const { currentLang } = useLocale();
  const dispatch = useLoanDispatch();
  const { needs } = useLoanState();
  const makeNeedsCategorize = (needs) => {
    let n = {};
    return needs.reduce((acc, item) => {
      if (!n[item.category]) n[item.category] = [];
      n[item.category].push(item);
      return n;
    }, n);
  };
  function getNeeds(onSuccess, onError) {
    getNeedsList()
      .onOk((result) => {
        dispatch({
          type: "SET_NEEDS",
          payload: makeNeedsCategorize(result),
        });
        if (onSuccess) onSuccess(result);
      })
      .onServerError((result) => {
        track("Failure", "Loan Application", "/app/loan/ wizard", 0);
        if (onError) onError();
      })
      .onBadRequest((result) => onError && onError())
      .notFound((result) => onError && onError())
      .unKnownError((result) => onError && onError())
      .call(currentLang);
  }
  function getNeedsByCategory(category) {
    return needs[category];
  }
  return {
    getNeeds,
    getNeedsByCategory,
  };
};
export default useLoanApi;
