// import React, { useEffect, useState, useCallback } from "react";
// import { useGlobalState, useLocale } from "hooks";
// //
// import Modal from "components/Modal";
// import "./styles.scss";
// import SquareSpinner from "components/SquareSpinner";
// // import CreditReportModal from "./../CreditReport/CreditModal";
// // import IssueOfferModal from "./../IssueOffer";
// // import RejectAppModal from "./../Shared/RejectAppModal";
// import { Wrong } from "components/Commons/ErrorsComponent";
// import separateNumberByChar from "utils/separateNumberByChar";
// import {
//   getApplicationById,
//   getApplicationAttachmentsbyFileId
// } from "api/main-api";
// // import { rejectApplication } from "services/redux/application/singleApp/actions";

// const ViewApplication = props => {
//   let didCancel = false;
//   const [{ userInfo, currentRole }, dispatch] = useGlobalState();
//   const { t } = useLocale();
//   const [spinner, toggleSpinner] = useState(true);
//   const [data, setData] = useState();
//   const [error, setError] = useState();
//   const [attachments, setAttachments] = useState(undefined);
//   const [creditReportVisibility, toggleCreditReport] = useState();
//   const [issueOfferVisibility, toggleIssueOffer] = useState();
//   const [rejectAppVisibility, toggleRejectApp] = useState();
//   useEffect(() => {
//     const id = props.oppId;
//     if (!id) {
//       toggleSpinner(false);
//       setError({
//         title: t("INVALID_URL"),
//         message: t("UNKNOWN_ERROR_MSG")
//       });
//     } else {
//       getApplicationById()
//         .onOk(result => {
//           toggleSpinner(false);
//           if (!didCancel) {
//             if (result) {
//               setData(result);
//             } else {
//               setError({
//                 title: t("GET_APP_ERROR_RESULT"),
//                 message: t("GET_APP_ERROR_RESULT_MSG")
//               });
//             }
//           }
//         })
//         .onServerError(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("INTERNAL_SERVER_ERROR"),
//               message: t("INTERNAL_SERVER_ERROR_MSG")
//             });
//           }
//         })
//         .onBadRequest(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("BAD_REQUEST"),
//               message: t("BAD_REQUEST_MSG")
//             });
//           }
//         })
//         .unAuthorized(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("UNKNOWN_ERROR"),
//               message: t("UNKNOWN_ERROR_MSG")
//             });
//           }
//         })
//         .notFound(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("NOT_FOUND"),
//               message: t("NOT_FOUND_MSG")
//             });
//           }
//         })
//         .unKnownError(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("UNKNOWN_ERROR"),
//               message: t("UNKNOWN_ERROR_MSG")
//             });
//           }
//         })
//         .onRequestError(result => {
//           if (!didCancel) {
//             toggleSpinner(false);
//             setError({
//               title: t("ON_REQUEST_ERROR"),
//               message: t("ON_REQUEST_ERROR_MSG")
//             });
//           }
//         })
//         .call(id);
//     }
//     return () => {
//       didCancel = true;
//     };
//   }, []);

