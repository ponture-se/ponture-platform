import React from "react";
import "./style.scss";
import { SingleUploader } from ".";
import SafeValue from "utils/SafeValue";
export default class MultiUploader extends React.Component {
  constructor(props) {
    super(props);
    const _data = SafeValue(props, "data", "array", []);
    const _files =
      _data.length > 0
        ? _data.map((file, idx) => {
            return { value: file, name: "uploader" + this.newId() };
          })
        : [];
    _files.push({ value: "", name: `uploader${this.newId()}` });
    this.state = {
      //   activeAddAction: false,
      files: _files
    };
  }
  addUploader = () => {
    const { files } = this.state;
    files.push({ value: "", name: "uploader" + this.newId() });
    this.setState({
      files: files
    });
  };
  newId = () => {
    return parseInt(Math.random() * 10000000);
  };
  _onChange = (name, file, realFileName) => {
    const { files } = this.state;
    let _file = file.id;
    let addExtraUploader = false;
    let isUpdated = false;
    let _name = "";
    if (_file) {
      //update file
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === name) {
          isUpdated = true;
          if (files[i]["value"] === "") {
            addExtraUploader = true;
          }
          files[i]["value"] = _file;
          files[i]["realFileName"] = realFileName;
        }
      }
      //or add a new file
      if (!isUpdated) {
        files.push({
          value: _file,
          name: `uploader${this.newId()}`
        });
      }
    } else {
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === name) {
          files.splice(i, 1);
        }
      }
    }

    this.setState(
      {
        files: files
      },
      () => {
        const _fileForApi = [];
        if (addExtraUploader) {
          this.addUploader();
        }
        this.state.files.forEach(item => {
          if (item.value) {
            _fileForApi.push(item.value);
          }
        });
        // console.log("ffapi: ", _fileForApi);
        this.props.onChange(_fileForApi);
      }
    );
  };
  render() {
    const { files, activeUploaders } = this.state;
    return (
      <div className="MultiUploader">
        {files.length > 0 &&
          files.map((file, idx) => (
            <SingleUploader
              {...this.props}
              key={idx + file.name}
              defaultFile={file.value}
              realFileName={file.realFileName}
              downloadable={false}
              onChange={this._onChange}
              behaviour={"multi"}
              name={file.name}
              // onUploadEnds={this.props.onUploadEnds}
              // onUploadStarts={this.props.onUploadStarts}
              // innerText={this.props.innerText}
            />
          ))}
        {
          //activeUploaders === files.length &&
          <div className="addUploader"></div>
        }
      </div>
    );
  }
}
