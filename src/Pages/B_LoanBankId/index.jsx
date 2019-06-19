import React, { useState, useEffect, useCallback, useRef } from "react";
import "./styles.scss";
import CircleSpinner from "../../components/CircleSpinner";
import { getToken } from "./../../api/business-loan-api";
import { useGlobalState, useLocale } from "./../../hooks";

export default function BloanVerifyBankId(props) {
  const [{}, dispatch] = useGlobalState();
  const { t } = useLocale();
  const [spinner, toggleSpinner] = useState(true);

  useEffect(() => {
    let didCancel = false;

    return () => {
      didCancel = true;
    };
  }, []);
  function handleCancel() {
    dispatch({
      type: "TOGGLE_B_L_MORE_INFO",
      value: true,
    });
    props.history.push("/");
  }
  return (
    <div className="bankId">
      <div className="bankId__header">
        <div className="bankId__logo">
          <img src={require("./../../assets/logo-c.png")} alt="logo" />
        </div>
        <div className="bankId__text">Verifiering av personnummer </div>
      </div>
      <div className="bankId__body">
        <div className="bankId__centerBox animated fadeIn faster">
          <div className="bankId__centerBox__header">
            <img src={require("./../../assets/bankidLogo.png")} alt="logo" />
            <span>Verifiera med BankId</span>
          </div>
          <div className="bankId__centerBox__body">
            <span className="description">
              För att fortsätta, kommer BankId att omdirigera dig, e-postadress,
              språk preferens och profilbild med ponture.com
            </span>
            {/* {spinner && ( */}
            <div className="spinner">
              <CircleSpinner show={true} size="large" />
              <span>Anslut till bankId...</span>
            </div>
            {/* )} */}
            {/* {!spinner && (
              <div className="success animated fadeIn">
                <span className="icon-checkmark icon" />
                <span className="text">
                  Please open the link to verify your personal number
                </span>
              </div>
            )} */}
          </div>
          <div className="bankId__centerBox__footer">
            {/* {!spinner && ( */}
            <button className="btn --light" onClick={handleCancel}>
              Avbryt verifiering
            </button>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
