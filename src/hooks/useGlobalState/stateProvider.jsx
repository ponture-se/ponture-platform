import React from "react";
import { StateProvider } from "./index";
import { initialState, reducer } from "./reducer";
const Provider = props => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {props.children}
    </StateProvider>
  );
};
export default Provider;
