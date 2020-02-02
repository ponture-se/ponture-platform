import React, { useState, useEffect, useCallback } from "react";
import InputRange from "react-input-range";
import Cookies from "js-cookie";
import "react-input-range/lib/css/index.css";
import classnames from "classnames";
import separateNumberByChar from "./../../utils/separateNumberByChar";
//
import {
  getParameterByName,
  isBankId,
  isNumber,
  isPersonalNumber,
  isPhoneNumber,
  validateEmail
} from "./../../utils";
import CircleSpinner from "./../../components/CircleSpinner";
import {
  useGlobalState,
  useLocale,
  useCookie,
  useNumberRegex
} from "./../../hooks";
import "./styles.scss";
import {
  startBankId,
  cancelVerify,
  submitLoan,
  getNeedsList,
  getCompanies,
  saveLoan
} from "./../../api/business-loan-api";
import VerifyBankIdModal from "components/VerifyBankIdModal";
import track from "utils/trackAnalytic";
import batchStates from "utils/batchStates";
import UploaderApiIncluded from "../../components/UploaderApiIncluded";

// Get slider setting from react config and fill the initial data
const loanAmountMax = process.env.REACT_APP_LOAN_AMOUNT_MAX
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MAX)
  : 10000000;
const loanAmountMin = process.env.REACT_APP_LOAN_AMOUNT_MIN
  ? parseInt(process.env.REACT_APP_LOAN_AMOUNT_MIN)
  : 100000;
const loanPeriodStep = 1;
const loanPeriodMax = process.env.REACT_APP_LOAN_PERIOD_MAX
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MAX)
  : 36;
const loanPeriodMin = process.env.REACT_APP_LOAN_PERIOD_MIN
  ? parseInt(process.env.REACT_APP_LOAN_PERIOD_MIN)
  : 1;
const numberFormatRegex = /(\d)(?=(\d{3})+(?!\d))/g;
// ===============================================================

