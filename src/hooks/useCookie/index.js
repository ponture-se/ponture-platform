import { useState } from "react";
import Cookies from "js-cookie";

const setCookie = (name, value, days = 7) => {
  if (!value || value.length === 0) Cookies.remove(name);
  else Cookies.set(name, value, { expires: days });
};

const getCookie = name => {
  return Cookies.get(name);
};

export default function(key, initialValue) {
  const [item, setItem] = useState(() => {
    return getCookie(key) || initialValue;
  });

  const updateItem = value => {
    setItem(value);
    setCookie(key, value);
  };

  return [item, updateItem];
}
