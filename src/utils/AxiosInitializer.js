import React from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useGlobalState, useLocale } from "hooks";
//
const config = process.env;
const baseUrl = config.REACT_APP_BASE_URL;
const submitUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_SUBMIT;
const collectUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_COLLECT;
const cancelUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_CANCEL;
const companiesUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_GET_COMPANIES;

export default function AxiosInitializer({ children }) {
  const { t } = useLocale();
  const [{}, dispatch] = useGlobalState();

  React.useEffect(() => {
    axios.interceptors.response.use(
      function(response) {
        return response;
      },
      function(error) {
        const response = error.response;
        if (response.status === 401) {
          const url = response.config.url;
          if (
            url !== submitUrl &&
            url !== collectUrl &&
            url !== cancelUrl &&
            url !== companiesUrl
          ) {
            sessionStorage.removeItem("@ponture-customer-bankid");
            sessionStorage.removeItem("@ponture-agent-info");
            Cookies.remove("@ponture-customer-portal/token");
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: t("UN_AUTHORIZED")
              }
            });
            dispatch({
              type: "SET_AUTHENTICATION",
              payload: false
            });
          }
        }
        return Promise.reject(error);
      }
    );
  }, [dispatch]);

  return children;
}
