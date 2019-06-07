import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, utility } from "../../services";

const NumberInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [input, setInput] = useState(
    field.defaultValue ? field.defaultValue : ""
  );

  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);

      setInput(props.formData[field.name]);
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
    let value;
    if (field.isTranslate) value = utility.applyeLangs(inputValue);
    else value = inputValue;

    if (field.isRequired) {
      let isValid = false;
      if (inputValue.length > 0) {
        isValid = true;
      }
      if (props.onChangeValue) props.onChangeValue(field, value, isValid);
    } else {
      if (props.onChangeValue) props.onChangeValue(field, value, true);
    }
  }
  function handleOnChange(e) {
    setInput(e.target.value);
    setValueToParentForm(e.target.value);
  }
  return (
    <div className="form-group">
      <label>{field.title[currentLang]}</label>
      <input
        type="number"
        className="form-control"
        placeholder={field.title[currentLang]}
        value={input}
        onChange={handleOnChange}
        readOnly={props.viewMode}
      />
      <small className="form-text text-muted">
        {field.description[currentLang]}
      </small>
    </div>
  );
};

export default NumberInput;
