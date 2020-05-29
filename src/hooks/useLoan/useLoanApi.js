import {
  startBankId,
  cancelVerify,
  submitLoan,
  getNeedsList,
  getCompanies,
} from "api/business-loan-api";
import { getParameterByName } from "utils";
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
  const checkUrlNeeds = (needs) => {
    const params_need = getParameterByName("need");
    if (!params_need || params_need.length === 0) {
      return [];
    }
    const n_s = params_need.split(",");
    return needs.filter((item) => n_s.includes(item.API_Name));
  };
  function getNeeds(onSuccess, onError) {
    getNeedsList()
      .onOk((result) => {
        const urlNeeds = checkUrlNeeds(result);
        dispatch({
          type: "SET_NEEDS",
          payload: {
            categorizedNeeds: makeNeedsCategorize(result),
            isUrlNeeds: urlNeeds.length > 0,
            urlNeeds,
          },
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
  function _getCompanies(personalNumber, onSuccess, onError) {
    let pId = personalNumber.replace("-", "");
    if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
    getCompanies()
      .onOk((result) => {
        dispatch({
          type: "SET_COMPANIES",
          payload: {
            companies: result,
            personalNumber,
          },
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
      .call(pId);
  }
  function getNeedsByCategory(category) {
    return needs[category];
  }
  return {
    getNeeds,
    getNeedsByCategory,
    _getCompanies,
  };
};
export default useLoanApi;
