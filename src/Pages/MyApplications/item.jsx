import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useLocale } from "hooks";
import separateNumberByChar from "utils/separateNumberByChar";
//
const Item = props => {
  const { t } = useLocale();
  const { item } = props;
  function viewApplication() {
    if (props.onViewAppClicked) props.onViewAppClicked(item);
  }
  return (
    <div className="application animated fadeIn">
      <div className="application__header">
        <div className="icon">
          <i className="icon-checkmark" />
        </div>
        <div className="info">
          <span>Title</span>
          <span>Lorem ipsum can not find any problems to do something </span>
        </div>
        <Link to="/viewOffers/12">
          <span>View Offers</span>
          <div className="icon">
            <i className="icon-arrow-right2" />
          </div>
        </Link>
      </div>
      <div className="application__body">
        <div className="application__body__header">
          <span>Title</span>
          <span>2 300 000.00 Kr</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
        <div className="application__bodyRow">
          <span>{t("Title")}</span>
          <span>Value</span>
        </div>
      </div>
    </div>
  );
};
export default Item;

Item.propTypes = {
  item: PropTypes.object.isRequired
};
Item.defaultProps = {
  item: {}
};
