export const initialState = {
  loanFormStatus: "form",
  needs: null,
  pNumberTryCounter: 0,
  currentStep: "loanAmountBox",
  steps: {
    loanAmountBox: {
      index: 1,
      isHidden: false,
      isFinished: false,
      isTouched: true,
    },
    needsBox: {
      index: 2,
      isHidden: false,
      isFinished: false,
      isTouched: false,
    },
    personalNumberBox: {
      index: 3,
      isHidden: false,
      isFinished: false,
      isTouched: false,
    },
    companiesBox: {
      index: 4,
      isHidden: false,
      isFinished: false,
      isTouched: false,
    },
    submitBox: {
      index: 5,
      isHidden: false,
      isFinished: false,
      isTouched: false,
    },
  },
  tracking: {
    loanAmountBox: true,
    needsBox: false,
    personalNumberBox: false,
    companiesBox: false,
    submitBox: false,
  },
};
//
export const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "NEXT_STEP":
      let s = {
        ...state,
        steps: {
          ...state.steps,
          [payload.finishedStep]: {
            ...state.steps[payload.finishedStep],
            isFinished: true,
          },
          [payload.nextStep]: {
            ...state.steps[payload.nextStep],
            isTouched: true,
          },
        },
        currentStep: payload.nextStep,
      };
      if (payload.nextStep === "personalNumberBox") {
        const a = {
          ...s,
          steps: {
            ...s.steps,
            personalNumberBox: {
              ...s.steps.personalNumberBox,
              isHidden: false,
            },
            companiesBox: {
              ...s.steps.companiesBox,
              isHidden: false,
            },
            submitBox: {
              ...s.steps.submitBox,
              isHidden: false,
            },
          },
        };
        return a;
      }
      return s;
    case "SET_STEP_TO_NOT_FINISHED":
      return {
        ...state,
        steps: {
          ...state.steps,
          [payload.step]: {
            ...state.steps[payload.step],
            isFinished: false,
          },
          personalNumberBox: {
            ...state.steps["personalNumberBox"],
            isHidden: true,
          },
          companiesBox: {
            ...state.steps["companiesBox"],
            isHidden: true,
          },
          submitBox: {
            ...state.steps["submitBox"],
            isHidden: true,
          },
        },
        currentStep: payload.step,
      };
    case "URL_NEEDS_RESET_TO_LOAN_BOX":
      return {
        ...state,
        isUrlNeeds: false,
        steps: {
          ...state.steps,
          loanAmountBox: {
            ...state.steps.loanAmountBox,
            isFinished: false,
          },
          personalNumberBox: {
            ...state.steps["personalNumberBox"],
            isHidden: true,
          },
          companiesBox: {
            ...state.steps["companiesBox"],
            isHidden: true,
          },
          submitBox: {
            ...state.steps["submitBox"],
            isHidden: true,
          },
        },
      };
    case "SET_NEED_CATEGORY":
      return {
        ...state,
        selectedNeedCategory: payload,
      };

    case "SET_NEEDS":
      const { categorizedNeeds, isUrlNeeds, urlNeeds } = payload;
      return {
        ...state,
        needs: categorizedNeeds,
        isUrlNeeds,
        urlNeeds,
      };
    case "TOGGLE_IS_NEEDS_URL":
      return {
        ...state,
        isUrlNeeds: payload,
        steps: {
          ...state.steps,
          personalNumberBox: {
            ...state.steps["personalNumberBox"],
            isHidden: true,
          },
          companiesBox: {
            ...state.steps["companiesBox"],
            isHidden: true,
          },
          submitBox: {
            ...state.steps["submitBox"],
            isHidden: true,
          },
        },
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
        currentStep: "",
      };
    case "SET_CONTACT_INFO":
      return {
        ...state,
        contactInfo: payload,
      };
    case "TOGGLE_ERROR_BOX":
      return {
        ...state,
        errorBox: payload,
      };
    case "INCREMENT_P_NUMBER_TRY_COUNTER":
      return {
        ...state,
        pNumberTryCounter: state.pNumberTryCounter + 1,
      };
    case "SET_LOAN_FORM_STATUS":
      return {
        ...state,
        loanFormStatus: payload,
      };
    case "SET_TRACKING":
      return {
        ...state,
        tracking: {
          ...state.tracking,
          [payload.name]: true,
        },
      };
    default:
      return state;
  }
};