export default function BusinessLoan(props) {
  let didCancel = false;

  //Global state and locales(translation)
  const [{ b_loan_moreInfo_visibility }, dispatch] = useGlobalState();
  const { t, appLocale, currentLang } = useLocale();

  //Fill data from Cookies
  const [_loanAmount, _setLoanAmount] = useCookie("_loanAmount");
  const [_loanPeriod, _setLoanPeriod] = useCookie("_loanPeriod");

  const [_loanReasons, _setLoanReasons] = useCookie("_loanReasons");
  const [_loanReasonOther, _setLoanReasonOther] = useCookie("_loanReasonOther");

  const [_personalNumber, _setPersonalNumber] = useCookie("_personalNumber");
  const [_phoneNumber, _setPhoneNumber] = useCookie("_phoneNumber");
  const [_email, _setEmail] = useCookie("_email");
  const [referral_params] = useCookie("affiliate_referral_params"); // extra params

  //Get parameters from URL to use form default selection in form if applicable
  //Url parameters start with p_
  const p_loanAmount = getParameterByName("amount");
  const __loanAmount = p_loanAmount ? p_loanAmount : _loanAmount;
  const p_loanPeriod = getParameterByName("amourtizationPeriod");
  const __loanPeriod = p_loanPeriod ? p_loanPeriod : _loanPeriod;
  const p_loanReasons = getParameterByName("need");
  const p_loanReasonOther = getParameterByName("needDescription");
  const p_personalNumber = getParameterByName("personalNumber");
  const __personalNumber = p_personalNumber
    ? p_personalNumber
    : _personalNumber;
  const p_phoneNumber = getParameterByName("phoneNumber");
  const __phoneNumber = p_phoneNumber ? p_phoneNumber : _phoneNumber;
  const p_email = getParameterByName("email");
  const __email = p_email ? p_email : _email;
  const p_userRole = getParameterByName("brokerid") ? "agent" : "customer";
  const brokerId =
    p_userRole === "agent" ? getParameterByName("brokerid") : undefined;
  const REUsageCategoryOpts = [
    "Bostäder",
    "Kontor",
    "Butiker",
    "Industrier/Verkstäder",
    "Lager/Logistik",
    "Övrigt"
  ];
  const RETypeOpts = ["Fastighet med mark", "Fastighet utan mark"];
  //Initial values
  let formInitValues = {
    loanAmount:
      __loanAmount && __loanAmount.length > 0 && isNumber(__loanAmount)
        ? parseInt(__loanAmount) < loanAmountMin
          ? loanAmountMin
          : parseInt(__loanAmount) > loanAmountMax
          ? loanAmountMax
          : parseInt(__loanAmount)
        : 3500000,
    loanPeriod:
      __loanPeriod && __loanPeriod.length > 0 && isNumber(__loanPeriod)
        ? parseInt(__loanPeriod) < loanPeriodMin
          ? loanPeriodMin
          : parseInt(__loanPeriod) > loanPeriodMax
          ? loanPeriodMax
          : parseInt(__loanPeriod)
        : 12,
    loanReasonOtherDesc:
      _loanReasonOther && _loanReasonOther.length > 0
        ? _loanReasonOther
        : undefined,
    personalNumber:
      __personalNumber &&
      __personalNumber.length > 0 &&
      isPersonalNumber(__personalNumber)
        ? __personalNumber
        : undefined,
    company: undefined,
    phoneNumber:
      __phoneNumber && __phoneNumber.length > 0 && isPhoneNumber(__phoneNumber)
        ? __phoneNumber
        : "",
    email:
      __email && __email.length > 0 && validateEmail(__email) ? __email : "",
    terms: false,
    loanReasonsCategories: []
  };

  //Identifications
  const [userIsVerified, setUserIsVerified] = useState(false);

  //generate loanReason initialValue from cookie
  if (_loanReasons && _loanReasons.length > 0) {
    try {
      const a = JSON.parse(_loanReasons);
      if (Array.isArray(a)) {
        formInitValues["loanReasons"] = a;
      } else {
        formInitValues["loanReasons"] = undefined;
      }
    } catch (error) {
      formInitValues["loanReasons"] = undefined;
    }
  } else {
    formInitValues["loanReasons"] = undefined;
  }
  //Loan reason
  const [loanReasons, setLoanReasons] = useState(() => {
    return formInitValues.loanReasons && formInitValues.loanReasons.length > 0
      ? formInitValues.loanReasons
      : [];
  });
  const [loanReasonsIsValid, setLoanReasonsIsValid] = useState(false);
  const [selectedLoanReasons, setSelectedLoanReasons] = useState([]); //selected loan reason
  const [
    loanReasonsValidationMessage,
    setLoanReasonsValidationMessage
  ] = useState("");

  //Loan reason category
  const [loanReasonsCategories, setLoanReasonsCategories] = useState(
    formInitValues.loanReasonsCategories
  );
  const [selectedLoanReasonsCat, setSelectedLoanReasonsCat] = useState([]);

  //Loan reason other
  const [loanReasonOther, setLoanReasonOther] = useState(() => {
    if (p_loanReasons) {
      const needs = p_loanReasons.split(",");
      if (needs.indexOf("other") > -1) {
        if (p_loanReasonOther) return p_loanReasonOther;
      }
    } else if (formInitValues.loanReasons) {
      for (let i = 0; i < formInitValues.loanReasons.length; i++) {
        const l = formInitValues.loanReasons[i];
        if (l.API_Name === "other") {
          if (l.selected === true) {
            return formInitValues.loanReasonOtherDesc
              ? formInitValues.loanReasonOtherDesc
              : "";
          } else {
            return "";
          }
        }
      }
    }
    return "";
  });

  //Other loanReasons state initialization
  const [loanReasonOtherMandatory, toggleOtherLoanMandatory] = useState(() => {
    if (p_loanReasons) {
      const needs = p_loanReasons.split(",");
      if (needs.indexOf("other") > -1) return true;
    } else {
      if (formInitValues.loanReasons) {
        for (let i = 0; i < formInitValues.loanReasons.length; i++) {
          const l = formInitValues.loanReasons[i];
          if (l.API_Name === "other") {
            if (l.selected === true) return true;
            return false;
          }
        }
      }
    }
    return false;
  });

  //Other Reason input
  const [otherReasonIsValid, toggleOtherReasonValidation] = useState(true);
  const [
    otherReasonValidationMessage,
    setOtherReasonValidationMessage
  ] = useState();

  //Actions state
  const [mainSpinner, toggleMainSpinner] = useState(true);
  const [tab, changeTab] = useState(1);
  const [verifyModal, toggleVerifyModal] = useState();

  //Loan Amount and Period(Inline sliders)
  const [loanAmount, setLoanAmount] = useState(formInitValues.loanAmount);
  const [loanAmountDisplay, setLoanAmountDisplay] = useState(
    formInitValues.loanAmount
  );
  const [loanAmountStep, setLoanAmountStep] = useState(50000);
  const [loanPeriod, setLoanPeriod] = useState(formInitValues.loanPeriod);

  //Personal number field
  const [personalNumber, setPersonalNumber] = useState(
    formInitValues.personalNumber ? formInitValues.personalNumber : ""
  );
  const [personalNumberIsValid, togglePersonalNumberValidation] = useState(
    true
  );
  const [
    personalNumberValidationMessage,
    setPersonalNumberValidationMessage
  ] = useState();

  //Agent states
  const [lastName, setLastName] = useState("");

  //company selection
  const [companies, setCompanies] = useState();
  const [selectedCompany, setCompany] = useState();
  const [companyIsValid, toggleCompanyValidation] = useState(true);

  //Phone number
  const [phoneNumber, setPhoneNumber] = useNumberRegex(
    formInitValues.phoneNumber
  );
  const [phoneNumberIsValid, togglePhoneNumberValidation] = useState(true);
  const [
    phoneNumberValidationMessage,
    setPhoneNumberValidationMessage
  ] = useState();

  //New organization
  const [newOrgPrice, setNewOrgPrice] = useState({
    realValue: 0,
    visualValue: ""
  });
  const [newOrgPriceIsValid, setNewOrgPriceIsValid] = useState(true);
  const [
    newOrgPriceValidationMessage,
    setNewOrgPriceValidationMessage
  ] = useState();
  const [orgName, setOrgName] = useState("");
  const [orgNameIsValid, setOrgNameIsValid] = useState(true);
  const [orgNameValidationMessage, setOrgNameValidationMessage] = useState();

  //RE = Real Estate
  const [REPrice, setREPrice] = useState({
    realValue: 0,
    visualValue: ""
  });
  const [REPriceIsValid, setREPriceIsValid] = useState(true);
  const [REPriceValidationMessage, setREPriceValidationMessage] = useState();
  const [REArea, setREArea] = useState();
  const [REAreaIsValid, setREAreaIsValid] = useState(true);
  const [REAreaValidationMessage, setREAreaValidationMessage] = useState();
  const [selectedREType, setSelectedREType] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REUsageCategory, setREUsageCategory] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RETaxationValue, setRETaxationValue] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REAddress, setREAddress] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RECity, setRECity] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [RELink, setRELink] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REDescription, setREDescription] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REFile, setREFile] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [selectedREUsageCategory, setSelectedREUsageCategory] = useState({
    value: [],
    isValid: true,
    eMessage: ""
  });
  const [REPurchaseDescription, setREPurchaseDescription] = useState({
    value: "",
    isValid: true,
    eMessage: ""
  });
  const [REOwnInvestmentAmount, setREOwnInvestmentAmount] = useState({
    value: {
      realValue: 0,
      visualValue: "0"
    },
    isValid: true,
    eMessage: ""
  });
  //email
  const [email, setEmail] = useState(formInitValues.email);
  const [emailIsValid, toggleEmailValidation] = useState(true);
  const [emailValidationMessage, setEmailValidationMessage] = useState();

  //terms
  const [terms, toggleTermsChecked] = useState(false);
  const [termValidation, toggleTermValidation] = useState(false);

  //Form submission
  const [form, setForm] = useState(formInitValues);
  const [verifyingSpinner, toggleVerifyingSpinner] = useState(false);
  const [submitSpinner, toggleSubmitSpinner] = useState(false);
  const [error, setError] = useState();

  //bankId
  const [startResult, setStartResult] = useState();
  const [bankIdResult, setBankIdResult] = useState();

  //Conditional Sections
  const [activeCompanyTypeSelection, setActiveCompanyTypeSelection] = useState(
    false
  );
  const [isNewCompany, setIsNewCompany] = useState(false);
  const [activeRealEstateSection, setActiveRealEstateSection] = useState(false);

  //componentDidMount
  useEffect(() => {
    _loadNeeds();
    return () => {
      didCancel = true;
    };
  }, []);

  //Conditional componentDidUpdate
  useEffect(() => {
    setLoanAmountDisplay(
      loanAmount.toString().replace(numberFormatRegex, "$1 ")
    );
  }, [loanAmount]);

  //Remove need(s) if their category deselected
  useEffect(() => {
    if (selectedLoanReasonsCat && selectedLoanReasonsCat.length) {
      const newLoanReasonsObj = new Object(loanReasons);

      newLoanReasonsObj.forEach(reason => {
        if (selectedLoanReasonsCat.indexOf(reason.category) === -1) {
          reason.selected = false;
        }
      });
      setLoanReasons(newLoanReasonsObj);
      _setLoanReasons(JSON.stringify(newLoanReasonsObj));
    }
  }, [selectedLoanReasonsCat]);
  //Fetch needs from API and load needs
  function _loadNeeds(callBack) {
    getNeedsList()
      .onOk(result => {
        if (!didCancel) {
          if (result) {
            if (result.length > 0) {
              let selected = false;

              //If loanReasons come from Url parameters then select that loanReason by default
              if (p_loanReasons && p_loanReasons.length > 0) {
                const r = p_loanReasons.split(",");
                for (let i = 0; i < r.length; i++) {
                  const l = r[i];
                  for (let j = 0; j < result.length; j++) {
                    const r_l = result[j];
                    if (l === r_l.API_Name) {
                      selected = true;
                      r_l.selected = true;
                      break;
                    }
                  }
                }
              } else {
                if (loanReasons) {
                  for (let i = 0; i < loanReasons.length; i++) {
                    const l = loanReasons[i];
                    for (let j = 0; j < result.length; j++) {
                      const r_l = result[j];
                      if (l.API_Name === r_l.API_Name) {
                        if (l.selected === true) {
                          selected = true;
                          r_l.selected = true;
                          break;
                        }
                      }
                    }
                  }
                }
              }
              if (!selected) {
                let isDefault = false;
                for (let i = 0; i < result.length; i++) {
                  if (result[i].isDefault) {
                    isDefault = true;
                    result[i].selected = true;
                    break;
                  }
                }
                if (!isDefault) {
                  for (let i = 0; i < result.length; i++) {
                    if (result[i].API_Name === "general_liquidity") {
                      result[i].selected = true;
                      break;
                    }
                  }
                }
              }
            }
            //Create reasons' category state from loanReasons
            const cats = [];
            result.forEach(reason => {
              if (cats.indexOf(reason.category) === -1) {
                cats.push(reason.category);
              }
            });
            setLoanReasons(result);
            setLoanReasonsCategories(cats);
            toggleMainSpinner(false);
            //set cookie
            _setLoanReasons(JSON.stringify(result));

            if (typeof callBack === "function") {
              callBack();
            } else {
              toggleMainSpinner(false);
            }
          } else {
            track("Failure", "Loan Application", "/app/loan/ wizard", 0);
            toggleMainSpinner(false);
            changeTab(3);
            setError({
              sender: "needs",
              type: "resultError",
              message: t("NEEDS_RESULT_ERROR")
            });
          }
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          changeTab(3);
          setError({
            sender: "needs",
            type: "serverError",
            message: t("NEEDS_ERROR_500")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          changeTab(3);
          setError({
            sender: "needs",
            type: "Bad Request",
            message: t("NEEDS_ERROR_400")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          changeTab(3);
          setError({
            sender: "needs",
            type: "unAuthorized",
            message: t("NEEDS_ERROR_401")
          });
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          changeTab(3);
          setError({
            sender: "needs",
            type: "notFound",
            message: t("NEEDS_ERROR_404")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleMainSpinner(false);
          changeTab(3);
          setError({
            sender: "needs",
            type: "unKnownError",
            message: t("NEEDS_ERROR_UNKNOWN")
          });
        }
      })
      .call(currentLang);
  }

  //
  /// Callbacks
  //
  const handleLoanAmount = useCallback(
    val => {
      setLoanAmount(val);
      _setLoanAmount(val);
      if (val <= 100000) {
        setLoanAmountStep(5000);
      } else if (val <= 500000) {
        setLoanAmountStep(25000);
      } else if (val <= 1000000) {
        setLoanAmountStep(50000);
      } else {
        setLoanAmountStep(125000);
      }
    },
    [loanAmount]
  );

  const handleLoanPeriod = useCallback(
    val => {
      setLoanPeriod(val);
      _setLoanPeriod(val);
    },
    [loanPeriod]
  );

  const handleMinusLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        let result;
        if (step - loanAmountStep >= loanAmountMin)
          result = step - loanAmountStep;
        else result = loanAmountMin;
        _setLoanAmount(result);
        return result;
      });
    },
    [loanAmount]
  );
  const handleAddLoanAmount = useCallback(
    val => {
      setLoanAmount(step => {
        let result;
        if (step + loanAmountStep <= loanAmountMax)
          result = step + loanAmountStep;
        else result = loanAmountMax;
        _setLoanAmount(result);
        return result;
      });
    },
    [loanAmount]
  );
  const handleMinusLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        let result;
        if (step - loanPeriodStep >= loanPeriodMin)
          result = step - loanPeriodStep;
        else result = loanPeriodMin;
        _setLoanPeriod(result);
        return result;
      });
    },
    [loanPeriod]
  );
  const handleAddLoanPeriod = useCallback(
    val => {
      setLoanPeriod(step => {
        let result;
        if (step + loanPeriodStep <= loanPeriodMax)
          result = step + loanPeriodStep;
        else result = loanPeriodMax;
        _setLoanPeriod(result);
        return result;
      });
    },
    [loanPeriod]
  );
  const handleReasonSelect = useCallback(
    reason => {
      const selectedLoanReasonsArr = Array.from(selectedLoanReasons);
      const idx = selectedLoanReasonsArr.indexOf(reason.API_Name);
      const isSelected = !(idx > -1);

      if (isSelected) {
        selectedLoanReasonsArr.push(reason.API_Name);
      } else {
        selectedLoanReasonsArr.splice(idx, 1);
      }
      if (reason.API_Name === "other") {
        toggleOtherLoanMandatory(isSelected);
        if (!isSelected) {
          setLoanReasonOther("");
          _setLoanReasonOther("");
        }
      }
      // const selected = loanReasons.find(l => l.selected);
      // if (!selected) {
      //   // let isDefault = false;
      //   for (let i = 0; i < rList.length; i++) {
      //     if (rList[i].isDefault) {
      //       // isDefault = true;
      //       rList[i].selected = true;
      //       break;
      //     }
      // }
      // if (!isDefault) {
      //   for (let i = 0; i < rList.length; i++) {
      //     if (rList[i].API_Name === "general_liquidity") {
      //       rList[i].selected = true;
      //       break;
      //     }
      //   }
      // }
      // }
      if (selectedLoanReasonsArr.length === 0) {
        setLoanReasonsIsValid(false);
      } else {
        setLoanReasonsIsValid(true);
      }
      setSelectedLoanReasons(selectedLoanReasonsArr);
      // _setLoanReasons(JSON.stringify(rList));
    },
    [selectedLoanReasons]
  );
  const handleReasonCatSelect = useCallback(
    cat => {
      if (cat) {
        //RES:real estate section,
        //CTS: company type selection ,
        //INC: is new company,
        //ORM: Other reasons mandatory
        let RES = false,
          CTS = false,
          INC = isNewCompany,
          ORM = loanReasonOtherMandatory;
        switch (cat) {
          case "Purchase of Business":
            CTS = true;
            ORM = false;
            break;
          case "Purchase of Real-Estate":
            RES = true;
            ORM = false;
            break;
          default:
        }

        //If reason category changed then deselect all related reasons to the targeted category
        if (selectedLoanReasonsCat !== cat) {
          const _arr = Array.from(loanReasons);
          _arr.map(item => (item.selected = false));
          INC = false;
          setLoanReasons(_arr);
          setSelectedLoanReasons([]);
        }

        //set states
        setSelectedLoanReasonsCat(cat);
        setIsNewCompany(INC);
        setActiveCompanyTypeSelection(CTS);
        setActiveRealEstateSection(RES);
        toggleOtherLoanMandatory(ORM);
      }
    },
    [
      selectedLoanReasonsCat,
      loanReasons,
      isNewCompany,
      loanReasonOtherMandatory
    ]
  );
  const handleOtherReasonChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        toggleOtherReasonValidation(false);
        setOtherReasonValidationMessage(t("OTHER_REASON_IS_REQUIRED"));
      } else {
        toggleOtherReasonValidation(true);
      }
      setLoanReasonOther(e.target.value);
      _setLoanReasonOther(e.target.value);
    },
    [loanReasonOther, appLocale]
  );
  function handlePersonalNumberChanged(e) {
    if (e.target.value.length === 0) {
      togglePersonalNumberValidation(false);
      setPersonalNumberValidationMessage(t("PERSONAL_NUMBER_IS_REQUIRED"));
    } else {
      if (!isBankId(e.target.value)) {
        togglePersonalNumberValidation(false);
        setPersonalNumberValidationMessage(t("PERSONAL_NUMBER_IN_CORRECT"));
      } else {
        togglePersonalNumberValidation(true);
        _setPersonalNumber(e.target.value);
      }
    }
    setPersonalNumber(e.target.value);
  }
  // function handlepersonalNumberChanged(e) {
  //   if (e.target.value.length === 0) {
  //     togglepersonalNumberValidation(false);
  //     setpersonalNumberValidationMessage(t("PERSONAL_NUMBER_IS_REQUIRED"));
  //   } else {
  //     if (!isBankId(e.target.value)) {
  //       togglepersonalNumberValidation(false);
  //       setpersonalNumberValidationMessage(t("PERSONAL_NUMBER_IN_CORRECT"));
  //     } else {
  //       togglepersonalNumberValidation(true);
  //       // _setpersonalNumber(e.target.value);
  //     }
  //   }
  //   setpersonalNumber(e.target.value);
  // }
  function handleEnterKeyPressed(callback, e) {
    const key = e.which || e.key;
    if (key === 13 && callback && typeof callback === "function") callback();
  }
  const handlePhoneNumberChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        togglePhoneNumberValidation(false);
        setPhoneNumberValidationMessage(t("PHONE_NUMBER_IS_REQUIRED"));
      } else {
        if (e.target.value.length < 9) {
          togglePhoneNumberValidation(false);
          setPhoneNumberValidationMessage(t("PHONE_NUMBER_IN_CORRECT"));
        } else togglePhoneNumberValidation(true);
      }
      setPhoneNumber(e.target.value);
      _setPhoneNumber(e.target.value);
    },
    [phoneNumber, appLocale]
  );
  const handleEmailChanged = useCallback(
    e => {
      if (e.target.value.length === 0) {
        toggleEmailValidation(false);
        setEmailValidationMessage(t("EMAIL_IS_REQUIRED"));
      } else {
        if (!validateEmail(e.target.value)) {
          toggleEmailValidation(false);
          setEmailValidationMessage(t("EMAIL_IN_CORRECT"));
        } else toggleEmailValidation(true);
      }
      setEmail(e.target.value);
      _setEmail(e.target.value);
    },
    [email, appLocale]
  );
  let chk;
  const handleTermChanged = useCallback(
    e => {
      toggleTermsChecked(e.target.checked);
      chk = e.target.checked;
      setForm(f => {
        const newForm = { ...f, terms: chk };
        return newForm;
      });
      toggleTermValidation(!chk);
    },
    [terms]
  );
  const handleSelectCompany = useCallback(
    c => {
      setCompany(c);
      if (!companyIsValid) {
        toggleCompanyValidation(true);
      }
    },
    [selectedCompany, companyIsValid]
  );
  const handleCompanyType = useCallback(
    s => {
      setIsNewCompany(s);
      toggleCompanyValidation(true);
      setCompany("new");
    },
    [isNewCompany, companyIsValid, selectedCompany]
  );

  const handleNewOrgPriceChanged = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setNewOrgPrice({
          realValue: 0,
          visualValue: ""
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setNewOrgPrice({
            realValue: _value,
            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
          });
        }
      }
      setNewOrgPriceIsValid(isValid);
      setNewOrgPriceValidationMessage(validationMessage);
    },
    [newOrgPrice, newOrgPriceIsValid, newOrgPriceValidationMessage]
  );
  const handleOrgNameChanged = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";

      if (value.length === 0) {
        isValid = false;
        validationMessage = t("BL_ORGNAME_IS_REQUIRED");
      }
      setOrgName(value);
      setOrgNameIsValid(isValid);
      setOrgNameValidationMessage(validationMessage);
    },
    [orgName, orgNameIsValid, orgNameValidationMessage]
  );
  const handleREAreaChange = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";

      if (value.length === 0) {
        isValid = false;
        validationMessage = t("BL_REALESTATE_AREA_IS_REQUIRED");
      }
      setREArea(value);
      setREAreaIsValid(isValid);
      setREAreaValidationMessage(validationMessage);
    },
    [REArea, REPriceIsValid, REAreaValidationMessage]
  );
  const handleREPriceChanged = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setREPrice({
          realValue: 0,
          visualValue: ""
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setREPrice({
            realValue: _value,
            visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
          });
        }
      }
      setREPriceIsValid(isValid);
      setREPriceValidationMessage(validationMessage);
    },
    [REPrice, REPriceIsValid, REPriceValidationMessage]
  );

  const handleREType = useCallback(
    e => {
      const { value } = e.target;
      let _newOpt = "";
      let isValid = true;
      let eMessage = "";
      if (selectedREType !== value) {
        _newOpt = value;
      }
      if (
        !selectedREType ||
        (Array.isArray(selectedREType) && selectedREType.length === 0)
      ) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setSelectedREType({
        value: _newOpt,
        isValid: isValid,
        eMessage: eMessage
      });
    },
    [selectedREType]
  );

  // const handleREUsageCategoryOpts = useCallback(
  //   e => {
  //     let _newOpts = Array.from(selectedREUsageCategoryOpts);

  //     if (selectedREUsageCategoryOpts.indexOf(e) > -1) {
  //       _newOpts.splice(_newOpts.indexOf(e), 1);
  //     } else {
  //       _newOpts.push(e);
  //     }

  //     setSelectedREUsageCategoryOpts(_newOpts);
  //   },
  //   [selectedREUsageCategoryOpts]
  // );
  const handleREUsageCategory = useCallback(
    e => {
      let _newOpts = Array.from(selectedREUsageCategory.value);
      let eMessage = "";
      let isValid = true;
      if (selectedREUsageCategory.value.indexOf(e) > -1) {
        _newOpts.splice(_newOpts.indexOf(e), 1);
      } else {
        _newOpts.push(e);
      }
      if (_newOpts.length === 0) {
        eMessage = t("MANDATORY_FIELD");
        isValid = false;
      }
      setSelectedREUsageCategory({
        isValid: isValid,
        eMessage: eMessage,
        value: _newOpts
      });
    },
    [selectedREUsageCategory]
  );
  const handleRETaxationValue = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setRETaxationValue({
          isValid: isValid,
          eMessage: validationMessage,
          value: { realValue: 0, visualValue: "" }
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setRETaxationValue({
            isValid: isValid,
            eMessage: validationMessage,
            value: {
              realValue: _value,
              visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
            }
          });
        }
      }
    },
    [RETaxationValue]
  );
  const handleREAddress = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setREAddress({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REAddress]
  );
  const handleRECity = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setRECity({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [RECity]
  );
  const handleRELink = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setRELink({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [RELink]
  );
  const handleREDescription = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setREDescription({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REDescription]
  );
  const handleREFile = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      setREFile({ isValid: isValid, eMessage: eMessage, value: value });
    },
    [REFile]
  );
  const handleREOwnInvestmentAmount = useCallback(
    e => {
      const { value } = e.target;
      let isValid = true,
        validationMessage = "";
      let _value = "";

      if (!value || value.length === 0 || value === 0) {
        isValid = false;
        validationMessage = t("PRICE_IS_REQUIRED");
        setREOwnInvestmentAmount({
          value: {
            realValue: 0,
            visualValue: ""
          },
          isValid: isValid,
          eMessage: validationMessage
        });
      } else {
        _value = value.replace(/\s/g, "");
        if (Number(_value)) {
          isValid = true;
          validationMessage = "";
          setREOwnInvestmentAmount({
            value: {
              realValue: _value,
              visualValue: _value && _value.replace(numberFormatRegex, "$1 ")
            },
            isValid: isValid,
            eMessage: validationMessage
          });
        }
      }
    },
    [REOwnInvestmentAmount]
  );
  const handleREPurchaseDescription = useCallback(
    e => {
      let { value, name } = e.target;
      let isValid = true;
      let eMessage = "";
      if (!value || value.length === 0) {
        isValid = false;
        eMessage = t("MANDATORY_FIELD");
      }
      setREPurchaseDescription({
        isValid: isValid,
        eMessage: eMessage,
        value: value
      });
    },
    [REPurchaseDescription]
  );
  //
  ////// Handlers
  //
  function getComponiesWithoutBankId(callBack) {
    if (!verifyingSpinner) {
      let isValid = true;

      if (loanReasonOtherMandatory) {
        if (!loanReasonOther || loanReasonOther.length === 0) {
          isValid = false;
          handleOtherReasonChanged({
            target: { value: "" }
          });
        }
      }

      if (!personalNumber) {
        isValid = false;
        handlePersonalNumberChanged({
          target: { value: personalNumber ? personalNumber : "" }
        });
      }

      if (!loanReasonsIsValid) {
        isValid = false;
        setLoanReasonsValidationMessage(t("BL_LOANREASON_IS_REQUIRED"));
      }

      if (isValid) {
        if (personalNumberIsValid) {
          toggleVerifyingSpinner(true);
          let pId = personalNumber.replace("-", "");
          if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
          getCompanies()
            .onOk(result => {
              if (!didCancel) {
                const { companies, user_info } = result;
                // save result in session storage to use in customer portal
                // Cookies.set("@ponture-customer-portal/token", result);
                // if (window.analytics)
                //   window.analytics.track("BankID Verification", {
                //     category: "Loan Application",
                //     label: "/app/loan/ bankid popup",
                //     value: 0
                //   });
                // setLastName(user_info.last_name);
                setLastName(user_info.surName);
                toggleVerifyingSpinner(false);
                setStartResult(companies);
                setCompanies(companies);
                setUserIsVerified(true);
                // toggleVerifyModal(true);
              }
            })
            .onServerError(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .onBadRequest(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .unAuthorized(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .unKnownError(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .call(personalNumber);
        }
      }
    }
  }

  function handleBankIdClicked(e) {
    if (!verifyingSpinner) {
      let isValid = true;
      if (loanReasonOtherMandatory) {
        if (!loanReasonOther || loanReasonOther.length === 0) {
          isValid = false;
          handleOtherReasonChanged({
            target: { value: "" }
          });
        }
      }
      if (!personalNumber) {
        isValid = false;
        handlePersonalNumberChanged({
          target: { value: personalNumber ? personalNumber : "" }
        });
      }
      if (!loanReasonsIsValid) {
        isValid = false;
        setLoanReasonsValidationMessage(t("BL_LOANREASON_IS_REQUIRED"));
      }

      if (isValid) {
        if (personalNumberIsValid) {
          toggleVerifyingSpinner(true);
          let pId = personalNumber.replace("-", "");
          if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
          startBankId()
            .onOk(result => {
              if (!didCancel) {
                // save result in session storage to use in customer portal
                Cookies.set("@ponture-customer-portal/token", result);
                if (window.analytics)
                  window.analytics.track("BankID Verification", {
                    category: "Loan Application",
                    label: "/app/loan/ bankid popup",
                    value: 0
                  });
                toggleVerifyingSpinner(false);
                setStartResult(result);
                toggleVerifyModal(true);
              }
            })
            .onServerError(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .onBadRequest(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .unAuthorized(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .unKnownError(result => {
              if (!didCancel) {
                toggleVerifyingSpinner(false);
                changeTab(3);
                setError({
                  sender: "verifyBankId"
                });
              }
            })
            .call(pId);
        }
      }
    }
  }
  function handleSubmitClicked() {
    if (!submitSpinner) {
      let isValid = true;
      let obj = {};
      if (!personalNumber || personalNumber.length < 9) {
        isValid = false;
        handlePersonalNumberChanged({
          target: { value: personalNumber ? personalNumber : "" }
        });
      }
      if (
        loanReasonOtherMandatory &&
        (!loanReasonOther || loanReasonOther.length === 0)
      ) {
        isValid = false;
        handleOtherReasonChanged({
          target: { value: loanReasonOther ? loanReasonOther : "" }
        });
      }
      if (!phoneNumber || phoneNumber.length < 9) {
        isValid = false;
        handlePhoneNumberChanged({
          target: { value: phoneNumber ? phoneNumber : "" }
        });
      }
      if (!email || email.length === 0 || !validateEmail(email)) {
        isValid = false;
        handleEmailChanged({
          target: { value: email ? email : "" }
        });
      }
      if (companies && companies.length > 0 && !selectedCompany) {
        isValid = false;
        if (!selectedCompany) toggleCompanyValidation(false);
      }
      if (!terms) {
        isValid = false;
        toggleTermValidation(!form["terms"]);
      }
      if (activeCompanyTypeSelection) {
        if (!orgName || orgName.length === 0) {
          isValid = false;
          handleOrgNameChanged({
            target: { value: orgName ? orgName : "" }
          });
        }
        if (!newOrgPrice.realValue || newOrgPrice.realValue.length === 0) {
          isValid = false;
          handleNewOrgPriceChanged({
            target: { value: newOrgPrice ? newOrgPrice.realValue : 0 }
          });
        }
        obj = {
          ...obj,
          acquisition: {
            object_price: String(newOrgPrice.realValue),
            object_company_name: orgName,
            object_name: orgName,
            object_organization_number: selectedCompany
              ? selectedCompany.companyId
              : "",
            object_industry: "",
            object_annual_report: "",
            object_balance_sheet: "",
            object_income_statement: "",
            object_valuation_letter: "",
            account_balance_sheet: "",
            account_income_statement: "",
            available_guarantees: "",
            available_guarantees_description: "",
            purchaser_profile: "",
            own_investment_amount: "0",
            own_investment_details: "",
            additional_files: [],
            business_plan: [],
            additional_details: "",
            purchase_type: "",
            description: loanReasons.filter(
              loan => loan.API_Name === selectedLoanReasons[0]
            )[0].Label //needs change
          }
        };
      }

      //Company acquisition fields
      if (activeRealEstateSection) {
        if (!REArea || REArea.length === 0) {
          isValid = false;
          handleREAreaChange({
            target: { value: REArea ? REArea : "" }
          });
        }
        if (!REPrice.realValue || REPrice.realValue.length === 0) {
          isValid = false;
          handleREPriceChanged({
            target: { value: REPrice ? REPrice.realValue : 0 }
          });
        }
        if (!selectedREType.value || selectedREType.value.length === 0) {
          isValid = false;
          setSelectedREType({
            value: "",
            isValid: false,
            eMessage: t("MANDATORY_FIELD")
          });
          // handleREType({
          //   target: { value: selectedREType.value ? selectedREType.value : "" }
          // });
        }
        if (
          !selectedREUsageCategory.value ||
          selectedREUsageCategory.value.length === 0
        ) {
          isValid = false;
          setSelectedREUsageCategory({
            value: [],
            isValid: false,
            eMessage: t("MANDATORY_FIELD")
          });
          // handleREUsageCategory({
          //   target: {
          //     value: selectedREUsageCategory.value.length
          //       ? selectedREUsageCategory.value
          //       : []
          //   }
          // });
        }
        if (!RETaxationValue.value || RETaxationValue.value.length === 0) {
          isValid = false;
          handleRETaxationValue({
            target: {
              value: RETaxationValue.value ? RETaxationValue.value : ""
            }
          });
        }
        if (!REAddress.value || REAddress.value.length === 0) {
          isValid = false;
          handleREAddress({
            target: { value: REAddress.value ? REAddress.value : "" }
          });
        }
        if (!RECity.value || RECity.value.length === 0) {
          isValid = false;
          handleRECity({
            target: { value: RECity.value ? RECity.value : "" }
          });
        }
        // if (!RELink.value || RELink.value.length === 0) {
        //   isValid = false;
        //   handleREAddress({
        //     target: { value: RELink.value ? RELink.value : "" }
        //   });
        // }
        if (!REDescription.value || REDescription.value.length === 0) {
          isValid = false;
          handleREDescription({
            target: { value: REDescription.value ? REDescription.value : "" }
          });
        }

        if (
          !REOwnInvestmentAmount.value.realValue ||
          REOwnInvestmentAmount.value.realValue.length === 0
        ) {
          isValid = false;
          handleREOwnInvestmentAmount({
            target: {
              value: REOwnInvestmentAmount.value.realValue
                ? REOwnInvestmentAmount.value.realValue
                : ""
            }
          });
        }
        if (
          !REPurchaseDescription.value ||
          REPurchaseDescription.value.length === 0
        ) {
          isValid = false;
          handleREPurchaseDescription({
            target: {
              value: REPurchaseDescription.value
                ? REPurchaseDescription.value
                : ""
            }
          });
        }
        // if (!REFile.value || REFile.value.lengt === 0) {
        //   isValid = false;
        //   handleREFile({
        //     target: { value: REFile.value ? REFile.value : "" }
        //   });
        // }
        obj = {
          ...obj,
          real_estate: {
            real_estate_size: REArea,
            real_estate_price: String(REPrice.realValue),
            real_estate_type: selectedREType.value,
            real_estate_usage_category: selectedREUsageCategory.value,
            real_estate_taxation_value: String(RETaxationValue.value.realValue),
            real_estate_address: REAddress.value,
            real_estate_city: RECity.value,
            real_estate_link: RELink.value,
            real_estate_description: REDescription.value,
            real_estate_document: REFile.value,
            description: REPurchaseDescription.value,
            additional_details: "",
            own_investment_amount: String(REOwnInvestmentAmount.value.realValue)
          }
        };
      }
      if (isValid) {
        toggleSubmitSpinner(true);
        let needs = selectedLoanReasons;
        let pId = personalNumber.replace("-", "");
        if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
        obj = {
          ...obj,
          orgNumber: selectedCompany ? selectedCompany.companyId : "",
          orgName: selectedCompany ? selectedCompany.companyName : "",
          personalNumber: pId,
          amount: parseInt(loanAmount),
          amourtizationPeriod: parseInt(loanPeriod),
          need: needs,
          needDescription: loanReasonOther,
          email: email,
          phoneNumber: phoneNumber,
          oppId: "",
          lastName: lastName ? lastName : ""
        };

        if (p_userRole === "customer") {
          obj = {
            ...obj,
            bankid: bankIdResult
          };
        }
        if (p_userRole === "agent") {
          obj = {
            ...obj,
            broker_id: brokerId
          };
        }

        try {
          const r = JSON.parse(referral_params);
          if (r.utm_source) {
            obj["utm_source"] = r.utm_source;
          }
          if (r.utm_medium) {
            obj["utm_medium"] = r.utm_medium;
          }
          if (r.utm_campaign) {
            obj["utm_campaign"] = r.utm_campaign;
          }
          if (r.referral_id) {
            obj["referral_id"] = r.referral_id;
          }
          if (r.last_referral_date) {
            obj["last_referral_date"] = r.last_referral_date;
          }
        } catch (error) {}

        //Api error function
        const ApiErrorCallback = result => {
          if (!didCancel) {
            toggleSubmitSpinner(false);
            changeTab(3);
            setError({
              sender: "submitLoan"
            });
          }
        };
        if (
          p_userRole === "agent" ||
          (p_userRole === "customer" &&
            (activeCompanyTypeSelection || activeRealEstateSection))
        ) {
          saveLoan(p_userRole)
            .onOk(result => {
              if (!didCancel) {
                if (result.errors && result.length > 0) {
                  if (window.analytics)
                    window.analytics.track("Failure", {
                      category: "Loan Application",
                      label: "/app/loan/ wizard",
                      value: 0
                    });
                  changeTab(3);
                  setError({
                    sender: "submitLoan"
                  });
                } else {
                  resetForm();
                  if (window.analytics)
                    window.analytics.track("Create", {
                      category: "Loan Application",
                      label: "/app/loan/ wizard",
                      value: loanAmount
                    });
                  changeTab(2);
                }
              }
            })
            .unKnownError(ApiErrorCallback)
            .unAuthorized(ApiErrorCallback)
            .onBadRequest(ApiErrorCallback)
            .call(obj);
        }
        if (
          p_userRole === "customer" &&
          !activeCompanyTypeSelection &&
          !activeRealEstateSection
        ) {
          submitLoan()
            .onOk(result => {
              if (!didCancel) {
                if (result.errors) {
                  if (window.analytics)
                    window.analytics.track("Failure", {
                      category: "Loan Application",
                      label: "/app/loan/ wizard",
                      value: 0
                    });
                  changeTab(3);
                  setError({
                    sender: "submitLoan"
                  });
                } else {
                  resetForm();
                  if (window.analytics)
                    window.analytics.track("Submit", {
                      category: "Loan Application",
                      label: "/app/loan/ wizard",
                      value: loanAmount
                    });
                  changeTab(2);
                }
              }
            })
            .unKnownError(ApiErrorCallback)
            .unAuthorized(ApiErrorCallback)
            .onBadRequest(ApiErrorCallback)
            .call(obj);
        }
      }
    }
  }

  function resetForm() {
    _setLoanAmount();
    _setLoanPeriod();
    _setLoanReasonOther();
    _setLoanReasons();
    _setPersonalNumber();
  }
  function backtoLoan() {
    window.location.href = "https://www.ponture.com/";
  }
  function refreshPage() {
    window.location.href = window.location.href; //.split("?")[0];
  }
  function openMyApps() {
    if (brokerId) {
      props.history.push({
        pathname: "/app/panel/myApplications",
        search: "?brokerid=" + brokerId
      });
    } else {
      const pId = personalNumber.replace("-", "");
      props.history.push("/app/panel/myApplications?customerid="+pId);
    }
  }

  //After bankId
  function handleCloseVerifyModal(isSuccess, result, bIdResult) {
    toggleVerifyModal(false);
    if (isSuccess) {
      const { companies, user_info } = result;
      if (companies && companies.length > 0) {
        dispatch({
          type: "TOGGLE_B_L_MORE_INFO",
          value: true
        });
        // save bank id result to us ein customer
        dispatch({
          type: "VERIFY_BANK_ID_SUCCESS",
          payload: bIdResult
        });
        sessionStorage.setItem(
          "@ponture-customer-bankid",
          JSON.stringify(bIdResult)
        );
        setBankIdResult(bIdResult);
        setCompanies(companies);
        setLastName(user_info.surName);
      } else {
        toggleMainSpinner(false);
        changeTab(3);
        setError({
          sender: "companies",
          type: "loadData",
          message: t("COMPANIES_IN_VALID_DATA")
        });
      }
    } else if (isSuccess === false) {
      changeTab(3);
      setError({
        sender: "submitLoan"
      });
    }
  }
  function handleCancelVerify() {
    toggleVerifyModal(false);
    if (window.analytics)
      window.analytics.track("BankID Failed", {
        category: "Loan Application",
        label: "/app/loan/ bankid popup",
        value: 0
      });
    cancelVerify()
      .onOk(result => {
        setUserIsVerified(false);
      })
      .onServerError(result => {
        if (!didCancel) {
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
        }
      })
      .call(startResult.orderRef);
  }
  function handleSuccessBankId(result) {
    if (result.progressStatus === "COMPLETE") {
      setUserIsVerified(true);
    }
  }
  function handleLogoClicked() {
    window.open("https://www.ponture.com", "_blank");
  }

  //
  return (
    <div className="bl">
      <div className="bl__header">
        <div
          className="bl__logo"
          onClick={handleLogoClicked}
          style={{ cursor: "pointer" }}
        >
          <img src={require("../../assets/logo-c.png")} alt="logo" />
        </div>
      </div>
      {mainSpinner ? (
        <div className="bl__loading">
          <div className="loading">
            <div className="square square-a state1a" />
            <div className="square square-a state2a" />
            <div className="square square-a state3a" />
            <div className="square square-a state4a" />
          </div>
          <h2>{t("LOADING_TEXT")}</h2>
        </div>
      ) : (
        <div className="bl__content">
          <div className="bl__form">
            {tab === 1 && (
              <>
                {/* Start: Apply loan section */}
                <div className="bl__mainform">
                  <div className="bl__form__header">
                    <div className="bl__form__circleIcon">
                      <i className="icon-request" />
                    </div>
                    <span>{t("BISINUSS_LOAN")}</span>
                  </div>
                  <div className="bl__input --sliderInput animated fadeIn">
                    <div className="bl__input__header">
                      <label className="bl__input__label bl__input__sliderLabel">
                        {t("BL_LOAN_AMOUNT")}
                      </label>
                      <span className="bl__input__label bl__input__sliderLabel loanAmountValue">
                        {loanAmountDisplay + " kr"}
                      </span>
                    </div>
                    <div className="bl__rangeElement">
                      <div
                        className="rangeElement__left"
                        onClick={handleMinusLoanAmount}
                      >
                        <span className="icon-minus" />
                      </div>
                      <div className="rangeElement__center">
                        <InputRange
                          formatLabel={value => `${value} kr`}
                          step={loanAmountStep}
                          track="slider"
                          maxValue={loanAmountMax}
                          minValue={loanAmountMin}
                          value={loanAmount}
                          onChange={handleLoanAmount}
                        />
                        <div className="rangeElement__custom-labels">
                          <span className="min">
                            {separateNumberByChar(loanAmountMin) + " kr"}
                          </span>
                          <span className="max">
                            {separateNumberByChar(loanAmountMax) + " kr"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="rangeElement__right"
                        onClick={handleAddLoanAmount}
                      >
                        <span className="icon-add" />
                      </div>
                    </div>
                  </div>
                  <div className="bl__input --sliderInput animated fadeIn">
                    <div className="bl__input__header">
                      <label className="bl__input__label bl__input__sliderLabel">
                        {t("BL_LOAN_PERIOD")}
                      </label>
                      <span className="bl__input__label bl__input__sliderLabel loanAmountValue">
                        {(loanPeriod === loanPeriodMax
                          ? "+" + loanPeriod
                          : loanPeriod) +
                          " " +
                          (loanPeriod == 1 ? t("MONTH") : t("MONTHS"))}
                      </span>
                    </div>
                    <div className="bl__rangeElement">
                      <div
                        className="rangeElement__left"
                        onClick={handleMinusLoanPeriod}
                      >
                        <span className="icon-minus" />
                      </div>
                      <div className="rangeElement__center">
                        <InputRange
                          formatLabel={value => {
                            return `${
                              value === loanPeriodMax ? "+" + value : value
                            } 
                            ${t("MON")}`;
                          }}
                          step={loanPeriodStep}
                          maxValue={loanPeriodMax}
                          minValue={loanPeriodMin}
                          value={loanPeriod}
                          onChange={handleLoanPeriod}
                        />
                        <div className="rangeElement__custom-labels">
                          <span className="min">
                            {separateNumberByChar(loanPeriodMin) + " mån"}
                          </span>
                          <span className="max">
                            {"+" + separateNumberByChar(loanPeriodMax) + " mån"}
                          </span>
                        </div>
                      </div>
                      <div
                        className="rangeElement__right"
                        onClick={handleAddLoanPeriod}
                      >
                        <span className="icon-add" />
                      </div>
                    </div>
                  </div>
                  <div className="bl__input animated fadeIn">
                    <label className="bl__input__label">
                      {t("BL_REASON_LOAN")}
                      <span>{t("BL_REASON_LOAN_INFO")}</span>
                    </label>
                    <div
                      className="options options__category"
                      style={{ margin: "auto -8px" }}
                    >
                      {loanReasonsCategories.length > 0 &&
                        loanReasonsCategories.map((cat, idx) => {
                          const selected = cat === selectedLoanReasonsCat;
                          return (
                            <div
                              key={idx}
                              className={
                                "btnReason " + (selected ? "--active" : "")
                              }
                              onClick={() => handleReasonCatSelect(cat)}
                            >
                              <div className="btnReason__title">{cat}</div>
                            </div>
                          );
                        })}
                    </div>
                    <br />
                    {selectedLoanReasonsCat && (
                      <div className="options" style={{ margin: "auto -8px" }}>
                        {loanReasons &&
                          loanReasons.map(r => {
                            if (r.category === selectedLoanReasonsCat) {
                              const isSelected =
                                selectedLoanReasons.indexOf(r.API_Name) > -1;
                              return (
                                <div
                                  key={r.API_Name}
                                  className={
                                    "btnReason " +
                                    (isSelected ? "--active" : "")
                                  }
                                  onClick={() => handleReasonSelect(r)}
                                >
                                  <div className="btnReason__title">
                                    {r.Label}
                                  </div>
                                  {isSelected && (
                                    <div className="btnReason__active">
                                      <span className="icon-checkmark" />
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          })}
                      </div>
                    )}
                    {!loanReasonsIsValid && (
                      <span className="validation-messsage">
                        {loanReasonsValidationMessage}
                      </span>
                    )}
                  </div>

                  <div
                    className={
                      "bl__input animated fadeIn " +
                      (loanReasonOtherMandatory && !otherReasonIsValid
                        ? "--invalid"
                        : "")
                    }
                  >
                    <label className="bl__input__label">
                      {t("BL_REASON_LOAN_OTHER")}
                    </label>
                    <div className="bl__input__element">
                      <div className="element-group">
                        <div className="element-group__center">
                          <input
                            type="text"
                            className="my-input"
                            value={loanReasonOther}
                            onChange={handleOtherReasonChanged}
                          />
                        </div>
                      </div>
                      {loanReasonOtherMandatory && !otherReasonIsValid && (
                        <span className="validation-messsage">
                          {otherReasonValidationMessage}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Start: Personal number section */}
                  {p_userRole === "agent" ? (
                    <div
                      className={
                        "bl__input animated fadeIn " +
                        (!personalNumber ? "--invalid" : "")
                      }
                    >
                      <label className="bl__input__label">
                        {t("BL_PERSONAL_NUMBER")}
                        <span>{t("BL_PERSONAL_NUMBER_INFO")}</span>
                      </label>
                      <div className="bl__input__element">
                        <div className="element-group">
                          <div className="element-group__center --inline">
                            <input
                              type="text"
                              className="my-input"
                              placeholder={t("PERSONAL_NUMBER_PLACEHOLDER")}
                              value={personalNumber}
                              onChange={handlePersonalNumberChanged}
                              maxLength="13"
                              disabled={userIsVerified ? true : false}
                              onKeyDown={e =>
                                handleEnterKeyPressed(
                                  getComponiesWithoutBankId,
                                  e
                                )
                              }
                            />
                            {!userIsVerified && (
                              <button
                                className="btn --success --small --right"
                                onClick={getComponiesWithoutBankId}
                              >
                                {verifyingSpinner && (
                                  <CircleSpinner show={true} size="small" />
                                )}
                                {!verifyingSpinner && (
                                  <span>{t("VERIFY")}</span>
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        {lastName && (
                          <span
                            style={{
                              display: "block",
                              marginTop: "10px",
                              color: "black",
                              fontSize: "14px",
                              paddingLeft: "1px"
                            }}
                            className="extra-info"
                          >
                            <strong>Name: {lastName}</strong>
                          </span>
                        )}
                        {!personalNumberIsValid && (
                          <span className="validation-messsage">
                            {personalNumberValidationMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={
                        "bl__input animated fadeIn " +
                        (!personalNumberIsValid ? "--invalid" : "")
                      }
                    >
                      <label className="bl__input__label">
                        {t("BL_PERSONAL_NUMBER")}
                        <span>{t("BL_PERSONAL_NUMBER_INFO")}</span>
                      </label>
                      <div className="bl__input__element">
                        <div className="element-group">
                          <div className="element-group__center">
                            <input
                              type="text"
                              className="my-input"
                              placeholder={t("PERSONAL_NUMBER_PLACEHOLDER")}
                              value={personalNumber}
                              onChange={handlePersonalNumberChanged}
                              maxLength="13"
                              disabled={
                                b_loan_moreInfo_visibility ? true : false
                              }
                              onKeyDown={e =>
                                handleEnterKeyPressed(handleBankIdClicked, e)
                              }
                            />
                          </div>
                        </div>
                        {!personalNumberIsValid && (
                          <span className="validation-messsage">
                            {personalNumberValidationMessage}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {/* End: Personal number section */}
                  {!b_loan_moreInfo_visibility && p_userRole === "customer" && (
                    <button
                      className="btn --success --large bankIdBtn"
                      onClick={handleBankIdClicked}
                      onKeyDown={e =>
                        handleEnterKeyPressed(handleBankIdClicked, e)
                      }
                    >
                      {verifyingSpinner && (
                        <CircleSpinner show={true} size="small" />
                      )}
                      {!verifyingSpinner && (
                        <span>{t("BL_VERIFY_PID_BTN")}</span>
                      )}
                    </button>
                  )}

                  {/* Start: companies list */}
                  {companies && companies.length > 0 && (
                    <div className="bl__input animated fadeIn">
                      <label className="bl__input__label">
                        {t("BL_COMPANY")}
                      </label>
                      <div className="options" style={{ margin: "auto -8px" }}>
                        {activeCompanyTypeSelection && (
                          <div className="newCompanyRadioBox">
                            <label className="customCheckbox">
                              <input
                                type="radio"
                                name="isNewCompany"
                                defaultChecked
                                onClick={() => handleCompanyType(false)}
                              />
                              <span className="checkmark" />
                              <span className="customCheckbox__text">
                                {t("BL_SELECT_COMPANY")}
                              </span>
                            </label>
                            <label className="customCheckbox">
                              <input
                                type="radio"
                                name="isNewCompany"
                                onClick={() => handleCompanyType(true)}
                              />
                              <span className="checkmark" />
                              <span className="customCheckbox__text">
                                {t("BL_NEW_COMPANY")}
                              </span>
                            </label>
                          </div>
                        )}
                        {companies.map(c => (
                          <div
                            key={c.companyId}
                            className={classnames(
                              "companyWidget",
                              selectedCompany &&
                                selectedCompany.companyId === c.companyId
                                ? "--active"
                                : "",
                              isNewCompany && "disabled"
                            )}
                            onClick={() =>
                              !isNewCompany && handleSelectCompany(c)
                            }
                            title={c.companyName}
                          >
                            <div className="companyWidget__cName">
                              {c.companyName}
                            </div>
                            <span className="companyWidget__orgNumber">
                              {c.companyId}
                            </span>
                            {selectedCompany &&
                              selectedCompany.companyId === c.companyId && (
                                <div className="companyWidget__active">
                                  <span className="icon-checkmark" />
                                </div>
                              )}
                          </div>
                        ))}
                      </div>
                      {!companyIsValid && (
                        <span className="validation-messsage">
                          {t("COMAPNIES_REQUIRED_ERROR")}
                        </span>
                      )}
                    </div>
                  )}
                  {/* End: Companies list */}
                </div>
                {/* End: apply loan section */}

                {/* Start: new company info section*/}
                {userIsVerified && activeCompanyTypeSelection && (
                  <div className="bl__infoBox">
                    <div className="bl__infoBox__header">
                      <div className="bl__infoBox__circleIcon">
                        <i className="icon-info" />
                      </div>
                      <span>{t("BL_COMPANY_INFO")}</span>
                    </div>
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!orgNameIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_ORG_NAME")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder=""
                                value={orgName}
                                onChange={handleOrgNameChanged}
                              />
                            </div>
                          </div>
                          {!orgNameIsValid && (
                            <span className="validation-messsage">
                              {orgNameValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!newOrgPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={newOrgPrice.visualValue}
                                onChange={handleNewOrgPriceChanged}
                              />
                            </div>
                          </div>
                          {!newOrgPriceIsValid && (
                            <span className="validation-messsage">
                              {newOrgPriceValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <br />
                  </div>
                )}
                {/* End:  new company info */}

                {/* Start: Real estate section */}
                {userIsVerified && activeRealEstateSection && (
                  <div className="bl__infoBox">
                    <div className="bl__infoBox__header">
                      <div className="bl__infoBox__circleIcon">
                        <i className="icon-info" />
                      </div>
                      <span>{t("BL_REALESTATE_INFO")}</span>
                    </div>
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!selectedREType.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ marginBottom: "0" }}
                        >
                          {t("BL_REALESTATE_USAGE_CATEGORY")}
                        </label>
                        <div style={{ margin: "auto -8px" }}>
                          {/* <div className="element-group"> */}
                          <div className="element-group__center">
                            <div className="options">
                              {RETypeOpts.length > 0 &&
                                RETypeOpts.map((opt, idx) => {
                                  const isSelected =
                                    opt === selectedREType.value;
                                  return (
                                    <div
                                      key={idx}
                                      className={
                                        "btnReason " +
                                        (isSelected ? "--active" : "")
                                      }
                                      onClick={() =>
                                        handleREType({ target: { value: opt } })
                                      }
                                    >
                                      <div className="btnReason__title">
                                        {opt}
                                      </div>
                                      {isSelected && (
                                        <div className="btnReason__active">
                                          <span className="icon-checkmark" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                            {/* </div> */}
                          </div>
                          {!selectedREType.isValid && (
                            <span
                              className="validation-messsage"
                              style={{ paddingLeft: "10px" }}
                            >
                              {selectedREType.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REAreaIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_SIZE")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="number"
                                className="my-input"
                                placeholder="Sqm"
                                value={REArea}
                                onChange={handleREAreaChange}
                              />
                            </div>
                          </div>
                          {!REAreaIsValid && (
                            <span className="validation-messsage">
                              {REAreaValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPriceIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_PRICE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REPrice.visualValue}
                                onChange={handleREPriceChanged}
                              />
                            </div>
                          </div>
                          {!REPriceIsValid && (
                            <span className="validation-messsage">
                              {REPriceValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!selectedREUsageCategory.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ marginBottom: "0" }}
                        >
                          {t("BL_REALESTATE_USAGE_CATEGORY")}
                        </label>
                        <div style={{ margin: "auto -8px" }}>
                          {/* <div className="element-group"> */}
                          <div className="element-group__center">
                            <div className="options">
                              {REUsageCategoryOpts.length > 0 &&
                                REUsageCategoryOpts.map((opt, idx) => {
                                  const isSelected =
                                    selectedREUsageCategory.value.indexOf(opt) >
                                    -1;
                                  return (
                                    <div
                                      key={idx}
                                      className={
                                        "btnReason " +
                                        (isSelected ? "--active" : "")
                                      }
                                      onClick={() => handleREUsageCategory(opt)}
                                    >
                                      <div className="btnReason__title">
                                        {opt}
                                      </div>
                                      {isSelected && (
                                        <div className="btnReason__active">
                                          <span className="icon-checkmark" />
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                            {/* </div> */}
                          </div>
                          {!selectedREUsageCategory.isValid && (
                            <span
                              className="validation-messsage"
                              style={{ paddingLeft: "10px" }}
                            >
                              {selectedREUsageCategory.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!RETaxationValue.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_TAXATION_VALUE") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={RETaxationValue.value.visualValue}
                                onChange={handleRETaxationValue}
                              />
                            </div>
                          </div>
                          {!RETaxationValue.isValid && (
                            <span className="validation-messsage">
                              {RETaxationValue.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REAddress.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_ADDRESS")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={REAddress.value}
                                onChange={handleREAddress}
                              />
                            </div>
                          </div>
                          {!REAddress.isValid && (
                            <span className="validation-messsage">
                              {REAddress.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!RECity.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_CITY")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={RECity.value}
                                onChange={handleRECity}
                              />
                            </div>
                          </div>
                          {!RECity.isValid && (
                            <span className="validation-messsage">
                              {RECity.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!RELink.isValid ? "--invalid" : "")
                        }
                      >
                        <label
                          className="bl__input__label"
                          style={{ fontSize: "12px", lineHeight: "1.84" }}
                        >
                          {t("BL_REALESTATE_LINK")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={RELink.value}
                                onChange={handleRELink}
                              />
                            </div>
                          </div>
                          {!RELink.isValid && (
                            <span className="validation-messsage">
                              {RELink.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REDescription.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_DESCRIPTION")}
                        </label>
                        <div className="bl__input__element">
                          {/* <div className="element-group">
                             <div className="element-group__center"> */}
                          <textarea
                            className="my-input"
                            value={REDescription.value}
                            onChange={handleREDescription}
                            style={{
                              maxWidth: "100%",
                              minWidth: "100%",
                              border: "1px solid lightgrey",
                              minHeight: "100px",
                              padding: "10px"
                            }}
                          ></textarea>
                          {/* </div>
                          </div> */}
                          {!REDescription.isValid && (
                            <span className="validation-messsage">
                              {REDescription.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REOwnInvestmentAmount.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_OWN_INVESTMENT_AMOUNT") + " (Kr)"}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="3 000 000"
                                value={REOwnInvestmentAmount.value.visualValue}
                                onChange={handleREOwnInvestmentAmount}
                              />
                            </div>
                          </div>
                          {!REOwnInvestmentAmount.isValid && (
                            <span className="validation-messsage">
                              {REOwnInvestmentAmount.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REPurchaseDescription.isValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_PURCHASE_DESCRIPTION")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                value={REPurchaseDescription.value}
                                onChange={handleREPurchaseDescription}
                              />
                            </div>
                          </div>
                          {!REPurchaseDescription.isValid && (
                            <span className="validation-messsage">
                              {REPurchaseDescription.eMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <br />
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!REFile ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_REALESTATE_FILE")}
                        </label>
                        {/* <div className="bl__input__element"> */}
                        <div
                          className="element-group"
                          style={{ margin: "auto -8px" }}
                        >
                          <div className="element-group__center">
                            <UploaderApiIncluded
                              name="File"
                              innerText="File upload"
                              onChange={(name, result) => setREFile(result.id)}
                            />
                          </div>
                        </div>
                        {!REFile.isValid && (
                          <span className="validation-messsage">
                            {REFile.eMessage}
                          </span>
                        )}
                      </div>
                    </div>
                    {/* </div> */}
                    <br />
                    <br />
                  </div>
                )}
                {/* End: Real estate section */}

                {/* Start: Contact info section */}
                {(b_loan_moreInfo_visibility ||
                  (p_userRole === "agent" && userIsVerified)) && (
                  <div className="bl__infoBox">
                    <div className="bl__infoBox__header">
                      <div className="bl__infoBox__circleIcon">
                        <i className="icon-request" />
                      </div>
                      <span>{t("BL_CONTACT_BOX_TITLE")}</span>
                    </div>
                    <div className="userInputs">
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!phoneNumberIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_PHONE_NUMBER")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__left">
                              <span className="icon-phone" />
                            </div>
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="0790266255"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChanged}
                              />
                            </div>
                          </div>
                          {!phoneNumberIsValid && (
                            <span className="validation-messsage">
                              {phoneNumberValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        className={
                          "bl__input animated fadeIn " +
                          (!emailIsValid ? "--invalid" : "")
                        }
                      >
                        <label className="bl__input__label">
                          {t("BL_EMAIL")}
                        </label>
                        <div className="bl__input__element">
                          <div className="element-group">
                            <div className="element-group__left">
                              <span className="icon-envelope" />
                            </div>
                            <div className="element-group__center">
                              <input
                                type="text"
                                className="my-input"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={handleEmailChanged}
                              />
                            </div>
                          </div>
                          {!emailIsValid && (
                            <span className="validation-messsage">
                              {emailValidationMessage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="bl__input termChk animated fadeIn">
                      <label className="customCheckbox">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={terms}
                          onChange={handleTermChanged}
                        />
                        <span className="checkmark" />
                        <span className="customCheckbox__text">
                          {t("BL_TERMS")}{" "}
                          <a
                            href="https://www.ponture.com/eula"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {t("BL_TERMS_LINK")}
                          </a>
                        </span>
                      </label>
                      {termValidation && (
                        <span className="validation-messsage">
                          {t("BL_TERMS_IS_REQUIRED")}
                        </span>
                      )}
                    </div>

                    <div className="bl__actions">
                      <button
                        className="btn --warning --large"
                        onClick={handleSubmitClicked}
                      >
                        {submitSpinner && (
                          <CircleSpinner show={true} size="small" />
                        )}
                        {!submitSpinner && t("SUBMIT")}
                      </button>
                    </div>
                  </div>
                )}
                {/* End: company info section */}
              </>
            )}
            {tab === 2 && (
              <div className="bl__successBox animated fadeIn">
                <div className="bl__successBox__top">
                  <div className="submitIcon">
                    <i className="icon-checkmark" />
                  </div>
                  <h4 className="text">{t("SUBMITTED")}!</h4>
                </div>
                <hr />
                <div className="longDesc">
                  {t("BL_SUCCESS_TEXT_1")}
                  <br />
                  {t("BL_SUCCESS_TEXT_2")}
                  <br />
                  <br />
                  {t("BL_SUCCESS_TEXT_3")}
                  <br />
                  {t("BL_SUCCESS_TEXT_4")}
                  <br />
                  <a href="mailto:contact@ponture.com">contact@ponture.com</a>
                  <span>&nbsp;{t("BL_SUCCESS_CENTER_MSG")}&nbsp;</span>
                  {t("TELEPHONE")}: 010 129 29 20
                  <br />
                  <br />
                  <div>
                    {t("BL_SUCCESS_BOTTOM_MESSAGE")}
                    <a href=" https://www.ponture.com/eula/">
                      {t("SUCCESS_LINK_TERMS")}
                    </a>
                  </div>
                </div>
                <div className="bl__successBox__actions">
                  <button
                    className="btn --warning --large"
                    onClick={openMyApps}
                  >
                    {t("MY_APPLICATIONS")}
                  </button>
                </div>
              </div>
            )}
            {tab === 3 && (
              <div className="bl__successBox animated fadeIn">
                <div className="bl__successBox__top">
                  <div className="submitIcon error">
                    <i className="icon-warning" />
                  </div>
                  <h4 className="text">{t("ERROR_OCCURRED")}!</h4>
                </div>
                <hr />
                <div className="longDesc">
                  {error ? (
                    error.sender === "companies" ? (
                      <div className="companiesEmpty">
                        <div>{t("COMPANIES_EMPTY_MSG1")}</div>
                        <div style={{ fontSize: 13 }}>
                          {t("COMPANIES_EMPTY_MSG2")}
                        </div>
                        <div className="phone">
                          <span>{t("VAR_TELEPHONE")}</span>
                          <span>&nbsp;010 129 29 20</span>
                        </div>
                        <div className="email">
                          <span>{t("EPOST")}:</span>
                          <a href="mailto:contact@ponture.com">
                            &nbsp;contact@ponture.com
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="companiesEmpty allErrorMsg">
                        <div>{t("ERROR_MSG1")}</div>
                        <div style={{ fontSize: 13 }}>{t("ERROR_MSG2")}</div>
                        <div className="phone">
                          <span>{t("TELEPHONE")}</span>
                          <span>&nbsp;010 129 29 20</span>
                        </div>
                        <div className="email">
                          <span>{t("EPOST")}:</span>
                          <a href="mailto:contact@ponture.com">
                            &nbsp;contact@ponture.com
                          </a>
                        </div>
                        <div>{t("ERROR_MSG3")}</div>
                      </div>
                    )
                  ) : (
                    <div className="companiesEmpty allErrorMsg">
                      <div>{t("ERROR_MSG1")}</div>
                      <div style={{ fontSize: 13 }}>{t("ERROR_MSG2")}</div>
                      <div className="phone">
                        <span>{t("TELEPHONE")}</span>
                        <span>&nbsp;010 129 29 20</span>
                      </div>
                      <div className="email">
                        <span>{t("EPOST")}:</span>
                        <a href="mailto:contact@ponture.com">
                          &nbsp;contact@ponture.com
                        </a>
                      </div>
                      <div>{t("ERROR_MSG3")}</div>
                    </div>
                  )}
                </div>
                <div className="bl__successBox__actions">
                  <button className="btn --warning" onClick={refreshPage}>
                    {t("REFRESH")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {verifyModal && (
        <VerifyBankIdModal
          startResult={startResult}
          personalNumber={personalNumber}
          onClose={handleCloseVerifyModal}
          onVerified={handleSuccessBankId}
          onCancelVerify={handleCancelVerify}
        />
      )}
    </div>
  );
}
