export const initialState = {
  formStatus: "form",
  steps: [],
  needs: null,
};
//
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SET_CURRENT_STEP":
      return {
        ...state,
        steps: state.steps.map((item, index) => {
          if (item.id === payload) {
            item.isFinished = false;
            item.isCurrent = true;
          }
          return item;
        }),
      };
    case "NEXT_STEP":
      let i;
      let new_steps = state.steps.map((item, index) => {
        if (!i && index !== state.steps.length - 1 && item.isCurrent) {
          i = index;
          item.isFinished = true;
          item.isCurrent = false;
        }
        return item;
      });
      const lastCurrentStep = new_steps.find(
        (item) => !item.isFinished && item.isCurrent
      );
      if (!lastCurrentStep && new_steps[i + 1]) {
        new_steps[i + 1].isCurrent = true;
      }
      return {
        ...state,
        new_steps,
      };
    case "SET_NEED_CATEGORY":
      return {
        ...state,
        selectedNeedCategory: payload,
      };
    case "SET_FORM_STATUS":
      return {
        ...state,
        formStatus: payload,
      };
    case "SET_NEEDS":
      const { categorizedNeeds, isUrlNeeds, urlNeeds } = payload;
      return {
        ...state,
        needs: categorizedNeeds,
        isUrlNeeds,
        urlNeeds,
        steps: isUrlNeeds
          ? [
              { id: 1, isFinished: false, isCurrent: true },
              { id: 3, isFinished: false, isCurrent: false },
              { id: 4, isFinished: false, isCurrent: false },
              { id: 5, isFinished: false, isCurrent: false },
            ]
          : [
              { id: 1, isFinished: false, isCurrent: true },
              { id: 2, isFinished: false, isCurrent: false },
              { id: 3, isFinished: false, isCurrent: false },
              { id: 4, isFinished: false, isCurrent: false },
              { id: 5, isFinished: false, isCurrent: false },
            ],
      };
    case "TOGGLE_IS_NEEDS_URL":
      const new_s = [
        { id: 1, isFinished: false, isCurrent: true },
        {
          id: 2,
          isFinished: false,
          isCurrent: true,
        },
        state.steps[1],
        state.steps[2],
        state.steps[3],
      ];
      return {
        ...state,
        isUrlNeeds: payload,
        steps: new_s,
      };

    case "SET_COMPANIES":
      const { companies, personalNumber } = payload;
      return {
        ...state,
        companies,
        personalNumber,
      };
    case "SET_SELECTED_COMPANY":
      return {
        ...state,
        selectedCompany: payload,
      };
    case "SET_CONTACT_INFO":
      return {
        ...state,
        contactInfo: payload,
      };
    default:
      return state;
  }
};
