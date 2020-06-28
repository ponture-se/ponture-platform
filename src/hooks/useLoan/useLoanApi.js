import { createOpp, getNeedsList, getCompanies } from "api/business-loan-api";
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
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .onBadRequest((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .notFound((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .unKnownError((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
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
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .onBadRequest((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .notFound((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .unKnownError((result) => {
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .call(pId);
  }
  function getNeedsByCategory(category) {
    return needs[category];
  }
  function _createOpp(loan, onSuccess, onError) {
    createOpp()
      .onOk((result) => {
        if (onSuccess) onSuccess(result);
      })
      .onServerError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .onBadRequest((result) => {
        if (onError) onError(result);
      })
      .notFound((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .unKnownError((result) => {
        track("Failure", "Loan Application v2", "/app/loan/ wizard", 0);
        dispatch({
          type: "TOGGLE_ERROR_BOX",
          payload: true,
        });
        if (onError) onError();
      })
      .call(loan);
  }
  return {
    getNeeds,
    getNeedsByCategory,
    _getCompanies,
    _createOpp,
  };
};
export default useLoanApi;
