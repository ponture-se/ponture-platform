import React, { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./reducer";
export const StateContext = createContext();
export const DispatchContext = createContext();

const LoanProvider = ({ children, initialDataFromServer }) => {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...initialDataFromServer,
  });
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const useLoanState = () => useContext(StateContext);
const useLoanDispatch = () => useContext(DispatchContext);
export { LoanProvider, useLoanState, useLoanDispatch };
