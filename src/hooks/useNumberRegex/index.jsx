import React, { useCallback } from "react";
const pattern = /^((\+)|[0-9]*)[0-9]*$/;
export default function useNumberRegex(defaultValue) {
  const [str, _setStr] = React.useState(defaultValue);
  const setStr = useCallback(newStr => {
    return newStr.match(pattern) && _setStr(newStr) && [pattern];
  });
  return [str, setStr];
}
