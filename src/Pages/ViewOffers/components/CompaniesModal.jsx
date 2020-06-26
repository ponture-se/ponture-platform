import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMdBusiness } from "react-icons/io";
import ReactDOM from "react-dom";
import useGlobalState from "hooks/useGlobalState";
import useLocale from "hooks/useLocale";

const CompaniesModal = ({ onClose }) => {
  const [{ userInfo }, dispatch] = useGlobalState();

  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => (document.body.style.overflowY = "auto");
  }, []);

  function close() {
    dispatch({
      type: "TOGGLE_COMPANIES_MODAL",
    });
  }

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className="acceptModal">
        <div className="acceptModal__bg" onClick={close} />
        <div className="acceptModal__content companiesModal animated fadeInUp faster">
          <div className="companiesModal__header">
            <h3>Välj ditt företag för att visa dina erbjudanden</h3>
            <div className="icon-cross closeIcon" onClick={close} />
          </div>
          <div className="companiesModal__body">
            {userInfo &&
              userInfo.companies &&
              userInfo.companies.map((item) => {
                return (
                  <Link
                    key={item.orgNumber}
                    className="companyItem"
                    to={`/app/panel/offers/${item.orgNumber}`}
                    onClick={close}
                  >
                    <IoMdBusiness className="companyItem__icon" />
                    <span>{item.orgName}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  );
};

export default CompaniesModal;
