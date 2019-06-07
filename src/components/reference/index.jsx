import React, { useState, useEffect } from "react";
import Select, { components } from "react-select";
import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";
import "./styles.scss";
import { languageManager, useGlobalState } from "../../services";
import { filterContents } from "./../../Api/content-api";
const currentLang = languageManager.getCurrentLanguage().name;

const ReferenceInput = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const { field, formData } = props;

  const [options, setOptions] = useState();
  const [values, setValues] = useState();

  // set value to selected otions
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
    }

    if (spaceInfo) {
      filterContents()
        .onOk(result => {
          if (result) {
            const r = result.map(item => {
              item.value = item._id;
              return item;
            });
            setOptions(r);
            if (formData[field.name] === undefined) {
              setValues(null);
            } else {
              initValue(r);
            }
          }
        })
        .onServerError(result => {})
        .onBadRequest(result => {})
        .unAuthorized(result => {})
        .notFound(() => {})
        .call(spaceInfo.id, undefined, [field.references]);
    }
  }, [formData]);
  function initValue(allData) {
    if (field.isList) {
      const selectedData = formData[field.name];
      const result = [];
      for (let i = 0; i < selectedData.length; i++) {
        const id = selectedData[i];
        for (let j = 0; j < allData.length; j++) {
          const refObj = allData[j];
          if (refObj.value === id) {
            result.push(refObj);
            break;
          }
        }
      }
      setValues(result.length > 0 ? result : null);
    } else {
      const v = allData.find(item => item.value === formData[field.name]);
      setValues(v);
    }
  }
  function setValueToParentForm(input) {
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
        if (props.onChangeValue) props.onChangeValue(field, s, isValid);
      } else {
        if (props.onChangeValue) props.onChangeValue(field, s, true);
      }
    } else {
      if (field.isRequired) {
        let isValid = false;
        if (input.value.length > 0) {
          isValid = true;
        }
        if (props.onChangeValue)
          props.onChangeValue(field, input.value, isValid);
      } else {
        if (props.onChangeValue) props.onChangeValue(field, input.value, true);
      }
    }
  }
  function handleChange(selecteds) {
    setValues(selecteds);
    setValueToParentForm(selecteds);
  }
  function initOptions(result) {
    return result;
  }
  function promiseOptions(inputValue) {
    return new Promise(resolve => {
      filterContents()
        .onOk(result => {
          if (result) resolve(initOptions(result));
        })
        .onServerError(result => {})
        .onBadRequest(result => {})
        .unAuthorized(result => {})
        .notFound(() => {})
        .call(spaceInfo.id, undefined, [field.references]);
    });
  }
  return (
    <div className="form-group">
      <label>{field.title[currentLang]}</label>
      {/* <AsyncCreatableSelect
        cacheOptions
        defaultOptions
        loadOptions={promiseOptions}
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        value={selectedOptions}
        onChange={handleChange}
        options={options}
        isMulti={field.isList}
        isSearchable={true}
        components={{ Option: CustomOption, MultiValueLabel, SingleValue }}
      /> */}
      <Select
        menuPlacement="top"
        closeMenuOnScroll={true}
        closeMenuOnSelect={!field.isList}
        value={values}
        onChange={handleChange}
        options={options}
        isMulti={field.isList}
        isSearchable={true}
        isDisabled={props.viewMode}
        components={{ Option: CustomOption, MultiValueLabel, SingleValue }}
      />
      <small className="form-text text-muted">
        {field.description[currentLang]}
      </small>
    </div>
  );
};

export default ReferenceInput;
const SingleValue = props => {
  const { data } = props;
  return (
    <components.SingleValue {...props}>
      <div className="options-single-selected">
        <div className="custome-select-selected">
          {data.fields["thumbnail"] && data.fields["thumbnail"].length > 0 && (
            <div className="selectedItemImage">
              <img src={data.fields["thumbnail"][0][currentLang]} alt="" />
            </div>
          )}
          <div className="selectedItemName">
            {data.fields.name && data.fields.name[currentLang]}
          </div>
        </div>
      </div>
    </components.SingleValue>
  );
};
const MultiValueLabel = props => {
  const { data } = props;
  return (
    <components.MultiValueLabel {...props}>
      <div className="custome-select-selected" key={data.sys.id}>
        {data.fields["thumbnail"] && data.fields["thumbnail"].length > 0 && (
          <div className="selectedItemImage">
            <img src={data.fields["thumbnail"][0][currentLang]} alt="" />
          </div>
        )}
        <div className="selectedItemName">
          {data.fields.name && data.fields.name[currentLang]}
        </div>
      </div>
    </components.MultiValueLabel>
  );
};

const CustomOption = ({ innerProps, isDisabled, data }) => {
  if (!isDisabled) {
    return (
      <div {...innerProps} className="custom-select-item">
        <div className="imageItem">
          {data.fields["thumbnail"] && data.fields["thumbnail"].length > 0 ? (
            <img src={data.fields["thumbnail"][0][currentLang]} alt="" />
          ) : (
            <div className="imageItem-empty">No Image</div>
          )}
        </div>
        <div className="itemName">
          <span>{data.fields.name && data.fields.name[currentLang]}</span>
          <span>
            {data.fields.shortDesc && data.fields.shortDesc[currentLang]}
          </span>
        </div>
        <div className="itemBy">
          <span>{data.sys.issuer && data.sys.issuer.fullName}</span>
          <span>{data.sys.issueDate && data.sys.issueDate}</span>
        </div>
        <div className="itemStatus">
          <span>
            {data.fields.status &&
              languageManager.translate(data.fields.status)}
          </span>
        </div>
      </div>
    );
  } else return null;
};

// import React, { Component } from "react";

// import AsyncCreatableSelect from "react-select/lib/AsyncCreatable";
// export const colourOptions = [
//   { value: "ocean", label: "Ocean", color: "#00B8D9", isFixed: true },
//   { value: "blue", label: "Blue", color: "#0052CC", disabled: true },
//   { value: "purple", label: "Purple", color: "#5243AA" },
//   { value: "red", label: "Red", color: "#FF5630", isFixed: true },
//   { value: "orange", label: "Orange", color: "#FF8B00" },
//   { value: "yellow", label: "Yellow", color: "#FFC400" },
//   { value: "green", label: "Green", color: "#36B37E" },
//   { value: "forest", label: "Forest", color: "#00875A" },
//   { value: "slate", label: "Slate", color: "#253858" },
//   { value: "silver", label: "Silver", color: "#666666" }
// ];

// const filterColors = inputValue => {
//   return colourOptions.filter(i =>
//     i.label.toLowerCase().includes(inputValue.toLowerCase())
//   );
// };

// const promiseOptions = inputValue =>
//   new Promise(resolve => {
//     setTimeout(() => {
//       resolve(filterColors(inputValue));
//     }, 1000);
//   });

// export default class WithPromises extends Component {
//   render() {
//     return (
//       <AsyncCreatableSelect
//         cacheOptions
//         defaultOptions
//         loadOptions={promiseOptions}
//         isMulti
//       />
//     );
//   }
// }
