import React from "react";
import Wrong from "components/Commons/ErrorsComponent/Wrong";
const FailedFetch = ({ error }) => {
  return (
    <div className="page-list-error animated fadeIn">
      <Wrong />
      <h2>{error && error.title}</h2>
      <span>{error && error.message}</span>
    </div>
  );
};

export default FailedFetch;
