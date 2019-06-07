var moment = require("moment");
const DateFormater = props => {
  const { date, format } = props;
  return format ? moment(date).fromNow() : moment(date).fromNow();
};
export default DateFormater;
