import React from "react";
import { uploadFile } from "../../api/main-api/";
import "./index.scss";
import classnames from "classnames";
export default class UploaderApiIncluded extends React.Component {
  constructor(props) {
    super(props);
    const src = props.defaultSrc;
    const { messages, width, height, maxFileSize } = props;
    const componentConfig = {
      iconFiletypes: [".jpg", ".png", ".gif"],
      showFiletypeIcon: true,
      postUrl: ""
    };
    this.state = {
      progress: 0,
      selectedImgUrl: props.defaultUrl, //? DownloadAsset(props.defaultUrl) : "",
      uploading: false,
      uploaded: false
    };
    this.fileRef = React.createRef();
  }
  toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = () =>
        resolve(
          (() => {
            let b64 = btoa(reader.result);
            b64 = b64.split(" ").join("+");
            return b64;
          })()
        );
      reader.onerror = error => reject(error);
    });
  upload = file => {
    this.setState({ uploading: true });
    const _file = file.target.files[0];
    const newForm = new FormData();
    this.toBase64(_file).then(b64 => {
      // newForm.append("title", _file.name);
      // newForm.append("fileExtension", _file.type);
      // newForm.append("content", encodeURIComponent(b64));
      // _callback(newForm);
      _callback(
        `title=${encodeURIComponent(
          _file.name
        )}&fileExtension=${encodeURIComponent(
          _file.type
        )}&content=${encodeURIComponent(b64)}`
      );
    });
    const _callback = file => {
      uploadFile()
        .onOk(result => {
          // console.log("succes result: ", result);
          // if (this.props.defaultUrl) {
          //   // res.data["prev_file"] = this.props.defaultUrl;
          //   // res.data["replace"] = true;
          // } else {
          //   // res.data["replace"] = false;
          // }
          this.props.onChange(this.props.name, result);
          this.setState({
            selectedImgUrl: "url",
            uploaded: true //DownloadAsset(result.data.file.filename)
          });
          this.setState({ uploading: false });
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
          this.setState({ uploading: false });
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
          this.setState({ uploading: false });
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
          this.setState({ uploading: false });
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
          this.setState({ uploading: false });
          console.log("Bad request", result);
        })
        .call(file);
    };
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
    return (
      <div
        className={classnames(
          "ImageUploaderApiIncluded",
          this.state.selectedImgUrl ? "hasImage" : ""
        )}
        style={styleExporter("imgWrapperStyle")}
      >
        {this.state.selectedImgUrl && (
          <img
            src={this.state.selectedImgUrl}
            alt={`uploader+${this.props.name}`}
            style={styleExporter("imageStyle")}
          />
        )}
        {this.state.uploading ? (
          <span style={{ color: "black", direction: "ltr", zIndex: "1" }}>
            {this.state.progress} %
          </span>
        ) : (
          <span
            style={{
              display: "flex",
              selfAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "dimgray",
              cursor: "pointer",
              backgroundColor: this.state.selectedImgUrl
                ? "rgba(100, 100, 100, 0.8)"
                : "transparent",
              padding: "5px",
              borderRadius: "5px",
              zIndex: "1"
            }}
            className="selectorButton"
            onClick={() => this.fileRef.current.click()}
          >
            {!this.state.uploaded ? this.props.innerText : "Completed"}
          </span>
        )}
        <input
          type="file"
          name={this.props.name}
          style={{ display: "none" }}
          onChange={this.upload}
          ref={this.fileRef}
        />
      </div>
    );
  }
}
