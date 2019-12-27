import React, { useState, useEffect } from "react";
// import { connect } from "react-redux";
//
import { useGlobalState, useLocale } from "hooks";
import { CircleSpinner } from "components";
import "./styles.scss";
// import { login } from "services/redux/auth/actions";

const UserPassLogin = props => {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let didCancel = false;
  const { t } = useLocale();
  const [{}, dispatch] = useGlobalState();
  const [loading, toggleLoading] = useState(false);
  const [error, setError] = useState();
  const [startResult, setStartResult] = useState();

  function handleUsernameChanged(e) {
    setUsername(e.target.value);
  }
  function handlePasswordChanged(e) {
    setPassword(e.target.value);
  }
  function handleLoginClicked(e) {
    e.preventDefault();
    if (!props.loading) props.login(userName, password, props);
  }

  return (
    <div className="loginContainer">
      <div className="loginHeader">
        <img src={require("./../../assets/logo-c.png")} alt="" />
      </div>
      <div className="loginBox animated fadeIn">
        <div className="loginBox__header">
          <span>{t("LOGIN_TITLE")}</span>
        </div>
        <form onSubmit={handleLoginClicked}>
          <div className="formInput">
            <div className="formInput__header">
              <div className="formInput__header__left">
                {t("LOGIN_USERNAME")}
              </div>
            </div>
            <div className="formInput__body">
              <input
                type="text"
                className="element"
                placeholder={t("LOGIN_USERNAME_INPUT_PLACEHOLDER")}
                autoFocus
                value={userName}
                onChange={handleUsernameChanged}
              />
            </div>
            <div className="formInput__footer">
              <div className="formInput__footer__left">
                <span className="elementInfo">{t("LOGIN_USERNAME_INFO")}</span>
              </div>
            </div>
          </div>
          <div className="formInput">
            <div className="formInput__header">
              <div className="formInput__header__left">
                {t("LOGIN_PASSWORD")}
              </div>
            </div>
            <div className="formInput__body">
              <input
                type="password"
                className="element"
                placeholder={t("LOGIN_PASSWORD_INPUT_PLACEHOLDER")}
                value={password}
                onChange={handlePasswordChanged}
              />
            </div>
            <div className="formInput__footer">
              <div className="formInput__footer__left">
                <span className="elementInfo">{t("LOGIN_PASSWORD_INFO")}</span>
              </div>
            </div>
          </div>
          <button
            className="btn --primary"
            disabled={
              !(
                userName &&
                userName.length > 0 &&
                password &&
                password.length > 6
              )
            }
          >
            {!props.loading ? (
              t("LOGIN_BTN_NAME")
            ) : (
              <CircleSpinner show={true} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    loading: state.authReducer.loading
  };
}

// const mapDispatchToProps = {
//   login
// };

export default UserPassLogin;
