import React, { useEffect, useState } from "react";
import { useLocale } from "hooks";
import "./styles.scss";

//
const MyApplications = props => {
  const { t } = useLocale();

  return (
    <div className="notFound">
      <span className="t404">404</span>
      <span className="title">OOPS! NOTHING WAS FOUND</span>
      <span className="info">
        The page you are looking for might have been removed had its name
        changed or is temporarily unavailable
      </span>
    </div>
  );
};

export default MyApplications;
