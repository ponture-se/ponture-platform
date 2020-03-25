import React, { useEffect, useState, useCallback } from "react";
import { useGlobalState, useLocale } from "hooks";
import SquareSpinner from "components/SquareSpinner";
import { Empty, Wrong } from "components/Commons/ErrorsComponent";
import {
  getMatchMakingPartners,
  doManualMatchMaking,
  closeSPO
} from "api/main-api";
import SafeValue from "utils/SafeValue";
import "./index.scss";
import classnames from "classnames";
import { CircleSpinner, InlineCancelButton } from "components";
export default function MatchMaking(props) {
  let didCancel = false;
  const [{ userInfo, currentRole }, dispatch] = useGlobalState();
  const [partnerList, setPartnerList] = useState();
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();
  const { t } = useLocale();
  const [pendingSPOs, setPendingSPOs] = useState([]);
  useEffect(() => {
    getPartnersList(props.oppId, () => {
      setIsLoading(false);
    });
  }, []);
  // useEffect(() => {
  //   console.log("updated");
  // }, [selectedPartners]);
  const getPartnersList = (oppId, callback) => {
    getMatchMakingPartners()
      .onOk(result => {
        if (!didCancel) {
          setPartnerList(result);
          if (typeof callback === "function") callback();
        }
      })
      .onServerError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
          setError({
            title: t("INTERNAL_SERVER_ERROR"),
            message: t("INTERNAL_SERVER_ERROR_MSG")
          });
        }
      })
      .onBadRequest(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
          setError({
            title: t("BAD_REQUEST"),
            message: t("BAD_REQUEST_MSG")
          });
        }
      })
      .unAuthorized(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
        }
      })
      .notFound(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(result);
          }
          setError({
            title: t("NOT_FOUND"),
            message: t("NOT_FOUND_MSG")
          });
        }
      })
      .unKnownError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          setError({
            title: t("UNKNOWN_ERROR"),
            message: t("UNKNOWN_ERROR_MSG")
          });
        }
      })
      .onRequestError(result => {
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          setError({
            title: t("ON_REQUEST_ERROR"),
            message: t("ON_REQUEST_ERROR_MSG")
          });
        }
      })
      .call(oppId);
  };
  function choosePartner(partnerId, e) {
    const partnerIdIndex = selectedPartners.indexOf(partnerId);
    const selectedPartnerList = Array.from(selectedPartners);
    if (partnerIdIndex > -1) {
      selectedPartnerList.splice(partnerIdIndex, 1);
    } else {
      selectedPartnerList.push(partnerId);
    }
    setSelectedPartners(() => selectedPartnerList);
  }
  function dropPartner(partnerId, e) {
    const partnerIdIndex = selectedPartners.indexOf(partnerId);
    const selectedPartnerList = Array.from(selectedPartners);
    if (partnerIdIndex > -1) {
      selectedPartnerList.splice(partnerIdIndex, 1);
    } else {
      selectedPartnerList.push(partnerId);
    }
    setSelectedPartners(() => selectedPartnerList);
  }
  const submitMatchMaking = (oppId, callback) => {
    setIsSubmitting(true);
    doManualMatchMaking()
      .onOk(result => {
        setIsSubmitting(false);
        if (!didCancel) {
          if (result && result.errors && result.errors.length > 0) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "Manual match making error, try again." //T
              }
            });
          } else {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: "Manual match making completed successfuly." //T
              }
            });
            props.onClose();
            props.onSubmit();
            // _getMyApplications(skip, limit, filter, () => {
            //   if (typeof callback === "function") {
            //     callback(result);
            //   }
            // });
            //success
            // if (window.analytics)
            //   window.analytics.track("Submit", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: loanAmount
            //   });
          }
        }
      })
      .unKnownError(result => {
        setIsSubmitting(false);
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Unknown error happened" //T
            }
          });
        }
      })
      //   .onInvalidRequest(result => {
      //     if (!didCancel) {
      //       if (typeof callback === "function") {
      //         callback(false);
      //       }
      //       dispatch({
      //         type: "ADD_NOTIFY",
      //         value: {
      //           type: "error",
      //           message: "Invalid request for manual match making"
      //         }
      //       });
      //     }
      //   })
      .unAuthorized(result => {
        setIsSubmitting(false);
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Unauthorized" //T
            }
          });
        }
      })
      .onBadRequest(result => {
        setIsSubmitting(false);
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Manual match making error, Bad request." //T
            }
          });
        }
      })
      .notFound(result => {
        setIsSubmitting(false);
        if (!didCancel) {
          if (typeof callback === "function") {
            callback(false);
          }
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Manual match making error." //T
            }
          });
        }
      })
      .call(oppId, selectedPartners);
  };
  const closeSPObyId = spoId => {
    // setIsLoading(true);
    setPendingSPOs(() => [...pendingSPOs, spoId]);
    const _removeThisSPOFromPendingList = () => {
      const _pendingSPOs = pendingSPOs;
      _pendingSPOs.splice(pendingSPOs.indexOf(spoId), 1);
      setPendingSPOs(() => [..._pendingSPOs]);
    };
    closeSPO()
      .onOk(result => {
        if (!didCancel) {
          if (result && result.errors && result.errors.length > 0) {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "error",
                message: "An error happend while closing SPO, Please try again." //T
              }
            });
          } else {
            dispatch({
              type: "ADD_NOTIFY",
              value: {
                type: "success",
                message: "SPO closed successfuly." //T
              }
            });
            // _getMyApplications(skip, limit, filter, () => {
            //   if (typeof callback === "function") {
            //     callback(result);
            //   }
            // });
            //success
            // if (window.analytics)
            //   window.analytics.track("Submit", {
            //     category: "Loan Application",
            //     label: "/app/loan/ wizard",
            //     value: loanAmount
            //   });
          }
          getPartnersList(props.oppId, () => {
            _removeThisSPOFromPendingList();
          });
        }
      })
      .unKnownError(result => {
        _removeThisSPOFromPendingList();
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Unknown error happened" //T
            }
          });
        }
      })
      //   .onInvalidRequest(result => {
      //     if (!didCancel) {
      //       if (typeof callback === "function") {
      //         callback(false);
      //       }
      //       dispatch({
      //         type: "ADD_NOTIFY",
      //         value: {
      //           type: "error",
      //           message: "Invalid request for manual match making"
      //         }
      //       });
      //     }
      //   })
      .unAuthorized(result => {
        _removeThisSPOFromPendingList();
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Unauthorized" //T
            }
          });
        }
      })
      .onBadRequest(result => {
        _removeThisSPOFromPendingList();
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Closing SPO error, Bad request." //T
            }
          });
        }
      })
      .notFound(result => {
        _removeThisSPOFromPendingList();
        if (!didCancel) {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: "Closing SPO error." //T
            }
          });
        }
      })
      .call(spoId);
  };
  return (
    <>
      <div className="MatchMaking">
        <div className="bl section-header matchMaking bl__infoBox ">
          <div className="bl__infoBox__header">
            <span className="section-header">
              {t("Manual match making")}
              {/* T */}
            </span>
            <span
              className="icon-cross modal-close"
              onClick={props.onClose}
            ></span>
          </div>
        </div>
        {isLoading ? (
          <div className="page-loading">
            <SquareSpinner />
            <h2>{t("MATCHMAKING_LOADING_TEXT")}</h2>
          </div>
        ) : error ? (
          <div className="page-list-error animated fadeIn">
            <Wrong />
            <h2>{error && error.title}</h2>
            <span>{error && error.message}</span>
          </div>
        ) : partnerList.length === 0 ? (
          <div className="page-empty-list animated fadeIn">
            <Empty />
            <h2>{t("MATCHMAKING_EMPTY_LIST_TITLE")}</h2>
            <span>{t("MATCHMAKING_EMPTY_LIST_MSG")}</span>
          </div>
        ) : (
          <>
            <div className="partner-list">
              {partnerList.map((partner, idx) => (
                <div
                  key={idx}
                  className={classnames(
                    "partner-list__partner-item",
                    partner.spo_list.length
                      ? partner.spo_list[0].spo_stage !== "Closed"
                        ? "--assgined"
                        : partner.spo_list[0].spo_stage === "Closed" &&
                          "--closed"
                      : "",
                    selectedPartners.indexOf(partner.partner_id) > -1 &&
                      "--not-assgined"
                  )}
                  onClick={() =>
                    (!partner.spo_list.length ||
                      (partner.spo_list.length &&
                        partner.spo_list[0].spo_stage === "Closed")) &&
                    choosePartner(partner.partner_id)
                  }
                >
                  <h4 className="company-name">{partner.partner_name}</h4>
                  <span className="company-status-box">
                    <span className="company-status-box__title">
                      {t("Status:") /* //T */}
                    </span>{" "}
                    <span className="company-status-box__status">
                      {!partner.spo_list.length
                        ? "Not assigned"
                        : partner.spo_list[0].spo_stage === "New"
                        ? "Assgined"
                        : partner.spo_list[0].spo_stage}
                    </span>
                    {partner.spo_list.length
                      ? partner.spo_list[0].spo_stage !== "Closed" && (
                          <InlineCancelButton
                            onClick={() =>
                              closeSPObyId(partner.spo_list[0].spo_id)
                            }
                            disableFeature={true}
                            spinner={
                              pendingSPOs.indexOf(partner.spo_list[0].spo_id) >
                              -1
                            }
                          />
                        )
                      : ""}
                  </span>
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn --success"
                onClick={() => submitMatchMaking(props.oppId)}
                disabled={selectedPartners.length === 0 || isSubmitting}
              >
                {isSubmitting ? (
                  <CircleSpinner show={true} />
                ) : (
                  <>
                    <span className="icon-checkmark"></span>&nbsp;
                    {t("APPLY")}
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
