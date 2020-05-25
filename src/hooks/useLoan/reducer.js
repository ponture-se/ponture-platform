export const initialState = {
  formStatus: "form",
  steps: [
    { id: 1, isFinished: false, isCurrent: true },
    { id: 2, isFinished: false, isCurrent: false },
    { id: 3, isFinished: false, isCurrent: false },
    { id: 4, isFinished: false, isCurrent: false },
    { id: 5, isFinished: false, isCurrent: false },
  ],
};
//
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_FINISHED_STEP":
      return {
        ...state,
        steps: state.steps.map((item) => {
          if (item.id === payload) {
            item.isFinished = true;
            item.isCurrent = false;
          } else if (item.id === payload + 1) {
            item.isCurrent = true;
          }
          return item;
        }),
      };
    case "SET_FORM_STATUS":
      return {
        ...state,
        formStatus: payload,
      };
    default:
      return state;
  }
};
