const enabledAnalytic =
  process.env.REACT_APP_ENABLE_ANALYTICS === "true" ? true : false;

export default function track(action, category, label, value) {
  if (enabledAnalytic)
    if (window.analytics)
      window.analytics.track(action, {
        category: category,
        label: label,
        value: value
      });
}
