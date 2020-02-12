import React from "react";
import { uploadFile } from "../../api/main-api/";
import "./index.scss";
import classnames from "classnames";
import { downloadAppAsset } from "api/main-api";
import { CircleSpinner } from "components";
import { SingleUploader } from ".";
import SafeValue from "utils/SafeValue";
export default class MultiUploader extends React.Component {
  constructor(props) {
    super(props);
    const _files =
      SafeValue(props, "data", "array", []).length > 0
        ? SafeValue(props, "data", "array", []).map((file, idx) => {
            return { value: file, name: "uploader" + idx };
          })
        : [{ value: "", name: "uploader0" }];
    this.state = {
      //   activeAddAction: false,
      files: _files
    };
  }
  addUploader = () => {
    const { files } = this.state;
    files.push({ value: "", name: "uploader" + files.length });
    this.setState({
      files: files
    });
  };
  onChange = (name, file) => {
    const { files } = this.state;
    let _file = file.id;
    if (_file) {
      let isUpdated = false;
      //update file
      for (let i = 0; i < files.length; i++) {
        if (files[i].name === name) {
          isUpdated = true;
          files[i]["value"] = _file;
        }
      }
      //or add a new file
      if (!isUpdated) {
        files.push({
          value: _file,
          name: `uploader${files.length}`
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
        this.state.files.forEach(item => {
          if (item.value) {
            _fileForApi.push(item.value);
          }
        });
        console.log(this.state.files);
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
              key={idx}
              messages={this.props.messages}
              width={this.props.width}
              height={this.props.height}
              maxFileSize={this.props.maxFileSize}
              defaultFile={file.value}
              defaultSrc={this.props.defaultSrc}
              onChange={this.onChange}
              behaviour={"multi"}
              name={file.name}
            />
          ))}
        {
          //activeUploaders === files.length &&
          <div className="addUploader" onClick={this.addUploader}>
            <i
              className="icon-add"
              style={{ fontSize: "30px", color: "dimgray" }}
            ></i>
          </div>
        }
      </div>
    );
  }
}
