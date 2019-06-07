import React, { useState, useEffect } from "react";
import { languageManager, useGlobalState } from "../../../../services";
import { getCategories } from "./../../../../Api/content-api";

const Tree = props => {
  const currentLang = languageManager.getCurrentLanguage().name;
  const [{ categories, spaceInfo }, dispatch] = useGlobalState();
  const [selected, setSelected] = useState({});
  const [idState, setId] = useState({});
  useEffect(() => {
    if (!categories || categories.length === 0) {
      getCategories()
        .onOk(result => {
          dispatch({
            type: "SET_CATEGORIES",
            value: result,
          });
        })
        .onServerError(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CATEGORY_ON_SERVER_ERROR"),
            },
          });
        })
        .onBadRequest(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "error",
              message: languageManager.translate("CATEGORY_ON_BAD_REQUEST"),
            },
          });
        })
        .unAuthorized(result => {
          dispatch({
            type: "ADD_NOTIFY",
            value: {
              type: "warning",
              message: languageManager.translate("CATEGORY_UN_AUTHORIZED"),
            },
          });
        })
        .call(spaceInfo.id);
    }
  }, []);
  useEffect(() => {
    if (Object.keys(selected).length > 0) {
      const c = props.filters.find(item => item.type === "category");
      if (!c) {
        setSelected({});
      }
    }
  }, [props.filters]);
  function toggle(event, node) {
    const id = event.target.getAttribute("id");
    let n_s = { ...idState };
    n_s[id] = !idState[id];
    setId(n_s);
    if (node.items === undefined || node.items.length === 0) {
      if (node._id !== selected._id) {
        setSelected(node);
        props.onCategorySelect(node);
      }
    }
  }
  function mapper(nodes, parentId, lvl) {
    return nodes.map((node, index) => {
      if (node.sys.type !== "contentType") {
        const id = `${node._id}-${parentId ? parentId : "top"}`.replace(
          /[^a-zA-Z0-9-_]/g,
          ""
        );
        return (
          <li
            key={id}
            className="animated fadeIn faster"
            style={{
              paddingLeft: `${25 * lvl}px`,
              color: selected._id === node._id ? "rgb(56,132,255)" : "gray",
            }}
          >
            {node.items && node.items.length > 0 ? (
              <>
                <div>
                  {idState[id] ? (
                    <i
                      className="icon-down-chevron chevron"
                      onClick={e => toggle(e, node)}
                      id={id}
                    />
                  ) : (
                    <i
                      className="icon-right-chevron chevron"
                      onClick={e => toggle(e, node)}
                      id={id}
                    />
                  )}
                  {node.image !== undefined ? (
                    <div className="treeItem-img">
                      <img src={node.image[currentLang]} alt="" />
                    </div>
                  ) : (
                    <div className="treeItem-icon">
                      <div className="contentIcon">
                        <i className="icon-item-type" />
                      </div>
                    </div>
                  )}
                  {node.name[currentLang]}
                </div>
                <ul
                  style={{
                    display: idState[id] ? "block" : "none",
                  }}
                >
                  {mapper(node.items, id, (lvl || 0) + 1)}
                </ul>
              </>
            ) : (
              <div style={{ cursor: "pointer" }}>
                <i className="icon-circle-o circleIcon" />
                {node.image !== undefined ? (
                  <div className="treeItem-img">
                    <img src={node.image[currentLang]} alt="" />
                  </div>
                ) : (
                  <div className="treeItem-icon">
                    <div className="contentIcon">
                      <i className="icon-item-type" />
                    </div>
                  </div>
                )}
                <span onClick={e => toggle(e, node)} id={id}>
                  {node.name[currentLang]}
                </span>
              </div>
            )}
          </li>
        );
      }
      return undefined;
    });
  }

  return (
    <div className="filterBox">
      <div className="filter-header">Categories</div>
      <div className="filter-body">
        <ul>
          {/* <li className="root">
            <i className="icon-right-chevron chevron" />
            All Categories
          </li> */}
          {categories !== undefined &&
            categories.length > 0 &&
            mapper(categories)}
        </ul>
      </div>
    </div>
  );
};

export default Tree;
