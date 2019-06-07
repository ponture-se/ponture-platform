import React, { useState, useEffect, useRef } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter } from "reactstrap";
import { languageManager, useGlobalState } from "./../../services";
import { getRoles } from "./../../Api/userManagement-api";
import "./styles.scss";

const AssignRole = props => {
  const [{ spaceInfo }, dispatch] = useGlobalState();
  const currentLang = languageManager.getCurrentLanguage().name;
  let items = props.roles ? props.roles : [];
  const [allData, setData] = useState([]);
  const [isOpen, toggleModal] = useState(true);
  useEffect(() => {
    if (spaceInfo && spaceInfo.roles) {
      let d = JSON.parse(JSON.stringify(spaceInfo.roles));
      for (let j = 0; j < items.length; j++) {
        for (let i = 0; i < d.length; i++) {
          if (items[j].name === d[i].name) {
            d[i].selected = true;
            break;
          }
        }
      }
      setData(d);
    }
    // getRoles()
    //   .onOk(result => {
    //     let d = JSON.parse(JSON.stringify( result ));
    //     for (let j = 0; j < items.length; j++) {
    //       for (let i = 0; i < d.length; i++) {
    //         if (items[j].name === d[i].name) {
    //           d[i].selected = true;
    //           break;
    //         }
    //       }
    //     }
    //     setData(d);
    //   })
    //   .onServerError(result => {
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "error",
    //         message: languageManager.translate("CONTENT_TYPE_ON_SERVER_ERROR")
    //       }
    //     });
    //   })
    //   .onBadRequest(result => {
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "error",
    //         message: languageManager.translate("CONTENT_TYPE_ON_BAD_REQUEST")
    //       }
    //     });
    //   })
    //   .unAuthorized(result => {
    //     dispatch({
    //       type: "ADD_NOTIFY",
    //       value: {
    //         type: "warning",
    //         message: languageManager.translate("CONTENT_TYPE_UN_AUTHORIZED")
    //       }
    //     });
    //   })
    //   .call();

    return () => {
      allData.map(d => delete d.selected);
      if (!props.isOpen) toggleModal(false);
    };
  }, []);
  function closeModal() {
    props.onClose(undefined);
  }
  function saveChanges() {
    const roles = allData.filter(role => role.selected);
    props.onClose(roles);
  }
  function handleChooseItem(event, item) {
    const newData = allData.map(role => {
      if (role.name === item.name) role.selected = event.target.checked;
      return role;
    });
    setData(newData);
  }
  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>{props.headerTitle}</ModalHeader>
      <ModalBody>
        {allData.map(item => (
          <label key={item.name} for={item.name} className="itemTypeModal">
            <div className="itemTypeModal-left">
              <div className="itemType-icon">
                <i className="icon-item-type" />
              </div>
              <div className="itemType-center">
                <span className="itemType-title">
                  {item.title[currentLang]}
                </span>
                <span className="itemType-description">
                  {"Lorem ipsum mmory catch"}
                </span>
              </div>
            </div>
            <div className="itemTypeModal-right">
              <label className="switch ">
                <input
                  type="checkbox"
                  className="primary"
                  onChange={e => handleChooseItem(e, item)}
                  checked={item.selected}
                  id={item.name}
                />
                <span className="slider" />
              </label>
            </div>
          </label>
        ))}
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={saveChanges}>
          {languageManager.translate("ASSIGN_ROLE_SAVE_BTN")}
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignRole;
