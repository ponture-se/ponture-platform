import React, { useState, useRef, useEffect } from "react";
import ImageEditorRc from "../ImageEditorRc";
import "./styles.scss";
import { languageManager, useGlobalState } from "../../services";
import { uploadAssetFile } from "../../Api/asset-api";
import CircleSpinner from "../CircleSpinner";

const ImageEditorModal = props => {
  const [{}, dispatch] = useGlobalState();

  const cropper = useRef(null);
  const prevUrl = URL.createObjectURL(props.image);

  const [imageURL, setImage] = useState(URL.createObjectURL(props.image));
  const [cropBtnsVisbiliity, toggleCropBtnsVisbility] = useState(false);
  const [isCropped, setCropped] = useState(false);
  const [croppedData, setCroppedData] = useState();

  const [isUploading, toggleIsUploading] = useState(false);
  const [progressPercentage, setPercentage] = useState("0");

  function translate(key) {
    return languageManager.translate(key);
  }
  function upload(e) {
    if (!isUploading) {
      const croppedSize = cropper.current.getCropBoxData();
      cropper.current
        .getCroppedCanvas({
          width: croppedSize.width,
          height: croppedSize.width,
        })
        .toBlob(blob => {
          blob.name = props.image.name;
          toggleIsUploading(true);
          uploadAssetFile()
            .onOk(result => {
              toggleIsUploading(false);
              const { file } = result;
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "success",
                  message: languageManager.translate("ASSERS_UPLOAD_ON_OK"),
                },
              });
              props.onClose(file);
            })
            .onServerError(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: languageManager.translate(
                    "ASSERS_UPLOAD_ON_SERVER_ERROR"
                  ),
                },
              });
            })
            .onBadRequest(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "error",
                  message: languageManager.translate(
                    "ASSERS_UPLOAD_ON_BAD_REQUEST"
                  ),
                },
              });
            })
            .unAuthorized(result => {
              toggleIsUploading(false);
              dispatch({
                type: "ADD_NOTIFY",
                value: {
                  type: "warning",
                  message: languageManager.translate(
                    "ASSERS_UPLOAD_UN_AUTHORIZED"
                  ),
                },
              });
            })
            .onProgress(result => {
              setPercentage(result);
            })
            .call(blob);
        });
    }
  }
  function setDragMode(type) {
    cropper.current.setDragMode(type);
  }
  function setZoom(value) {
    cropper.current.zoom(value);
  }
  function rotate(value) {
    cropper.current.rotate(value);
  }
  function flip(type) {
    switch (type) {
      case "horizontal":
        cropper.current.scaleX(-cropper.current.getData().scaleX || -1);
        break;
      case "vertical":
        cropper.current.scaleY(-cropper.current.getData().scaleY || -1);
        break;
      default:
        break;
    }
  }
  function handleCropStart(e) {
    if (!cropBtnsVisbiliity) toggleCropBtnsVisbility(true);
  }
  function doCrop() {
    const obj = {
      croppedData: cropper.current.getData(),
      canvasData: cropper.current.getCanvasData(),
      cropBoxData: cropper.current.getCropBoxData(),
    };
    setCroppedData(obj);
    setCropped(true);
    setImage(
      cropper.current
        .getCroppedCanvas("image/png", {
          fillColor: "#fff",
        })
        .toDataURL("image/png")
    );
    //cropper.current.destroy();
  }
  function clear() {
    cropper.current.clear();
    toggleCropBtnsVisbility(false);
  }
  function restore() {
    toggleCropBtnsVisbility(false);
    setCropped(false);
    setImage(prevUrl);
    cropper.current.setData(croppedData.croppedData);
    cropper.current.setCanvasData(croppedData.canvasData);
    cropper.current.setCropBoxData(croppedData.cropBoxData);
    cropper.current.crop();
  }
  function backToUpsertAsset() {
    if (!isUploading) {
      props.onClose();
    }
  }
  return (
    <div className="imageCropper animated fadeIn">
      <div className="imageCropper-header">
        <div className="imageCropper-header-left">
          <button className="btn btn-light" onClick={backToUpsertAsset}>
            <i className="icon-arrow-left2" />
            {languageManager.translate("CANCEL")}
          </button>
        </div>
        <div className="imageCropper-header-center">
          {isUploading && (
            <>
              <CircleSpinner show={true} size="medium" />
              <span>{progressPercentage + "%"}</span>
            </>
          )}
        </div>
        <div className="imageCropper-header-right">
          {isCropped && (
            <button className="btn btn-light" onClick={restore}>
              <i className="icon-rotate-left" />
            </button>
          )}
          {cropBtnsVisbiliity && !isCropped && (
            <>
              <button
                className="btn btn-light"
                onClick={clear}
                title={translate("ASSET_IMAGE_EDITOR_CLEAR")}
              >
                <i className="icon-blocked" />
              </button>
              <button
                className="btn btn-light"
                onClick={doCrop}
                title={translate("ASSET_IMAGE_EDITOR_CROP_IMAGE")}
              >
                <i className="icon-checkmark" />
              </button>
            </>
          )}
          <button className="btn btn-light uploadBtn" onClick={upload}>
            <i className="icon-cloud-upload" />
            Upload
          </button>
        </div>
      </div>
      <div className="imageCropper-content">
        <ImageEditorRc
          ref={cropper}
          crossOrigin="true" // boolean, set it to true if your image is cors protected or it is hosted on cloud like aws s3 image server
          src={imageURL}
          style={{ height: "100%", width: "100%" }}
          // aspectRatio={16 / 9}
          className="imageEditorContainer"
          guides={true}
          rotatable={true}
          // aspectRatio={16 / 9}
          imageName="image name with extension to download"
          //  saveImage={saveImage} // it has to catch the returned data and do it whatever you want
          responseType="blob/base64"
          highlight={false}
          background={false}
          autoCrop={false}
          dragMode="move"
          restore={true}
          cropend={handleCropStart}
        />
      </div>
      <div className="imageActions">
        <div
          className="imageActions-item"
          onClick={() => setDragMode("move")}
          title={translate("ASSET_IMAGE_EDITOR_MOVE")}
        >
          <i className="icon-move" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => setDragMode("crop")}
          title={translate("ASSET_IMAGE_EDITOR_CROP")}
        >
          <i className="icon-crop-o" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => setZoom(0.1)}
          title={translate("ASSET_IMAGE_EDITOR_ZOOM_IN")}
        >
          <i className="icon-zoom-in" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => setZoom(-0.1)}
          title={translate("ASSET_IMAGE_EDITOR_ZOOM_OUT")}
        >
          <i className="icon-zoom-out" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => rotate(-90)}
          title={translate("ASSET_IMAGE_EDITOR_ROTATE_LEFT")}
        >
          <i className="icon-rotate-left" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => rotate(90)}
          title={translate("ASSET_IMAGE_EDITOR_ROTATE_RIGHT")}
        >
          <i className="icon-rotate-right" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => flip("horizontal")}
          title={translate("ASSET_IMAGE_EDITOR_FLIP_HORIZONTAL")}
        >
          <i className="icon-flip-horizontal" />
        </div>
        <div
          className="imageActions-item"
          onClick={() => flip("vertical")}
          title={translate("ASSET_IMAGE_EDITOR_FLIP_VERTICAL")}
        >
          <i className="icon-flip-vertical" />
        </div>
      </div>
    </div>
  );
};
export default ImageEditorModal;
