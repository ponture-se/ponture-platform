import React, { useState, useEffect, useRef } from "react";
import "cropperjs/dist/cropper.css";
import "./styles.scss";
import { languageManager, useGlobalState, utility } from "../../services";
import AssetFile from "./../AssetFile";
import ImageEditorModal from "./ImageEditorModal";
import { uploadAssetFile } from "./../../Api/asset-api";

const FileUploaderInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const [{}, dispatch] = useGlobalState();

  const [editorModal, toggleEditorModal] = useState(false);
  const { field, formData } = props;
  const [image, setEditImage] = useState();
  const [isUploading, toggleIsUploading] = useState(false);
  const [progressPercentage, setPercentage] = useState("0");
  const [selectedFile, setSelectedFile] = useState();

  const [files, setFiles] = useState(() => {
    if (formData[field.name]) {
      let fs = [];
      fs.push({
        id: Math.random(),
        url: formData[field.name][currentLang],
        fileType: formData["fileType"],
        name: formData["name"],
      });
      return fs;
    }
    return [];
  });

  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true) props.init(field.name, true);

      let fs = [];
      fs.push({
        id: Math.random(),
        url: formData[field.name][currentLang],
        fileType: formData["fileType"],
        name: formData["name"],
      });
      setFiles(fs);
    } else {
      if (field.isRequired === true) props.init(field.name, false);

      if (files.length > 0) {
        setFiles([]);
      }
    }
  }, [formData]);

  function handleChange(event) {
    if (!isUploading) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file.type.includes("image")) {
          toggleEditorModal(true);
        } else {
          toggleIsUploading(true);
          uploadFile(file);
        }
      }
    }
  }
  function uploadFile(file) {
    uploadAssetFile()
      .onOk(result => {
        const { file } = result;
        addToList(file);
        setTimeout(() => {
          toggleIsUploading(false);
        }, 200);
      })
      .onServerError(result => {})
      .onBadRequest(result => {})
      .unAuthorized(result => {})
      .onProgress(result => {
        setPercentage(result);
      })
      .call(file);
  }
  function removeFile(f) {
    const fs = files.filter(file => file.id !== f.id);
    setFiles(fs);

    if (field.isRequired) {
      if (field.isList !== undefined && field.isList) {
        if (fs.length === 0) props.onChangeValue(field.name, fs, false);
        else props.onChangeValue(field, fs, true);
      } else {
        if (fs.length === 0) {
          if (field.isTranslate) {
            props.onChangeValue(field, undefined, false);
          } else props.onChangeValue(field, undefined, false);
        }
      }
    } else {
      props.onChangeValue(field.name, fs, true);
    }
  }
  function addToList(file) {
    let obj = {
      id: Math.random().toString(),
      url: process.env.REACT_APP_DOWNLOAD_FILE_BASE_URL + file.url,
      name: file.originalname,
      fileType: file.mimetype,
    };
    if (field.isList !== undefined && field.isList) {
      let fs = [...files];
      fs.push(obj);
      setFiles(fs);
      props.onChangeValue(field, fs, true);
    } else {
      let fs = [];
      fs.push(obj);
      setFiles(fs);
      let f, l;
      if (field.isTranslate) {
        l = utility.applyeLangs(fs[0].url);
        f = { ...fs[0], ...l };
      }
      props.onChangeValue(field, f, true);
    }
  }
  function onCloseEditor(result) {
    toggleEditorModal(false);
    if (result) {
      addToList(result);
    }
  }
  return (
    <>
      <div className="up-uploader">
        <span className="title">{field.title[currentLang]}</span>
        <span className="description">{field.description[currentLang]}</span>
        <div className="files">
          {files.map(file => (
            <div key={file.id} className="files-uploaded">
              <div
                className="files-uploaded-icon"
                onClick={() => removeFile(file)}
              >
                <i className="icon-bin" />
              </div>
              <div className="updatedFileType">
                {file.fileType ? (
                  file.fileType.toLowerCase().includes("image") ? (
                    <img src={file.url} alt="" />
                  ) : file.fileType.toLowerCase().includes("video") ? (
                    <i className="icon-video" />
                  ) : file.fileType.toLowerCase().includes("audio") ? (
                    <i className="icon-audio" />
                  ) : file.fileType.toLowerCase().includes("pdf") ? (
                    <i className="icon-pdf" />
                  ) : file.fileType.toLowerCase().includes("spreadsheet") ? (
                    <i className="icon-spreadsheet" />
                  ) : (
                    <AssetFile file={file} class="fileUploader" />
                  )
                ) : (
                  <AssetFile file={file} class="fileUploader" />
                )}
              </div>
            </div>
          ))}
          <div className="files-input">
            <input
              type="file"
              className="btn"
              onChange={handleChange}
              accept={
                field.fileType
                  ? field.fileType === "image"
                    ? "image/*"
                    : field.fileType === "video"
                    ? "video/*"
                    : field.fileType === "audio"
                    ? "audio/*"
                    : field.fileType === "pdf"
                    ? ".pdf"
                    : field.fileType === "spreadsheet"
                    ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    : "/*"
                  : "/*"
              }
            />
            {field.mediaType === "all" ? (
              <i className="icon-file-plus-o" />
            ) : field.mediaType === "image" ? (
              <i className="icon-camera" />
            ) : (
              <i className="icon-file-plus-o" />
            )}
          </div>
        </div>
        {isUploading && (
          <>
            <span style={{ marginBottom: 10 }}>{selectedFile.name}</span>
            <div className="progress">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: progressPercentage + "%" }}
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {progressPercentage + "%"}
              </div>
            </div>
          </>
        )}
      </div>
      {editorModal && (
        <ImageEditorModal
          image={selectedFile}
          isOpen={editorModal}
          onClose={onCloseEditor}
        />
      )}
    </>
  );
};

export default FileUploaderInput;
