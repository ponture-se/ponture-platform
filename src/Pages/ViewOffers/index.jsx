import React, { useEffect, useState, useRef } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import OppInfo from "./components/OppInfo";
import Loading from "./components/Loading";
import EmptyOffers from "./components/EmptyOffers";
import Error from "./components/FailedFetch";
import NotAcceptedAlert from "./components/NotAcceptedAlert";
import AcceptedAlert from "./components/AcceptedAlert";
import UiActions from "./components/UiActions";
import OffersCategory from "./components/OffersCategory";
import AcceptedOffer from "./components/AcceptedOffer";
// import OfferModal from "./OfferModal";
import { getLatestOffers, rejectOffer } from "api/main-api";
import { toggleAlert } from "components/Alert";
import {
  getCategorizedOffers,
  checkIsAcceptedOffer,
  checkIsSameUiAction,
} from "./helper";

import track from "utils/trackAnalytic";
//
const AllOffers = ({ match }) => {
  const didCancel = useRef(false);
  const [{ verifyInfo }] = useGlobalState();
  const { t } = useLocale();

  const [state, setState] = useState({
    loading: true,
    error: false,
    opportunity: null,
    acceptedOffer: null,
    isAccepted: false,
    hasUiActionsSame: false,
    offers: [],
  });

  const updateState = (...changes) =>
    setState((prevState) => ({ ...prevState, ...changes }));

  const init = (rsult, errorTitle, errorMsg) => {
    if (!didCancel.current) {
      const result = {
        opportunityDetail: {
          opportunityID: "0061X00000AgPTFQA3",
          opportunityNumber: "LO0000000694",
          Name: "CFA International AB",
          orgNumber: "5569979734",
          opportunityStage: "Not Funded/ Closed lost",
          createdAt: "2020-04-10 17:23:08",
          RecordType: "Business Loan",
          amortizationPeriod: 12,
          amount: 800000,
          closeDate: "2020-04-10 00:00:00",
          CompanyRegistrationDate: "2014-12-22",
          need: [
            {
              apiName: "general_liquidity",
              title: "Generell likviditet",
            },
          ],
          needDescription: "null",
          lastAvailableRevenue: 6000,
          lostReason: "KYC",
          creditSafeScore: 2,
          bankVerified: true,
          activeCompany: true,
          companyVerified: true,
          industryText: "Konsultbyråer avseende företags organisation",
          industryCode: "70220",
          description: "null",
          contactInfo: {
            email: "padyabsaeed@gmail.com",
            phone: "+46790266255",
            name: "Saeed Padyab",
            lastName: "Padyab",
            personalNumber: "192907304766",
          },
        },
        offers: [{}, {}],
      };
      if (result) {
        if (!result.offers || result.offers.length === 0) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
          }));
        } else {
          const categorizedOffers = getCategorizedOffers(result.offers);
          const acceptedOffer = checkIsAcceptedOffer(result.offers);
          const hasUiActionsSame = checkIsSameUiAction(result.offers);

          setState((prevState) => ({
            ...prevState,
            loading: false,
            opportunity: result.opportunityDetail,
            offers: categorizedOffers,
            isAccepted: acceptedOffer ? true : false,
            acceptedOffer,
            hasUiActionsSame,
          }));
        }
      } else
        updateState({
          loading: false,
          error: {
            title: t(errorTitle),
            message: t(errorMsg),
          },
        });
    }
  };
  function _getLatestOffers() {
    getLatestOffers()
      .onOk((result) => {
        init(result);
      })
      .onServerError((result) => {
        init(null, "INTERNAL_SERVER_ERROR", "INTERNAL_SERVER_ERROR_MSG");
      })
      .onBadRequest((result) => {
        init(null, "BAD_REQUEST", "BAD_REQUEST_MSG");
      })
      .unAuthorized((result) => {
        if (!didCancel.current) {
        }
      })
      .notFound((result) => {
        init(null, "NOT_FOUND", "NOT_FOUND_MSG");
      })
      .unKnownError((result) => {
        init(null, "UNKNOWN_ERROR", "UNKNOWN_ERROR_MSG");
      })
      .onRequestError((result) => {
        init(null, "ON_REQUEST_ERROR", "ON_REQUEST_ERROR_MSG");
      })
      .call(verifyInfo.userInfo.personalNumber);
    return () => {
      didCancel.current = true;
    };
  }
  const {
    loading,
    error,
    opportunity,
    offers,
    isAccepted,
    acceptedOffer,
    hasUiActionsSame,
  } = state;
  useEffect(_getLatestOffers, []);

  function handleAcceptedOffer() {
    setState((prevState) => ({ ...prevState, loading: true }));
    _getLatestOffers();
    // window.scrollTo({
    //   top: 0,
    //   left: 0,
    //   behavior: "smooth",
    // });
  }
  return (
    <>
      <div className="appOffers">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error />
        ) : !offers || offers.length === 0 ? (
          <EmptyOffers />
        ) : (
          <>
            <OppInfo opportunity={opportunity} />
            {!isAccepted ? (
              <>
                <NotAcceptedAlert />
                <UiActions hasUiActionsSame={hasUiActionsSame} />
              </>
            ) : (
              <>
                <AcceptedAlert acceptedOffer={acceptedOffer} />
                <AcceptedOffer acceptedOffer={acceptedOffer} />
              </>
            )}
            {offers.map((category, index) => (
              <OffersCategory
                key={index}
                opportunity={opportunity}
                category={category}
                isAccepted={isAccepted}
                onEndAccepting={handleAcceptedOffer}
              />
            ))}
          </>
        )}
        {/* {viewOfferModal && (
        <OfferModal
          offer={selectedOffer}
          app={app}
          onClose={handleCloseViewOffer}
        />
      )} */}
      </div>
    </>
  );
};

export default AllOffers;
