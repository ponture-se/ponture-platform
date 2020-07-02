export default function track(action, category, label, value) {
  if (window.analytics)
    window.analytics.track(action, {
      category: category,
      label: label,
      value: value,
    });
  else console.log(action, category, label, value);
}

export const identifyUser = (userInfo = {}) => {
  if (window.analytics) {
    window.analytics.identify(userInfo.contactId, {
      name: userInfo.firstName + " " + userInfo.lastName,
      email: userInfo.email,
      plan: "",
      logins: "",
    });
  }
};
