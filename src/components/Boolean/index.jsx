import React, { useState, useEffect } from "react";
import "./styles.scss";
import { languageManager, utility } from "./../../services";

const BooleanComponent = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const { field, formData } = props;

  const [value, setValue] = useState(
    field.defaultValue ? field.defaultValue : false
  );

  // set value to input
  useEffect(() => {
    if (formData[field.name] !== undefined && formData[field.name] !== null) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
      setValue(props.formData[field.name]);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      if (field.defaultValue !== undefined && field.defaultValue !== null) {
        setValue(field.defaultValue);
        setValueToParentForm(field.defaultValue);
      } else setValue(false);
    }
  }, [formData]);

  function setValueToParentForm(inputValue) {
    if (props.onChangeValue) {
      let value = inputValue;
      if (field.isRequired) {
        let isValid = false;
        if (value) {
          isValid = true;
        }
        props.onChangeValue(field, value, isValid);
      } else props.onChangeValue(field, value, true);
    }
  }
  function handleCheckboxValue(e) {
    if (props.viewMode) {
      e.preventDefault();
    } else {
      setValue(e.target.checked);
      setValueToParentForm(e.target.checked);
    }
  }

  return (
    <div
      className="custom_checkbox"
      style={{
        marginTop: 10,
      }}
    >
      <div className="left">
        <label className="checkBox">
          <input
            type="checkbox"
            id={"chk" + field.name}
            checked={value}
            onChange={handleCheckboxValue}
            disabled={props.viewMode}
          />
          <span className="checkmark" />
        </label>
      </div>
      <div className="right">
        <label htmlFor={"chk" + field.name}>{field.title[currentLang]}</label>
        {field.description && (
          <label htmlFor={"chk" + field.name}>
            {field.description[currentLang]}
          </label>
        )}
      </div>
    </div>
  );
};

export default BooleanComponent;
