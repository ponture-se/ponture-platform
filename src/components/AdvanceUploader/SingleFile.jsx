import React, { useState, useEffect } from "react";
import ProgressiveSpinner from "../ProgressiveSpinner";
import { storageManager, utility, useGlobalState } from "../../services";

let xhr;
const ListItem = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();

  const [spinner, toggleSpinner] = useState(true);
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    xhr = new XMLHttpRequest();
    async function upload() {
      try {
        const url = process.env.REACT_APP_FILE_UPLOADER_URL;
        const token = storageManager.getItem("token");

        xhr.open("POST", url);
        xhr.onload = () => {
          const status = xhr.status;
          const result = JSON.parse(xhr.response);
          toggleSpinner(false);
          switch (status) {
            case 200:
              const { file } = result;
              file.id = props.file.id;
              preview();
              props.onUploadEnded(file);
              break;
            case 400:
              break;
            case 401:
              break;
            case 404:
              break;
            case 500:
              break;
            default:
              break;
          }
        };
        var formdata = new FormData();
        formdata.append("file", props.file.data, props.file.data.name);

        if (xhr.upload) {
          xhr.upload.onprogress = event => {
            if (event.lengthComputable) {
              setProgressPercentage(
                Math.round((event.loaded / event.total) * 100).toString()
              );
            }
          };
        }
        xhr.setRequestHeader("authorization", "Bearer " + token);
        xhr.setRequestHeader("spaceId", spaceInfo.id);
        await xhr.send(formdata);
      } catch (error) {
        toggleSpinner(false);
      }
    }
    upload();
  }, []);

  function remove() {
    props.onRemove(props.file);
  }
  function preview() {
    props.onPreview(props.file);
  }
  function getFileByType() {
    return utility.getMediaLocalFile(props.file.data, "unkownFile");
  }
  function handleCancel() {
    console.log(xhr);
    xhr.abort();
    remove();
  }
  return (
    <div className="listItem" title={!spinner && props.file.data.name}>
      {spinner && (
        <div className="listItem-spinner">
          <ProgressiveSpinner
            value={progressPercentage}
            onCancel={handleCancel}
          />
        </div>
      )}
      {!spinner && (
        <>
          <div
            className="listItem-preview"
          >
            {getFileByType()}
          </div>
          <div className="listItem-remove" onClick={remove}>
            <i className="icon-bin" />
          </div>
        </>
      )}
    </div>
  );
};

export default ListItem;
