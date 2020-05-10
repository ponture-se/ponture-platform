import { useCallback, useState } from "react";
const pattern = /^(((\+)|[0-9]*)[0-9])*$/;
const p = /^(\+?46|0|0046)[\s\-]?[1-9][\s\-]?[0-9]([\s\-]?\d){6,7}$/;
export default function useNumberRegex(defaultValue) {
  const [str, _setStr] = useState(defaultValue);
  const setStr = useCallback((newStr) => {
    return newStr.match(p) && _setStr(newStr) && [p];
  });
  return [str, setStr];
}
