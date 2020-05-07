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
import { getLatestOffers } from "api/main-api";
import {
  getCategorizedOffers,
  checkIsAcceptedOffer,
  checkIsSameUiAction,
} from "./helper";

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

  const init = (result, errorTitle, errorMsg) => {
    if (!didCancel.current) {
      if (result) {
        if (!result.offers || result.offers.length === 0) {
          setState((prevState) => ({
            ...prevState,
            loading: false,
            opportunity: result.opportunityDetail,
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
