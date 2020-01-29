import Cookies from "js-cookie";
const axios = require("axios");
const config = process.env;
const baseUrl = config.REACT_APP_BASE_URL;
const loginUrl = baseUrl + config.REACT_APP_CUSTOMER_LOGIN;
const myAppsUrl = baseUrl + config.REACT_APP_MY_APPS;
const cancelAppUrl = baseUrl + config.REACT_APP_CANCEL_APP;
const offersUrl = baseUrl + config.REACT_APP_REQUEST_OFFERS;
const rejectOfferUrl = baseUrl + config.REACT_APP_REJECT_OFFER;
const acceptOfferUrl = baseUrl + config.REACT_APP_ACCEPT_OFFER;
const openAppUrl = baseUrl + config.REACT_APP_OPEN_APP;
const agentLoginUrl = baseUrl + config.REACT_APP_AGENT_LOGIN;
const uploadFileUrl = baseUrl + config.REACT_APP_UPLOAD_FILE;
const getAppAttachmentUrl = baseUrl + config.REACT_APP_GET_APP_ATTACHMENT;
export function customerLogin() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = data => {
    const url = loginUrl;
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: data
    })
      .then(response => {
        const data = response.data ? response.data : {};
        const { userInfo, access_token } = data;
        Cookies.set("@ponture-customer-portal/token", access_token);
        _onOk(userInfo);
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function getMyApplications() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = userInfo => {
    const { currentRole, id } = userInfo;
    const paramName = currentRole === "agent" ? "broker_id" : "customerId";
    const url = myAppsUrl + `?${paramName}=${id}`;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function getOffers() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = appId => {
    const url = offersUrl.replace("_id", appId);
    const token = Cookies.get("@ponture-customer-portal/token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        return _onOk();
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function cancelApplication() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = ({ appId }) => {
    const url = cancelAppUrl.replace("_id", appId);
    const token = Cookies.get("@ponture-customer-portal/token");
    axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function rejectOffer() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = ({ offerId }) => {
    const url = rejectOfferUrl + "?offerId=" + offerId;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function acceptOffer() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = offerId => {
    const url = acceptOfferUrl + "?offerId=" + offerId;
    const token = Cookies.get("@ponture-customer-portal/token");

    axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function agentLogin() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  const _call = (username, password) => {
    const url = agentLoginUrl;
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        username: username,
        password: password
      }
    })
      .then(response => {
        const data = response.data ? response.data : {};
        const { access_token } = data.data;
        Cookies.set("@ponture-customer-portal/token", access_token);
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function uploadFile() {
  //
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onProgressCallBack;
  function _onProgress(result) {
    if (_onProgressCallBack) {
      _onProgressCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }
  let _onCancelCallBack;
  function _onCancel(result) {
    if (_onCancelCallBack) {
      _onCancelCallBack(result);
    }
  }
  let _cancelCallBack;
  function _cancel(result) {
    if (_cancelCallBack) {
      _cancelCallBack(result);
    }
  }
  let _onInvalidRequestCallback;
  function _onInvalidRequest(result) {
    if (_onInvalidRequestCallback) {
      _onInvalidRequestCallback(result);
    }
  }
  const _call = (fileData, progress) => {
    const CancelToken = axios.CancelToken;
    const url = uploadFileUrl;
    axios({
      method: "post",
      url: url,
      headers: {
        // "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*"
      },
      onUploadProgress: progressEvent => {
        const totalLength = progressEvent.lengthComputable
          ? progressEvent.total
          : progressEvent.target.getResponseHeader("content-length") ||
            progressEvent.target.getResponseHeader(
              "x-decompressed-content-length"
            );
        let progressPercentage = 0;
        if (totalLength !== null) {
          progressPercentage = Math.round(
            (progressEvent.loaded * 100) / totalLength
          );
          return progress({
            totalLength: totalLength,
            uploadedLength: progressEvent.loaded,
            progress: progressPercentage
          });
        }
      },
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        _cancel(c); //passes an executable function to the onCancelUpload method
      }),
      data: fileData
    })
      .then(response => {
        const data = response.data ? response.data : {};
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 200:
              break;
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            case 503:
              _onServerError();
            case "canceled":
              _onCancel();
              break;
            case 422:
              _onInvalidRequest();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    cancel: function(callback) {
      _cancelCallBack = callback;
      return this;
    },
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onCancel: function(callback) {
      _onCancelCallBack = callback;
      return this;
    },
    onProgress: function(callback) {
      _onProgressCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    onInvalidRequest: function(callback) {
      _onInvalidRequestCallback = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}

export function downloadAppAsset() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = async attId => {
    const url = getAppAttachmentUrl;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios({
      method: "get",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      params: {
        fileId: attId
      }
    })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
export function getApplicationById() {
  let _onOkCallBack;
  function _onOk(result) {
    if (_onOkCallBack) {
      _onOkCallBack(result);
    }
  }
  let _onServerErrorCallBack;
  function _onServerError(result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result);
    }
  }
  let _onBadRequestCallBack;
  function _onBadRequest(result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result);
    }
  }
  let _unAuthorizedCallBack;
  function _unAuthorized(result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result);
    }
  }
  let _notFoundCallBack;
  function _notFound(result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result);
    }
  }
  let _onRequestErrorCallBack;
  function _onRequestError(result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result);
    }
  }
  let _unKnownErrorCallBack;
  function _unKnownError(result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result);
    }
  }

  const _call = async oppID => {
    const url = openAppUrl;
    axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        oppID
      }
    })
      .then(response => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch(error => {
        if (error.response) {
          const status = error.response.status;
          switch (status) {
            case 400:
              _onBadRequest();
              break;
            case 401:
              _unAuthorized();
              break;
            case 404:
              _notFound();
              break;
            case 500:
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        }
      });
  };

  return {
    call: _call,
    onOk: function(callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function(callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function(callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function(callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function(callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function(callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function(callback) {
      _unKnownErrorCallBack = callback;
      return this;
    }
  };
}
