import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import "./styles.scss";
import { languageManager } from "./../../services";

const KeyValueInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const { field, formData } = props;

  const [cmpKey, setKey] = useState();
  const selectComponent = useRef(null);

  function getSelectedOption() {
    if (formData[field.name]) {
      if (field.isList) {
        const selected = formData[field.name].map(opt => {
          return {
            value: opt,
          };
        });
        return selected;
      } else {
        return { value: formData[field.name] };
      }
    } else {
      if (field.options === undefined || field.options.length === 0)
        return undefined;
      if (field.isList) {
        const selected = field.options.filter(opt => opt.selected === true);
        return selected;
      } else {
        const selected = field.options.find(opt => opt.selected === true);
        return selected;
      }
    }
  }

  // set value to input update and reset form time
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
    } else if (field.isRequired === true)
      if (props.init) props.init(field.name, false);

    setKey(Math.random());
    const defaultValue = getSelectedOption();
    if (defaultValue !== undefined) {
      setValueToParentForm(defaultValue);
    }
  }, [formData]);

  function setValueToParentForm(input) {
    if (props.onChangeValue) {
      if (field.isList) {
        let s = [];
        for (let i = 0; i < input.length; i++) {
          s.push(input[i].value);
        }
        if (field.isRequired) {
          let isValid = false;
          if (s.length > 0) {
            isValid = true;
          }
          props.onChangeValue(field, s, isValid);
        } else props.onChangeValue(field, s, true);
      } else {
        if (field.isRequired) {
          let isValid = false;
          if (input.value.length > 0) {
            isValid = true;
          }
          props.onChangeValue(field, input.value, isValid);
        } else props.onChangeValue(field, input.value, true);
      }
    }
  }
  function handleOnChange(selected) {
    // setSelectedOption(selected);
    setValueToParentForm(selected);
  }

  return !field.appearance || field.appearance === "default" ? (
    <div className="form-group">
      <label>{field.title[currentLang]}</label>
      <Select
        key={cmpKey}
        ref={selectComponent}
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        //value={selectedOption}
        defaultValue={true && getSelectedOption()}
        onChange={handleOnChange}
        options={field.options ? field.options : []}
        isMulti={field.isList}
        isSearchable={true}
        isDisabled={props.viewMode}
        components={{
          Option: CustomOption,
          MultiValueLabel,
          SingleValue,
        }}
      />
      <small className="form-text text-muted">
        {field.description[currentLang]}
      </small>
    </div>
  ) : field.appearance === "radioGroup" ? (
    <>
      <label>{field.title[currentLang]}</label>
      <div className="up-form-keyvalue-radio">
        {field.options.map(option => (
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="exampleRadios"
              id={"radio" + option.key}
              value={option.key}
            />
            <label class="form-check-label" htmlFor={"radio" + option.key}>
              {option.value}
            </label>
          </div>
        ))}
      </div>
    </>
  ) : null;
};

export default KeyValueInput;

const SingleValue = props => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">{data.value}</div>
    </components.SingleValue>
  );
};
const MultiValueLabel = props => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="options-multiple-selected">{data.value}</div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  if (!isDisabled) {
    return (
      <div {...innerProps} className="options-items">
        {data.value}
      </div>
    );
  } else return null;
};
