import React, { useEffect } from "react";
import { StateProvider } from "./index";
const Provider = props => {
  // const [notifiIfo] = useNotification();
  // useEffect(() => {
  //   setTimeout(() => {
  //     setNotif("test message");
  //   }, 2000);
  // }, false);

  const token = false;
  const initialState = {
    isAuthenticated:
      token !== undefined && token !== null && token.length > 0 ? true : false,
    b_loan_moreInfo_visibility: false,
    notifies: [],
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "LOGOUT":
        //   storageManager.removeItem("token");
        const logout = {
          ...state,
          isAuthenticated: false,
        };
        return logout;
      case "TOGGLE_B_L_MORE_INFO":
        //   storageManager.removeItem("token");
        const moreInfo = {
          ...state,
          b_loan_moreInfo_visibility: action.value,
        };
        return moreInfo;
      case "ADD_NOTIFY":
        let newItem = { ...action.value };
        newItem.id = Math.random();
        let items_n = [...state.notifies];
        items_n.unshift(newItem);
        return {
          ...state,
          notifies: items_n,
        };
      case "REMOVE_NOTIFY":
        const items = state.notifies.filter(
          item => item.id !== action.value.id
        );
        return {
          ...state,
          notifies: items,
        };
      default:
        return state;
    }
  };
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {props.children}
      {/* <NotificationBar {...notifiIfo} /> */}
    </StateProvider>
  );
};
export default Provider;
