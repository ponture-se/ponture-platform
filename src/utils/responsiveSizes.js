export const isPhone = () => {
  const windowWidth = window.innerWidth;
  var style = window.getComputedStyle(document.documentElement);
  const fontSize = style.fontSize;
  const width = windowWidth / parseFloat(fontSize);
  if (width < 37.5) return true;
  return false;
};
