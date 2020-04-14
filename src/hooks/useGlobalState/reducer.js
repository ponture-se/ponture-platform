//
let bankIdInfo = null;
try {
  bankIdInfo = JSON.parse(sessionStorage.getItem("@ponture-customer-bankid"));
} catch (error) {}

export const initialState = {
  isAuthenticated: bankIdInfo ? true : false,
  b_loan_moreInfo_visibility: false,
  verifyInfo: bankIdInfo,
  userInfo: null,
  notifies: [],
  offerUiAction: {},
};
//
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_AUTHENTICATION":
      return {
        ...state,
        isAuthenticated: payload,
      };
    case "LOGOUT":
      const logout = {
        ...state,
        isAuthenticated: false,
        verifyInfo: null,
        userInfo: null,
      };
      return logout;
    case "TOGGLE_B_L_MORE_INFO":
      const moreInfo = {
        ...state,
        b_loan_moreInfo_visibility: action.value,
      };
      return moreInfo;
    case "VERIFY_BANK_ID_SUCCESS":
      return {
        ...state,
        verifyInfo: payload,
        isAuthenticated: true,
      };
    case "SET_USER_INFO":
      return {
        ...state,
        userInfo: payload,
      };
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
        (item) => item.id !== action.value.id
      );
      return {
        ...state,
        notifies: items,
      };
    case "SET_OFFER_UI_ACTION":
      return {
        ...state,
        offerUiAction: payload,
      };
    default:
      return state;
  }
};
