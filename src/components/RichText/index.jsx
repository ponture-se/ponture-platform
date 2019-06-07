import React, { useState, useEffect } from "react";
import {
  EditorState,
  convertToRaw,
  ContentState,
  contentBlock,
  AtomicBlockUtils,
  Entity,
  RichUtils,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "./../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import "./styles.scss";
import { languageManager, utility } from "../../services";
import AssetBrowser from "./../AssetBrowser";

const RichTextInput = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const { field, formData } = props;

  const [assetBrowser, toggleAssetBrowser] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  //  set value to input
  useEffect(() => {
    if (formData[field.name]) {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, true);
      if (field.isTranslate) initValue(props.formData[field.name][currentLang]);
      else initValue(props.formData[field.name]);
    } else {
      if (field.isRequired === true)
        if (props.init) props.init(field.name, false);
      initValue("<p></p>");
    }
  }, [formData]);

  function initValue(content) {
    const blocksFromHtml = htmlToDraft(content);
    const { contentBlocks, entityMap } = blocksFromHtml;
    const contentState = ContentState.createFromBlockArray(
      contentBlocks,
      entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
  }
  function setValueToParentForm(inputValue) {
    let value;
    if (field.isTranslate) value = utility.applyeLangs(inputValue);
    else value = inputValue;

    if (field.isRequired) {
      let isValid = false;
      if (inputValue.length > 0) {
        isValid = true;
      }
      if (props.onChangeValue) props.onChangeValue(field, value, isValid);
    } else {
      if (props.onChangeValue) props.onChangeValue(field, value, true);
    }
  }
  function handleOnChange(content) {
    setEditorState(content);
    setValueToParentForm(
      draftToHtml(convertToRaw(content.getCurrentContent()))
    );
  }

  function openAssetBrowser() {
    toggleAssetBrowser(true);
  }
  function _addMedia(url) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "IMAGE",
      "MUTABLE",
      { src: url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });

    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  }
  function handleChooseAsset(asset) {
    toggleAssetBrowser(false);
    if (asset) {
      handleOnChange(_addMedia(asset.url[currentLang]));
    }
  }
  function mediaBlockRenderer(block) {
    if (block.getType() === "atomic") {
      return {
        component: Media,
        editable: false,
      };
    }
    return null;
  }

  return (
    <>
      <Editor
        readOnly={props.viewMode}
        toolbarHidden={props.viewMode}
        blockRendererFn={mediaBlockRenderer}
        editorState={editorState}
        onEditorStateChange={handleOnChange}
        wrapperClassName="wrapper-class"
        editorClassName="editor-class"
        toolbarClassName="toolbar-class"
        toolbarCustomButtons={[
          <div className="richText-header-customBtn" onClick={openAssetBrowser}>
            <i className="icon-images" />
          </div>,
        ]}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "fontFamily",
            "list",
            "textAlign",
            "colorPicker",
            "link",
            "embedded",
            "emoji",
            // "image",
            "remove",
            "history",
          ],
          inline: { inDropdown: true },
          list: { inDropdown: true },
          textAlign: {},
          link: { inDropdown: true },
          history: {},
        }}
      />
      {assetBrowser && (
        <AssetBrowser
          isOpen={assetBrowser}
          onCloseModal={handleChooseAsset}
          mediaType={"image"}
        />
      )}
    </>
  );
};

export default RichTextInput;

const Media = props => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === "IMAGE") {
    media = <img src={src} alt="" style={{ width: "auto", height: "auto" }} />;
  }

  return media;
};
