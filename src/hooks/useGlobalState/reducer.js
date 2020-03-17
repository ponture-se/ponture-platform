import { getParameterByName } from "./../../utils";
//
//Initial actions and global states while application loading for the first time
//IMPORTANT: Role handling must be improved.
let bankIdInfo = null;
let brokerId = null;
let currentRole = "customer"; //default role is customer
let _isAuthenticated = false;
let brokerParam = getParameterByName("brokerid", window.location.href);
let customerParam = getParameterByName("customerid", window.location.href);
let userSession = undefined;
debugger;
//first check URL params to determine user role, then if any params aren't set check cookies for role specifying
if (brokerParam) {
  currentRole = "agent";
  try {
    userSession = JSON.parse(sessionStorage.getItem("@ponture-user-info"));
    if (!userSession || userSession.role !== "agent") {
      _isAuthenticated = false;
    } else {
      _isAuthenticated = true;
    }
  } catch (error) {}
} else if (customerParam) {
  currentRole = "customer";
  try {
    bankIdInfo = JSON.parse(sessionStorage.getItem("@ponture-customer-bankid"));
    if (bankIdInfo) {
      _isAuthenticated = true;
    } else {
      _isAuthenticated = false;
    }
  } catch (error) {}
} else {
  try {
    bankIdInfo = JSON.parse(sessionStorage.getItem("@ponture-customer-bankid"));
    userSession = JSON.parse(sessionStorage.getItem("@ponture-user-info"));
    if (bankIdInfo) {
      currentRole = "customer";
      if (bankIdInfo) {
        _isAuthenticated = true;
      } else {
        _isAuthenticated = false;
      }
    } else if (userSession) {
      if (userSession) {
        currentRole = userSession.role;
        if (!userSession) {
          _isAuthenticated = false;
        } else {
          _isAuthenticated = true;
        }
      }
    } else {
      sessionStorage.removeItem("@ponture-user-info");
      sessionStorage.removeItem("@ponture-customer-bankid");
    }
  } catch (error) {
    sessionStorage.removeItem("@ponture-user-info");
  }
}

//reAuthenticate has a hidden but important role
//If user is authenticated there is no need for user reAuthentication. But,
//If user not authenticated then do authentication based on user role and user data
export const initialState = {
  isAuthenticated: _isAuthenticated,
  //(bankIdInfo && currentRole === "customer") ||(userSession && userSession.broker_id && currentRole === "agent")? true: false,
  b_loan_moreInfo_visibility: false,
  verifyInfo: bankIdInfo,
  userInfo: null,
  notifies: [],
  currentRole: currentRole
};
//

export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_AUTHENTICATION":
      return {
        ...state,
        isAuthenticated: payload
      };
    case "LOGOUT":
      const logout = {
        ...state,
        isAuthenticated: false,
        verifyInfo: null,
        userInfo: null,
        currentRole: null,
        lastRole: payload.lastRole
      };
      return logout;
    case "TOGGLE_B_L_MORE_INFO":
      const moreInfo = {
        ...state,
        b_loan_moreInfo_visibility: action.value
      };
      return moreInfo;
    case "VERIFY_BANK_ID_SUCCESS":
      return {
        ...state,
        verifyInfo: payload,
        isAuthenticated: true
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: payload.userInfo,
        currentRole: payload.currentRole,
        isAuthenticated: payload.isAuthenticated
      };
    case "ADD_NOTIFY":
      let newItem = { ...action.value };
      newItem.id = Math.random();
      let items_n = [...state.notifies];
      items_n.unshift(newItem);
      return {
        ...state,
        notifies: items_n
      };
    case "REMOVE_NOTIFY":
      const items = state.notifies.filter(item => item.id !== action.value.id);
      return {
        ...state,
        notifies: items
      };
    default:
      return state;
  }
};