//   function handleViewCredit() {
//     toggleCreditReport(true);
//   }
//   function handleOffer() {
//     toggleIssueOffer(true);
//   }
//   function handleCloseCreditReport() {
//     toggleCreditReport(false);
//   }
//   function handleCloseIssueOffer(isSubmitted) {
//     toggleIssueOffer(false);
//     if (isSubmitted === true) {
//       closeModal();
//     }
//   }
//   function closeModal() {
//     if (props.onClose) props.onClose();
//   }
//   function handleRejectApp() {
//     toggleRejectApp(true);
//   }
//   function handleCloseRejectAppModal() {
//     toggleRejectApp(false);
//   }
//   function downloadAttachment(fileId) {
//     const didCancel = true;
//     getApplicationAttachmentsbyFileId()
//       .onOk(file => {})
//       .onServerError(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("INTERNAL_SERVER_ERROR"),
//             message: t("INTERNAL_SERVER_ERROR_MSG")
//           });
//         }
//       })
//       .onBadRequest(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("BAD_REQUEST"),
//             message: t("BAD_REQUEST_MSG")
//           });
//         }
//       })
//       .unAuthorized(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("UNKNOWN_ERROR"),
//             message: t("UNKNOWN_ERROR_MSG")
//           });
//         }
//       })
//       .notFound(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("NOT_FOUND"),
//             message: t("NOT_FOUND_MSG")
//           });
//         }
//       })
//       .unKnownError(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("UNKNOWN_ERROR"),
//             message: t("UNKNOWN_ERROR_MSG")
//           });
//         }
//       })
//       .onRequestError(result => {
//         if (!didCancel) {
//           toggleSpinner(false);
//           setError({
//             title: t("ON_REQUEST_ERROR"),
//             message: t("ON_REQUEST_ERROR_MSG")
//           });
//         }
//       })
//       .call(fileId);
//   }
//   return (
//     <Modal size="viewAppModalSize" onClose={closeModal}>
//       <div className="viewApp">
//         {spinner ? (
//           <div className="page-loading">
//             <SquareSpinner />
//             <h2>{t("VIEW_APP_LOADING_TEXT")}</h2>
//           </div>
//         ) : error ? (
//           <div className="page-list-error animated fadeIn">
//             <Wrong />
//             <h2>{error && error.title}</h2>
//             <span>{error && error.message}</span>
//             <button className="btn --light" onClick={closeModal}>
//               {t("CLOSE")}
//             </button>
//           </div>
//         ) : data ? (
//           <>
//             <div className="viewAppItem">
//               <div className="viewAppItem__header">
//                 <div className="closeModal" onClick={closeModal}>
//                   <span className="icon-cross" />
//                 </div>
//                 <span className="viewAppItem__title">
//                   {data.opportunityDetails &&
//                     data.opportunityDetails.RecordType}
//                 </span>
//                 <div className="viewAppItem__headerinfo">
//                   <div className="headerItem">
//                     <span>{t("APP_HEADER_LOAN_AMOUNT")}</span>
//                     <span>
//                       {separateNumberByChar(
//                         data.opportunityDetails.amount,
//                         " "
//                       )}{" "}
//                       Kr
//                     </span>
//                   </div>
//                   <div className="headerItem">
//                     <span>{t("APP_HEADER_PERIOD")}</span>
//                     <span>
//                       <span>
//                         {data.opportunityDetails &&
//                           data.opportunityDetails.amortizationPeriod}
//                       </span>{" "}
//                       {t("MONTH_S")}
//                     </span>
//                   </div>
//                   <div className="headerItem">
//                     <span>{t("APP_HEADER_DATE")}</span>
//                     <span>
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.createdAt &&
//                         data.opportunityDetails.createdAt.split(" ")[0]}
//                     </span>
//                   </div>
//                   <div className="headerItem">
//                     <span>{t("APP_HEADER_NUMBER")}</span>
//                     <span>
//                       {data.opportunityDetails && data.opportunityDetails.Name}
//                       &nbsp;{" "}
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.orgNumber &&
//                         "(" + data.opportunityDetails.orgNumber + ")"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//               <div className="viewAppItem__body">
//                 <div className="viewAppItem__bodyRow">
//                   <div className="viewAppItem__bodyRow__left">
//                     <span>{t("APP_COMPANY_REGISTERED")}</span>
//                   </div>
//                   <div className="viewAppItem__bodyRow__right">
//                     <span>
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.CompanyRegistrationDate}
//                     </span>
//                     <span>
//                       {data.opportunityDetails &&
//                       data.opportunityDetails.bankVerified ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>{t("APP_BANKID_VERIFIED")}</span>
//                     </span>
//                   </div>
//                 </div>
//                 <div className="viewAppItem__bodyRow">
//                   <div className="viewAppItem__bodyRow__left">
//                     <span>{t("APP_CREDITSAFE_SCRORE")}</span>
//                   </div>
//                   <div className="viewAppItem__bodyRow__right">
//                     <span>
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.creditSafeScore}
//                     </span>
//                     <span>
//                       {data.opportunityDetails &&
//                       data.opportunityDetails.activeCompany ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>{t("APP_ACTIVE_COMPANY")}</span>
//                     </span>
//                   </div>
//                 </div>
//                 <div className="viewAppItem__bodyRow">
//                   <div className="viewAppItem__bodyRow__left">
//                     <span>{t("APP_REVENUE")}</span>
//                   </div>
//                   <div className="viewAppItem__bodyRow__right">
//                     <span>
//                       {data.accountDetails &&
//                       data.accountDetails.legalFormCode &&
//                       data.accountDetails.legalFormCode.toLowerCase() == "ef"
//                         ? "Not public data because Enskildfirma"
//                         : data.accountDetails && data.accountDetails.revenue
//                         ? separateNumberByChar(
//                             data.accountDetails.revenue.totalRevenue,
//                             " "
//                           )
//                         : ""}{" "}
//                       Kr
//                     </span>
//                     <span>
//                       {data.opportunityDetails &&
//                       data.opportunityDetails.companyVerified ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>{t("APP_COMPANY_VERIFIED")}</span>
//                     </span>
//                   </div>
//                 </div>
//                 <div className="viewAppItem__bodyRow">
//                   <div className="viewAppItem__bodyRow__left">
//                     <span>{t("APP_NEED_FOR")}</span>
//                   </div>
//                   <div className="viewAppItem__bodyRow__right">
//                     <span>
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.need &&
//                         data.opportunityDetails.need.map((n, index) => {
//                           if (index === data.opportunityDetails.need.length - 1)
//                             return n.title ? n.title : "";
//                           else return n.title + " , ";
//                         })}
//                     </span>
//                   </div>
//                 </div>
//                 {data.opportunityDetails && (
//                   <div className="otherNeeds">
//                     {data.opportunityDetails.needDescription}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <div className="detail">
//               <div className="detail__header">
//                 {data.spoStage &&
//                   data.spoStage.toLowerCase() === "opened" &&
//                   (!data.activeOffers || data.activeOffers === 0) && (
//                     <>
//                       <button
//                         className="btn --warning"
//                         onClick={handleRejectApp}
//                       >
//                         {t("REJECT")}
//                       </button>
//                       <button className="btn --primary" onClick={handleOffer}>
//                         {t("ISSUE_OFFER")}
//                       </button>
//                     </>
//                   )}
//                 <button className="btn --primary" onClick={handleViewCredit}>
//                   {t("VIEW_CREDIT_REPORT")}
//                 </button>
//               </div>
//               <div className="detail__body">
//                 <div className="detail__row">
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_ORGANIZATION_NUMBER")}:</span>
//                     <span>
//                       {data.accountDetails && data.accountDetails.orgNumber}
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_CEO")}:</span>
//                     <span>
//                       {data.accountDetails && data.accountDetails.CEO}
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_BUSINESS_ACTIVITIES")}:</span>
//                     <span>
//                       {data.opportunityDetails &&
//                         data.opportunityDetails.industryText}
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_NUMBER_OF")}:</span>
//                     <span>
//                       {data.accountDetails &&
//                         data.accountDetails.numOfEmployees}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="detail__row">
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_REGISTERED_ADDRESS")}:</span>
//                     <span>
//                       {data.accountDetails.address
//                         ? data.accountDetails.address.Mailing_Zip_Code +
//                           " - " +
//                           data.accountDetails.address.Mailing_Town +
//                           " - " +
//                           data.accountDetails.address.Mailing_County
//                         : ""}
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_SIGNATARY_POWER")}:</span>
//                     <span
//                       title={
//                         data.accountDetails &&
//                         data.accountDetails.signatoryPower
//                       }
//                     >
//                       {data.accountDetails &&
//                         data.accountDetails.signatoryPower}
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_LEGAL_FORM")}:</span>
//                     <span>
//                       {data.accountDetails && data.accountDetails.legalForm}
//                     </span>
//                   </div>
//                 </div>
//                 <div className="detail__row">
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_REGISTERED_FOR_TAX")}:</span>
//                     <span>
//                       {data.accountDetails &&
//                       data.accountDetails.registedForTax ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>
//                         {data.accountDetails &&
//                         data.accountDetails.registedForTax
//                           ? t("TRUE")
//                           : t("FALSE")}
//                       </span>
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_REGISTERED_AS_EMPLOYER")}:</span>
//                     <span>
//                       {data.accountDetails &&
//                       data.accountDetails.registedAsEmployer ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>
//                         {data.accountDetails &&
//                         data.accountDetails.registedAsEmployer
//                           ? t("TRUE")
//                           : t("FALSE")}
//                       </span>
//                     </span>
//                   </div>
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_REGISTERED_FOR_VAT")}:</span>
//                     <span>
//                       {data.accountDetails &&
//                       data.accountDetails.registedForVAT ? (
//                         <i className="icon-checkmark" />
//                       ) : (
//                         <i className="icon-cross" style={{ color: "red" }} />
//                       )}
//                       <span>
//                         {data.accountDetails &&
//                         data.accountDetails.registedForVAT
//                           ? t("TRUE")
//                           : t("FALSE")}
//                       </span>
//                     </span>
//                   </div>
//                 </div>
//                 {/* <div className="detail__row">
//                   <div className="detail__row__item">
//                     <span>{t("APP_DETAIL_BUSINESS_ACTIVITIES")}:</span>
//                     <span>Biger Jarlsgatan 57C 113 56 Stockholm</span>
//                   </div>
//                 </div> */}
//                 <div className="detail__table">
//                   <span>{t("APP_DETAIL_BOARD_MEMBER")}</span>
//                   <div className="table">
//                     <table>
//                       <thead>
//                         <tr>
//                           <td>{t("APP_DETAIL_BOARD_NAME")}</td>
//                           <td>{t("APP_DETAIL_BOARD_P_NUMBER")}</td>
//                           <td>{t("APP_DETAIL_BOARD_ROLE")}</td>
//                           <td>{t("APP_DETAIL_BOARD_ACCESS")}</td>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {data.accountDetails &&
//                           data.accountDetails.BoardMember.map(item => (
//                             <tr key={item.personalNum}>
//                               <td>
//                                 <div>
//                                   <span>{item.firstName}</span>
//                                   <span>
//                                     {item.firstName} {item.surName}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td>{item.personalNum}</td>
//                               <td>{item.role}</td>
//                               <td>{item.access}</td>
//                             </tr>
//                           ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//                 <div className="detail__finan">
//                   <span className="title">
//                     {t("APP_DETAIL_FINANCIAL_YEAR")}
//                   </span>
//                 </div>
//                 <div className="detail__finan">
//                   {t("APP_DETAIL_LAST_PUBLISHED")}:
//                   {data.accountDetails && data.accountDetails.lastPublished}
//                 </div>
//                 <div className="detail__lastBox">
//                   <div className="detail__lastBox__left">
//                     <div className="lastBoxItem">
//                       <div className="lastBoxItem__header">
//                         <span>{t("APP_DETAIL_REVENUE")}</span>
//                       </div>
//                       <div className="lastBoxItem__body">
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_REVENUE_TOTAL")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.revenue &&
//                               separateNumberByChar(
//                                 data.accountDetails.revenue.totalRevenue,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="lastBoxItem">
//                       <div className="lastBoxItem__header">
//                         <span>{t("APP_DETAIL_ANNUAL_ACCOUNTS")}</span>
//                       </div>
//                       <div className="lastBoxItem__body">
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_ANNUAL_SHARE_CAPITAL")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.annualAccounts &&
//                               separateNumberByChar(
//                                 data.accountDetails.annualAccounts.shareCapital,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_ANNUAL_CASH_BANK")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.annualAccounts &&
//                               separateNumberByChar(
//                                 data.accountDetails.annualAccounts
//                                   .cashAndBankBalance,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_ANNUAL_TOTAL_ASSETS")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.annualAccounts &&
//                               separateNumberByChar(
//                                 data.accountDetails.annualAccounts.totalAssets,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_ANNUAL_TOTAL_EQUALITY")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.annualAccounts &&
//                               separateNumberByChar(
//                                 data.accountDetails.annualAccounts.totalEquity,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className="detail__lastBox__right">
//                     <div className="lastBoxItem">
//                       <div className="lastBoxItem__header">
//                         <span>{t("APP_DETAIL_PROFIT_LOSS")}</span>
//                       </div>
//                       <div className="lastBoxItem__body">
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_PROFIT_LOSS_OPERATION")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.profitLoss &&
//                               separateNumberByChar(
//                                 data.accountDetails.profitLoss
//                                   .operatingProfitLoss,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_PROFIT_LOSS_AFTER")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.profitLoss &&
//                               separateNumberByChar(
//                                 data.accountDetails.profitLoss
//                                   .profitAfterFinancial,
//                                 " "
//                               )}{" "}
//                             Kr
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="lastBoxItem">
//                       <div className="lastBoxItem__header">
//                         <span>{t("APP_DETAIL_KEY_RATIOS")}</span>
//                       </div>
//                       <div className="lastBoxItem__body">
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_KEY_NET")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.keyRatio &&
//                               data.accountDetails.keyRatio.netMargin}{" "}
//                             %
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_KEY_CASH")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.keyRatio &&
//                               data.accountDetails.keyRatio.cashFlow}{" "}
//                             %
//                           </span>
//                         </div>
//                         <div className="lastBoxItem__body__row">
//                           <span>{t("APP_DETAIL_KEY_SOLIDITY")}</span>
//                           <span>
//                             {data.accountDetails &&
//                               data.accountDetails.keyRatio &&
//                               data.accountDetails.keyRatio.solidity}{" "}
//                             %
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 {/* if application has attachment then display the attachment section */}
//                 {data.opportunityAttachments &&
//                   data.opportunityAttachments.length && (
//                     <>
//                       <div className="detail__attachment">
//                         <span className="title">
//                           {t("APP_DETAIL_ATTACHMENT")}
//                         </span>
//                       </div>
//                       <div className="detail__attachment">
//                         {data.opportunityAttachments.map(file => (
//                           <span className="detail__attachment__item">
//                             <i className="icon-file-text" />
//                             &nbsp;
//                             <a onClick={() => downloadAttachment(file.id)}>
//                               {file.title}
//                             </a>
//                           </span>
//                         ))}
//                       </div>
//                     </>
//                   )}
//               </div>
//             </div>
//           </>
//         ) : null}
//         {creditReportVisibility && (
//           <CreditReportModal
//             app={data ? data.opportunityDetails : null}
//             accountDetails={data ? data.accountDetails : null}
//             onClose={handleCloseCreditReport}
//           />
//         )}
//         {issueOfferVisibility && (
//           <IssueOfferModal
//             app={data ? data.opportunityDetails : null}
//             onClose={handleCloseIssueOffer}
//           />
//         )}
//         {rejectAppVisibility && (
//           <RejectAppModal
//             onClose={handleCloseRejectAppModal}
//             app={data ? data.opportunityDetails : null}
//             onSuccess={closeModal}
//           />
//         )}
//       </div>
//     </Modal>
//   );
// };
// export default ViewApplication;
export default function ViewApplication() {
  return null;
}
