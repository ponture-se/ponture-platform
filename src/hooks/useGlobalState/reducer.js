//
//Initial actions when application loading for the first time
let bankIdInfo = null;
let agentReferralId = null;
let currentRole = null;
let _isAuthenticated = false;
try {
  bankIdInfo = JSON.parse(sessionStorage.getItem("@ponture-customer-bankid"));
  if (bankIdInfo) currentRole = "customer";
  _isAuthenticated = true;
} catch (error) {}

try {
  agentReferralId = JSON.parse(sessionStorage.getItem("@ponture-agent-info"))
    .broker_id;
  if (agentReferralId) currentRole = "agent";
  _isAuthenticated = true;
} catch (error) {}
//reAuthenticate has a hidden but important role
//If user is authenticated there is no need for user reAuthentication. But,
//If user not authenticated then do authentication based on user role and user data
export const initialState = {
  isAuthenticated:
    (bankIdInfo && currentRole === "customer") ||
    (agentReferralId && currentRole === "agent")
      ? true
      : false,
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
