const axios = require("axios");
export function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function isBankId(bankId) {
  const personalNumber_regex = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
  return bankId.match(personalNumber_regex);
}

var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function validateEmail(email) {
  const val = email ? email.trimEnd() : "";
  return re.test(String(val).toLowerCase());
}

export function isNumber(number) {
  var p = /^[0-9]*$/;
  return p.test(number);
}
export function isPersonalNumber(pId) {
  const p = /^(19|20)?[0-9]{2}(0|1)[0-9][0-3][0-9][-]?[0-9]{4}$/;
  return p.test(pId);
}

export function isPhoneNumber(phone) {
  const p = /^(((\+)|[0-9]*)[0-9]){9,13}$/;
  return p.test(phone);
}

export function setAuthorizationToken(token) {
  if (token) axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete axios.defaults.headers.common["Authorization"];
}
