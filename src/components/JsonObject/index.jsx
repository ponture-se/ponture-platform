import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, utility } from "../../services";
const util = require("util");

const JsonInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [error, setError] = useState("");
  const [input, setInput] = useState("");

  // set value to input
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);

      if (field.isTranslate) setInput(props.formData[field.name][currentLang]);
      else setInput(props.formData[field.name]);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);

      if (field.defaultValue) {
        setInput(field.defaultValue);
        setValueToParentForm(field.defaultValue);
      } else setInput("");
    }
  }, [formData]);

  function setValueToParentForm(inputValue) {
    if (props.onChangeValue) {
      let value;
      if (field.isTranslate) value = utility.applyeLangs(inputValue);
      else value = inputValue;

      let p;
      try {
        p = JSON.parse(inputValue);
        if (error) setError();

        if (field.isRequired) {
          let isValid = false;
          if (inputValue.length > 0) {
            isValid = true;
          }
          props.onChangeValue(field, value, isValid);
        } else props.onChangeValue(field, value, true);
      } catch (e) {
        setError(util.inspect(e));
      }
    }
  }
  function handleOnChange(e) {
    setInput(e.target.value);
    setValueToParentForm(e.target.value);
  }
  return (
    <div className="form-group">
      <label>{field.title && field.title[currentLang]}</label>
      <textarea
        className="form-control"
        placeholder="example : { 'propName' : 'propValue' }"
        value={input}
        onChange={handleOnChange}
        readOnly={props.viewMode}
      />
      <small className="form-text text-muted">
        {error ? (
          <span style={{ color: "red" }}>{error}</span>
        ) : (
          field.description && field.description[currentLang]
        )}
      </small>
    </div>
  );
};

export default JsonInput;
