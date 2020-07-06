import React, { useEffect, useState, useRef } from "react";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import OppInfo from "./components/OppInfo";
import Loading from "./components/Loading";
import EmptyOffers from "./components/EmptyOffers";
import Error from "./components/FailedFetch";
import NotAcceptedAlert from "./components/NotAcceptedAlert";
import AcceptedAlert from "./components/AcceptedAlert";
import NeedsBankId from "./components/NeedsBankID";
import UiActions from "./components/UiActions";
import OffersCategory from "./components/OffersCategory";
import AcceptedOffer from "./components/AcceptedOffer";
import IsLostOpportunity from "./components/IsLostOpportunity";
import IsWonOpportunity from "./components/IsWonOpportunity";
import CompaniesModal from "./components/CompaniesModal";
import { getLatestOffers } from "api/main-api";
import usePageTitle from "hooks/usePageTitle";
import {
  getCategorizedOffers,
  checkIsAcceptedOffer,
  checkIsSameUiAction,
  oppStages,
  getWonOffer,
} from "./helper";

//
const AllOffers = ({ match }) => {
  const didCancel = useRef(false);
  const [{ verifyInfo, companiesModal }] = useGlobalState();
  const { t } = useLocale();
  usePageTitle(t("APPLICATION_OFFERS_PAGE_TITLE"));
  const [state, setState] = useState({
    loading: true,
    error: false,
    opportunity: null,
    acceptedOffer: null,
    isAccepted: false,
    hasUiActionsSame: false,
    isDone: false,
    isLost: false,
    isWon: false,
    wonOffer: null,
    bankIdRequired: false,
    offers: [],
  });

  const init = (result, errorTitle, errorMsg) => {
    const opportunity = result.opportunityDetail;
    const bankIdRequired = result.bankIdRequired;
    if (
      opportunity.opportunityStage.toLowerCase() ===
        oppStages.won.toLowerCase() ||
      opportunity.opportunityStage.toLowerCase() ===
        oppStages.lost.toLowerCase()
    ) {
      let wonOffer = {};
      if (result && result.offers && result.offers.length) {
        const c_offers = getCategorizedOffers(result.offers);
        wonOffer = getWonOffer(result.offers);
      }

      setState((prevState) => ({
        ...prevState,
        loading: false,
        opportunity,
        bankIdRequired,
        wonOffer,
        isDone: true,
        isWon:
          opportunity.opportunityStage.toLowerCase() ===
          oppStages.won.toLowerCase(),
        isLost:
          opportunity.opportunityStage.toLowerCase() ===
          oppStages.lost.toLowerCase(),
      }));
    } else {
      if (result) {
        if (!result.offers || result.offers.length === 0) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            bankIdRequired,
            opportunity: result.opportunityDetail,
            wonOffer: null,
            isDone: false,
            isWon: false,
            isLost: false,
          }));
        } else {
          const categorizedOffers = getCategorizedOffers(result.offers);
          const acceptedOffer = checkIsAcceptedOffer(result.offers);
          const hasUiActionsSame = checkIsSameUiAction(result.offers);

          setState((prevState) => ({
            ...prevState,
            loading: false,
            opportunity: result.opportunityDetail,
            bankIdRequired,
            offers: categorizedOffers,
            isAccepted: acceptedOffer ? true : false,
            acceptedOffer,
            hasUiActionsSame,
            wonOffer: null,
            isDone: false,
            isWon: false,
            isLost: false,
          }));
        }
      }
    }
  };
  function _getLatestOffers() {
    if (!loading) {
      setState((prevState) => ({ ...prevState, loading: true }));
    }
    getLatestOffers()
      .onOk((result) => init(result))
      .onServerError((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        init(null, "INTERNAL_SERVER_ERROR", "INTERNAL_SERVER_ERROR_MSG");
      })
      .onBadRequest((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        init(null, "BAD_REQUEST", "BAD_REQUEST_MSG");
      })
      .unAuthorized((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        if (!didCancel.current) {
        }
      })
      .notFound((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        init(null, "NOT_FOUND", "NOT_FOUND_MSG");
      })
      .unKnownError((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        init(null, "UNKNOWN_ERROR", "UNKNOWN_ERROR_MSG");
      })
      .onRequestError((result) => {
        setState((prevState) => ({ ...prevState, loading: false }));
        init(null, "ON_REQUEST_ERROR", "ON_REQUEST_ERROR_MSG");
      })
      .call(verifyInfo.userInfo.personalNumber, match.params.orgNumber);
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
    isDone,
    isWon,
    isLost,
    bankIdRequired,
    wonOffer,
  } = state;
  useEffect(_getLatestOffers, [match.params.orgNumber]);

  function handleAcceptedOffer() {
    setState((prevState) => ({ ...prevState, loading: true }));
    _getLatestOffers();
  }

  return (
    <>
      <div className="appOffers">
        {loading ? (
          <Loading />
        ) : error ? (
          <Error />
        ) : bankIdRequired ? (
          <>
            <OppInfo opportunity={opportunity} />
            <NeedsBankId opportunity={opportunity} />
          </>
        ) : isDone ? (
          <>
            <OppInfo opportunity={opportunity} />
            {isLost ? (
              <IsLostOpportunity />
            ) : isWon ? (
              <>
                <IsWonOpportunity wonOffer={wonOffer} />
              </>
            ) : null}
          </>
        ) : !offers || offers.length === 0 ? (
          <>
            <OppInfo opportunity={opportunity} />
            <EmptyOffers />
          </>
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
      </div>
      {companiesModal && <CompaniesModal />}
    </>
  );
};

export default AllOffers;
