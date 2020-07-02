import React from "react";
import { withRouter } from "react-router-dom";
import Cookies from "js-cookie";
import { getParameterByName, isNumber } from "utils";
import { useFormContext } from "react-hook-form";
import styles from "../styles.module.scss";
import Button from "./common/Button";
import Input from "./common/Input";
import CurrencyInput from "./common/CurrencyInput";
import Checkbox from "./common/Checkbox";
import { useLoanDispatch, useLoanState } from "hooks/useLoan";
import useLoanApi from "hooks/useLoan/useLoanApi";
import useLocale from "hooks/useLocale";
import useGlobalState from "hooks/useGlobalState";
import CircleSpinner from "components/CircleSpinner";
import track, { identifyUser } from "utils/trackAnalytic";

const euGuaranteeCode = "1337";

const SubmitBox = ({ history }) => {
  const pCode = getParameterByName("pcode");
  const [{}, globalDispatch] = useGlobalState();
  const {
    errors,
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { dirty, isValid },
  } = useFormContext();
  const submitBoxRef = React.useRef(null);
  const { _createOpp } = useLoanApi();
  const dispatch = useLoanDispatch();
  const {
    contactInfo,
    currentStep,
    personalNumber,
    steps,
    tracking,
  } = useLoanState();
  const { t } = useLocale();
  const [spinner, toggleSpinner] = React.useState(false);
  const init = () => {
    if (contactInfo) {
      setValue([
        { givenRevenue: contactInfo.givenRevenue },
        { phoneNumber: contactInfo.phoneNumber },
        { email: contactInfo.email },
        { terms: contactInfo.terms },
      ]);
    }
    return () => {
      const values = getValues();
      dispatch({
        type: "SET_CONTACT_INFO",
        payload: {
          givenRevenue: values["givenRevenue"],
          phoneNumber: values["phoneNumber"],
          email: values["email"],
          terms: values["terms"],
        },
      });
    };
  };
  React.useEffect(() => {
    if (submitBoxRef.current && currentStep === "submitBox")
      window.scrollTo(0, submitBoxRef.current.offsetTop);
  }, [currentStep]);
  React.useEffect(init, []);
  function checkTracking() {
    if (
      steps.submitBox.isTouched &&
      !steps.submitBox.isFinished &&
      !tracking.submitBox
    ) {
      dispatch({
        type: "SET_TRACKING",
        payload: {
          name: "submitBox",
        },
      });
      track("Step 5", "Loan Application v2", "/app/loan/ wizard", 0);
    }
  }
  React.useEffect(checkTracking, []);

  const onSubmit = async (data) => {
    if (!spinner) {
      toggleSpinner(true);
      const referral_params = Cookies.get("affiliate_referral_params_v2")
        ? decodeURIComponent(Cookies.get("affiliate_referral_params_v2"))
        : Cookies.get("affiliate_referral_params");
      let pId = personalNumber.replace("-", "");
      if (pId.length === 10 || pId.length === 11) pId = "19" + pId;
      let obj = {
        orgNumber: data.company.companyId,
        orgName: data.company.companyName,
        personalNumber: pId,
        givenRevenue: parseInt(data.givenRevenue.split(" ").join("")),
        amount: parseInt(data.amount),
        amourtizationPeriod: parseInt(data.amourtizationPeriod),
        need: data.need.map((n) => n.API_Name),
        email: data.email,
        phoneNumber: data.phoneNumber,
      };
      const pCode = getParameterByName("pcode");
      if (pCode && pCode.length > 0 && isNumber(pCode)) obj["pcode"] = pCode;

      const utm_source = getParameterByName("utm_source");
      const utm_medium = getParameterByName("utm_medium");
      const utm_campaign = getParameterByName("utm_campaign");
      const referral_id = getParameterByName("referral_id");
      const last_referral_date = getParameterByName("last_referral_date");
      if (referral_params) {
        try {
          const ref = JSON.parse(referral_params);
          if (ref && ref.utm_source) {
            obj["utm_source"] = ref.utm_source;
          }
          if (ref && ref.utm_medium) {
            obj["utm_medium"] = ref.utm_medium;
          }
          if (ref && ref.utm_campaign) {
            obj["utm_campaign"] = ref.utm_campaign;
          }
          if (ref && ref.referral_id) {
            obj["referral_id"] = ref.referral_id;
          }
          if (ref && ref.last_referral_date) {
            obj["last_referral_date"] = ref.last_referral_date;
          }
        } catch (error) {}
      }
      if (utm_source) obj["utm_source"] = utm_source;
      if (utm_medium) obj["utm_medium"] = utm_medium;
      if (utm_campaign) obj["utm_campaign"] = utm_campaign;
      if (referral_id) obj["referral_id"] = referral_id;
      if (last_referral_date) obj["last_referral_date"] = last_referral_date;

      _createOpp(
        obj,
        (result) => {
          identifyUser(result ? (result.data ? result.data.userInfo : {}) : {});
          track(
            "Submit",
            "Loan Application v2",
            "/app/loan/ wizard",
            obj.amount
          );
          toggleSpinner(false);
          if (result && (!result.data || !result.data.bankIdRequired)) {
            track(
              "Finished without BankID",
              "Loan Application v2",
              "/app/loan/ wizard",
              0
            );
            dispatch({
              type: "SET_LOAN_FORM_STATUS",
              payload: "noNeedBankId",
            });
          } else {
            history.push(`/app/loan/verifybankId/${result.data.oppId}/`);
          }
        },
        (result) => {
          toggleSpinner(false);
        }
      );
    }
  };

  return (
    <div ref={submitBoxRef} className={styles.submitBox}>
      <div className={styles.submitBox__inputs}>
        <CurrencyInput
          title={t("SUBMIT_LABEL")}
          tooltip={t("SUBMIT_TOOLTIP")}
          placeholder="t.ex.  1 200 000 kr"
          extraClassStyle={styles.submitBox__inputs__turnOver}
          id="ff"
          errorText={errors.givenRevenue && errors.givenRevenue.message}
          autoFocus
          rules={{
            required: t("REQUIRED_INPUT"),
            validate: (value) => {
              const val = value.split(" ").join("");
              return val.length <= 9 || t("SUBMIT_REVENUE_NOT_VALID");
            },
          }}
          name="givenRevenue"
        />
        <div className={styles.submitBox__twoColumns}>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt telefonnummer"
              placeholder="t.ex.  070 980 20 91"
              extraClassStyle={styles.submitBox__inputs__phone}
              ref={register({
                required: t("REQUIRED_INPUT"),
                pattern: {
                  value: /^(\+46|0|0046)[\s\-]?[1-9][\s\-]?[0-9]([\s\-]?\d){7,8}$/,
                  message: t("PHONE_NUMBER_IN_CORRECT"),
                },
              })}
              name="phoneNumber"
              errorText={errors.phoneNumber && errors.phoneNumber.message}
            />
          </div>
          <div className={styles.submitBox__twoColumns__col}>
            <Input
              title="Ditt e-post"
              placeholder="t.ex fredrik@comany.com"
              extraClassStyle={styles.submitBox__inputs__email}
              errorText={errors.email && errors.email.message}
              ref={register({
                required: t("REQUIRED_INPUT"),
                pattern: {
                  value: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: t("EMAIL_IN_CORRECT"),
                },
              })}
              name="email"
            />
          </div>
        </div>
      </div>
      <div className={styles.submitBox__terms}>
        <Checkbox
          title={t("SUBMIT_TERMS_LABEL")}
          id="termChk"
          name="terms"
          ref={register({ required: t("BL_TERMS_IS_REQUIRED") })}
          errorText={errors.terms && errors.terms.message}
          extraLabel={
            <a
              href="https://www.ponture.com/eula"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("SUBMIT_TERMS_LINK")}
            </a>
          }
        />
      </div>
      {pCode === euGuaranteeCode ? (
        <div className={styles.submitBox__terms}>
          <Checkbox
            title={t("SUBMIT_CODE_1337_TITLE")}
            id="euGuarantyChk"
            name="euGuarantee"
            ref={register({ required: t("SUBMIT_1337_IS_REQUIRED") })}
            errorText={errors.euGuarantee && errors.euGuarantee.message}
          />
        </div>
      ) : null}
      <div className={styles.submitBox__actions}>
        <Button
          type="submit"
          customClass={styles.submitBox__customBtn}
          warning
          onClick={handleSubmit(onSubmit)}
        >
          {spinner ? <CircleSpinner show={true} /> : t("SUBMIT_SEND_BUTTON")}
        </Button>
        <div className={styles.submitBox__actions__link}>
          <a href="/app/loan/">{t("REFRESH_LINK_TEXT_1")}</a>
          <div>
            (<a href="/app/loan/">{t("REFRESH_LINK_TEXT_2")}</a>)
          </div>
        </div>
      </div>
      {!isValid && (
        <div className={styles.submitBox__errors}>
          <ul>
            {Object.keys(errors).map((item, index) => (
              <li key={index}>{t(item) + " - " + errors[item].message}</li>
            ))}
          </ul>
        </div>
      )}
      {pCode === euGuaranteeCode ? (
        <div className={styles.submitBox__euGuarantee}>
          <img src={require("assets/euGaurantee.jpg")} alt="" />
          <span>
            Lånet omfattas av en garanti som finansieras av Europeiska unionen
            inom programmet för sysselsättning och social innovation
          </span>
        </div>
      ) : null}
      <div className={styles.submitBox__info}>
        {[
          t("SUBMIT_GUID_1"),
          t("SUBMIT_GUID_2"),
          t("SUBMIT_GUID_3"),
          t("SUBMIT_GUID_4"),
        ].map((item, index) => (
          <div className={styles.rowInfo} key={index}>
            <div className={styles.rowInfo__chk} />
            <span>{item}</span>
          </div>
        ))}
      </div>
      {spinner && <div className={styles.disableBodyWrapper}></div>}
    </div>
  );
};

export default withRouter(SubmitBox);
