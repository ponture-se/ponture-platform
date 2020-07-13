import React from "react";
import CircleSpinner from "components/CircleSpinner";
import useLocale from "hooks/useLocale";
const Loading = ({ error }) => {
  const { t } = useLocale();
  return (
    <div className="page-loading">
      <CircleSpinner show={true} size="large" bgColor="#44b3c2" />
    </div>
  );
};

export default Loading;
