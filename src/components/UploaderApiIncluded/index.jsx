import React from "react";
import { uploadFile } from "../../api/main-api/";
import "./index.scss";
import classnames from "classnames";
import axios from "axios";
import { downloadAppAsset } from "api/main-api";
import { CircleSpinner } from "components";
export default class UploaderApiIncluded extends React.Component {
  constructor(props) {
    super(props);
    const src = props.defaultSrc;
    const { messages, width, height, maxFileSize, defaultFile } = props;

    const componentConfig = {
      iconFiletypes: [".jpg", ".png", ".gif"],
      showFiletypeIcon: true,
      postUrl: ""
    };
    this.initialStates = {
      progress: 0,
      // selectedImgUrl: false, //props.defaultUrl, //? DownloadAsset(props.defaultUrl) : "",
      uploading: false,
      uploaded: false,
      uploadedFileName: "",
      cancelUpload: undefined,
      defaultFile: undefined,
      downloading: false
    };
    this.state = {
      ...this.initialStates,
      defaultFile: defaultFile
    };
    this.fileRef = React.createRef();
  }
  // toBase64 = file =>
  //   new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsBinaryString(file);
  //     reader.onload = () =>
  //       resolve(
  //         (() => {
  //           let b64 = btoa(reader.result);
  //           b64 = b64.split(" ").join("+");
  //           return b64;
  //         })()
  //       );
  //     reader.onerror = error => reject(error);
  //   });
  resetFile = () => {
    this.setState(
      {
        ...this.initialStates
      },
      () => {
        this.fileRef.current.value = "";
        this.props.onChange(this.props.name, "");
      }
    );
  };
  upload = file => {
    this.setState({ uploading: true });
    const _file = file.target.files[0];
    const _this = this;
    const newForm = new FormData();
    // this.toBase64(_file).then(b64 => {
    newForm.append("title", _file.name);
    newForm.append("fileExtension", _file.type);
    newForm.append("file", _file);
    // _callback(newForm);
    // _callback(
    //   `title=${encodeURIComponent(
    //     _file.name
    //   )}&fileExtension=${encodeURIComponent(
    //     _file.type
    //   )}&content=${encodeURIComponent(b64)}`
    // );
    // });
    // const _callback = file => {
    uploadFile()
      .onOk(result => {
        // console.log("succes result: ", result);
        // if (this.props.defaultUrl) {
        //   // res.data["prev_file"] = this.props.defaultUrl;
        //   // res.data["replace"] = true;
        // } else {
        //   // res.data["replace"] = false;
        // }
        _this.setState(
          {
            uploaded: true, //DownloadAsset(result.data.file.filename)
            uploading: false,
            uploadedFileName: _file.name
            // selectedImgUrl: "url",
          },
          () => {
            _this.props.onChange(this.props.name, result);
          }
        );
        //prog => this.setState({ progress: prog.progress }));
        // if (window.analytics)
        // window.analytics.track("BankID Verification", {
        //   category: "Loan Application",
        //   label: "/app/loan/ bankid popup",
        //   value: 0
        // });
        // toggleVerifyingSpinner(false);
        // setStartResult(result);
        // toggleVerifyModal(true);
      })
      .onServerError(result => {
        // if (!didCancel) {
        // toggleVerifyingSpinner(false);
        // changeTab(3);
        // setError({
        //   sender: "verifyBankId"
        // });
        // }
        _this.setState({ uploading: false });
        console.log("server error ", result);
      })
      .onBadRequest(result => {
        // if (!didCancel) {
        //   toggleVerifyingSpinner(false);
        //   changeTab(3);
        //   setError({
        //     sender: "verifyBankId"
        //   });
        // }
        _this.setState({ uploading: false });
        console.log("Bad request", result);
      })
      .unAuthorized(result => {
        // if (!didCancel) {
        //   toggleVerifyingSpinner(false);
        //   changeTab(3);
        //   setError({
        //     sender: "verifyBankId"
        //   });
        // }
        _this.setState({ uploading: false });
        console.log("Bad request", result);
      })
      .unKnownError(result => {
        // if (!didCancel) {
        //   toggleVerifyingSpinner(false);
        //   changeTab(3);
        //   setError({
        //     sender: "verifyBankId"
        //   });
        // }
        _this.setState({ uploading: false });
        console.log("Bad request", result);
      })
      .onCancel(() => {
        _this.setState(
          {
            ...this.initialStates
          },
          () => {
            this.fileRef.current.value = "";
          }
        );
      })
      .cancel(func => {
        if (typeof func === "function") {
          _this.setState({
            cancelUpload: func
          });
        }
      })
      .call(newForm, res => {
        _this.setState({ progress: res.progress });
      });
    // };
  };
  styleExporter = name => {
    let grabbedStyle = {};
    switch (name) {
      case "imgWrapperStyle":
        grabbedStyle = {
          border: "2px solid lightgray",
          width: "110px",
          height: "110px",
          borderRadius: "1px",
          color: "black",
          fontWeight: "bold",
          fontSize: "20px",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "whitesmoke",
          margin: "10px"
        };
        break;
      case "imageStyle":
        grabbedStyle = {
          width: "110px",
          height: "110px",
          display: this.state.selectedImgUrl ? "block" : "none",
          position: "absolute"
        };
        break;
      default:
        break;
    }
    return grabbedStyle;
  };
  render() {
    const { styleExporter } = this;
    const { cancelUpload, defaultFile, downloading } = this.state;
    const fileId = typeof defaultFile === "string" ? defaultFile : undefined;
    return (
      <div className="IUAI">
        <div
          className={classnames(
            "IUAI__item",
            this.state.selectedImgUrl ? "hasImage" : ""
          )}
          style={styleExporter("imgWrapperStyle")}
        >
          {/* {this.state.selectedImgUrl && (
            <img
              src={this.state.selectedImgUrl}
              alt={`uploader+${this.props.name}`}
              style={styleExporter("imageStyle")}
            />
          )} */}
          {this.state.uploading ? (
            <>
              <span
                className="icon-cross cancelButton"
                onClick={cancelUpload}
              ></span>
              <span style={{ color: "black", direction: "ltr", zIndex: "1" }}>
                {this.state.progress} %
              </span>
            </>
          ) : !this.state.uploaded && !fileId ? (
            <span
              className="fileName"
              style={{ fontSize: "16px", cursor: "pointer" }}
              onClick={() =>
                !this.state.uploaded && this.fileRef.current.click()
              }
            >
              {this.props.innerText || "Select File"}
            </span>
          ) : !fileId ? (
            <>
              <span
                className="icon-cross cancelButton"
                onClick={this.resetFile}
              ></span>
              <span className="fileName">{this.state.uploadedFileName}</span>
            </>
          ) : (
            <>
              <span
                className="icon-cross cancelButton"
                onClick={this.resetFile}
              ></span>
              <span
                className="fileName"
                style={{
                  fontSize: "16px",
                  cursor: "pointer",
                  fontFamily: "OpenSanceBold"
                }}
                disabled={downloading}
              >
                {downloading ? (
                  <CircleSpinner show={true} size={"medium"} bgColor={"gray"} />
                ) : (
                  <a
                    href={downloadAppAsset.call(this, fileId)}
                    style={{ color: "black" }}
                    target="_blank"
                  >
                    File Attached (Download)
                  </a>
                )}
              </span>
            </>
          )}
          <input
            type="file"
            name={this.props.name}
            style={{ display: "none" }}
            onChange={this.upload}
            ref={this.fileRef}
          />
        </div>
        {/* {this.state.uploaded && (
          <span
            style={{ marginTop: "20px", fontSize: "13px", color: "black" }}
            onClick={() => this.fileRef.current.click()}
          >
            <strong>Change file</strong>
          </span>
        )} */}
      </div>
    );
  }
}
