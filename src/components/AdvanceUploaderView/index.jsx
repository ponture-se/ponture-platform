import React, { useState, useEffect, useRef } from "react";
import "cropperjs/dist/cropper.css";
import "./styles.scss";
import { languageManager, utility } from "../../services";
import SVGIcon from "./svg";
import ListItem from "./ListItem";

const UploaderView = props => {
  const currentLang = languageManager.getCurrentLanguage().name;

  const { field, formData } = props;
  const [dropZoneViewBox, toggleDropZoneViewBox] = useState(false);
  const [dropZoneFile, setDropZoneFile] = useState();

  const [files, setFiles] = useState([{}]);

  useEffect(() => {
    if (formData[field.name] && formData[field.name].length > 0) {
      if (field.isList === true) {
        const d = formData[field.name].map(item => {
          return {
            id: Math.random(),
            url: item,
          };
        });
        setFiles(d);
        setDropZoneFile(d[0]);
      } else {
        setDropZoneFile({
          id: Math.random(),
          url: formData[field.name][0],
        });
      }
    }
  }, [formData]);

  // is list functions

  function handlePreview(file) {
    setDropZoneFile(file);
  }
  return (
    <>
      <div className="ad-uploader">
        {field.title && (
          <span className="title">{field.title[currentLang]}</span>
        )}
        {field.description && (
          <span className="description">{field.description[currentLang]}</span>
        )}
        <div className="dropBox">
          {dropZoneFile ? (
            <div className="dropbox-uploadedFile">
              {utility.getAssetIconByURL(
                dropZoneFile.url[currentLang],
                "unknowIcon"
              )}
            </div>
          ) : (
            <div className="dropbox-content">
              <SVGIcon />
              <span>There is no uploaded file</span>
            </div>
          )}
        </div>
      </div>
      {field.isList === true && (
        <div className="isList-files">
          {files.map(file => (
            <ListItem
              key={file.id}
              file={file}
              selectedFile={dropZoneFile}
              onPreview={handlePreview}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default UploaderView;
