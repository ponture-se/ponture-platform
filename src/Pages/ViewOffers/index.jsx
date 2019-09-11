import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useGlobalState, useLocale } from "hooks";
import "./styles.scss";
import Item from "./item";
// import OfferModal from "./OfferModal";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import { getOffers, rejectOffer, acceptOffer } from "api/main-api";
import { toggleAlert } from "components/Alert";
//
const AllOffers = props => {
  let didCancel = false;
  const [{}, dispatch] = useGlobalState();
  const { t, direction } = useLocale();
  const [viewOfferModal, toggleViewOffer] = useState();
  const [selectedOffer, setOffer] = useState();
  const [loading, toggleLoading] = useState(true);
  const [offers, setOffers] = useState();
  const [app, setApp] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    _getOffers();
    return () => {
      didCancel = true;
    };
  }, []);
  function _getOffers() {
    const id = props.match.params.id;
    getOffers()
      .onOk(result => {
        if (!didCancel) {
          toggleLoading(false);
          setApp(result.opportunityDetail);
          setOffers(result.offers);
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
        }
      })
      .notFound(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          toggleLoading(false);
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call(id);
  }
  function handleViewOffer(offer) {
    setOffer(offer);
    toggleViewOffer(true);
  }
  function handleCloseViewOffer() {
    toggleViewOffer(false);
  }
  function handleAcceptClicked(offer) {
    acceptOffer()
      .onOk(result => {
        if (!didCancel) {
          if (result) {
            let off = offers.filter(item => item.id !== offer.id);
            off.push(result);
            setOffers(off);
          }
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("INTERNAL_SERVER_ERROR")
            }
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("BAD_REQUEST")
            }
          });
        }
      })
      .notFound(result => {
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("NOT_FOUND")
            }
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: t("UNKNOWN_ERROR")
            }
          });
        }
      })
      .call(offer.Id);
  }
  function handleRejectClicked(offer) {
    toggleAlert({
      title: t("APP_OFFERS_REJECT_ALERT_INFO"),
      // description: t("APP_OFFERS_REJECT_ALER T_INFO"),
      cancelBtnText: t("NO"),
      okBtnText: t("YES_DO_IT"),
      isAjaxCall: true,
      func: rejectOffer,
      data: {
        offerId: offer.Id
      },
      onCancel: () => {},
      onSuccess: result => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "success",
            message: t("OFFER_REJECT_SUCCESS")
          }
        });
        if (result) {
          let off = offers.filter(item => item.id !== offer.id);
          off.push(result);
          setOffers(off);
        }
      },
      onServerError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("INTERNAL_SERVER_ERROR")
          }
        });
      },
      onBadRequest: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("BAD_REQUEST")
          }
        });
      },
      unAuthorized: error => {},
      notFound: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("NOT_FOUND")
          }
        });
      },
      unKnownError: error => {
        dispatch({
          type: "ADD_NOTIFY",
          value: {
            type: "error",
            message: t("UNKNOWN_ERROR")
          }
        });
      }
    });
  }
  return (
    <div className="appOffers">
      {loading ? (
        <div className="page-loading">
          <SquareSpinner />
          <h2>{t("OFFERS_LOADING_TEXT")}</h2>
        </div>
      ) : error ? (
        <div className="page-list-error animated fadeIn">
          <Wrong />
          <h2>{error && error.title}</h2>
          <span>{error && error.message}</span>
        </div>
      ) : !offers || offers.length === 0 ? (
        <>
          <div className="appOffers__header">
            <Link to={"/app/panel/myApplications"}>
              <div className="icon">
                <i
                  className={
                    direction === "ltr"
                      ? "icon-arrow-left2"
                      : "icon-arrow-right2"
                  }
                />
              </div>
              <span>{t("OFFERS_HEADER_BACK")}</span>
            </Link>
          </div>
          <div className="page-empty-list animated fadeIn">
            <Empty />
            <h2>{t("OFFERS_EMPTY_LIST_TITLE")}</h2>
            <span>{t("OFFERS_EMPTY_LIST_MSG")}</span>
          </div>
        </>
      ) : (
        <>
          <div className="appOffers__header">
            <Link to={"/app/panel/myApplications"}>
              <div className="icon">
                <i
                  className={
                    direction === "ltr"
                      ? "icon-arrow-left2"
                      : "icon-arrow-right2"
                  }
                />
              </div>
              <span className="linkTitle">{t("OFFERS_HEADER_BACK")}</span>
            </Link>
          </div>
          {offers.map(offer => (
            <Item
              key={offer.Id}
              app={app}
              offer={offer}
              onViewOffersClicked={handleViewOffer}
              onAcceptClicked={handleAcceptClicked}
              onRejectClicked={handleRejectClicked}
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
  );
};

export default AllOffers;
