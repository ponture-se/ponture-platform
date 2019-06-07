import React, { useState, useEffect } from "react";
import { utility, languageManager } from "../../services";

const currentLang = languageManager.getCurrentLanguage().name;

const ListItem = props => {
  const [isActive, setActive] = useState(false);

  useEffect(() => {
    if (props.selectedFile) {
      if (props.selectedFile.id === props.file.id) {
        setActive(true);
      } else {
        setActive(false);
      }
    } else setActive(false);
  }, [props.selectedFile]);

  function preview() {
    props.onPreview(props.file);
  }
  function getFileByType() {
    return props.file.url ? (
      utility.getAssetIconByURL(props.file.url[currentLang], "unkownFile")
    ) : (
      <div />
    );
  }

  return (
    <div className="listItem">
      <div
        className={"listItem-preview " + (isActive ? "active" : "")}
        onClick={preview}
      >
        {getFileByType()}
      </div>
      {isActive && (
        <div className="listItem-selected">
          <i className="icon-checkmark" />
        </div>
      )}
      <div className="listItem-name">{props.file.name || "File name"}</div>
    </div>
  );
};

export default ListItem;
