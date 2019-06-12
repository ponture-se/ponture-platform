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
    spaceInfo: undefined,
    userInfo: undefined,
    contentTypeTemlates: [],
    contentTypes: [],
    fields: [],
    categories: [],
    contents: [],
    requests: [],
    users: [],
    assets: [],
    status: [
      {
        id: "0",
        name: "draft",
        icon: "icon-draft",
      },
      {
        id: "1",
        name: "archived",
        icon: "icon-archive",
      },
      {
        id: "2",
        name: "changed",
        icon: "icon-refresh",
      },
      {
        id: "3",
        name: "published",
        icon: "icon-publish",
      },
    ],
    notifies: [],
    sysLocales: [
      {
        name: "en",
        title: "English (United State) (en-US)",
      },
      {
        name: "fa",
        title: "فارسی (ایران) (fa)",
      },
      {
        name: "de",
        title: "German (Germany) (de-DE)",
      },
      {
        name: "sv",
        title: "Swedish (Sweden) (sw-SV)",
      },
    ],
    apiKeys: [],
    webhooks: [],
    t: {},
    spinner: true,
    mp_categories: [],
    mp_contentTypes: [],
    mp_requests: [],
    mp_requestDetail: {},
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
