import React from "react";
const myInputPattern = /^([0-9]*[-]?)[0-9]*$/;

export default function usePersonalNumber(defaultValue) {
  const [str, _setStr] = React.useState(defaultValue);
  const setStr = React.useCallback((newStr) => {
    return newStr.match(myInputPattern) && _setStr(newStr) && [myInputPattern];
  }, []);
  return [str, setStr];
}
