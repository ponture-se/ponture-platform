import Cookies from "js-cookie";
const axios = require("axios");

const config = process.env;
const baseUrl = config.REACT_APP_BASE_URL;
const needsListUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_NEEDS_LIST;
const startUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_START;
const collectUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_COLLECT;
const cancelUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_CANCEL;
const companiesUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_GET_COMPANIES;
const submitUrl = baseUrl + config.REACT_APP_BUSINESS_SILENT_SUBMIT;
const saveUrl = baseUrl + config.REACT_APP_SAVE_LOAN;
export function getNeedsList() {
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

  const _call = (lang = "sv") => {
    const url = needsListUrl + "?lang=" + lang;
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
      })
      .catch(error => {
        if (window.analytics)
          window.analytics.track("Failure", {
            category: "Loan Application",
            label: "/app/loan/wizard",
            value: 0
          });
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
        } else {
          _unKnownError();
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
export function startBankId() {
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

  const _call = personalNumber => {
    const url = startUrl;
    axios({
      method: "post",
      url: url,
      headers: {
        Accept: "application/json"
      },
      data: {
        personalNumber: personalNumber
      }
    })
      .then(response => {
        Cookies.set(
          "@pontrue-wizard/token",
          response.data ? response.data.access_token : null
        );
        _onOk(response.data ? response.data : undefined);
      })
      .catch(error => {
        if (window.analytics)
          window.analytics.track("Failure", {
            category: "Loan Application",
            label: "/app/loan/wizard",
            value: 0
          });
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
        } else {
          _unKnownError();
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
export function collect() {
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

  const _call = () => {
    const url = collectUrl;
    const token = Cookies.get("@pontrue-wizard/token");
    axios
      .get(url, {
        timeout: 300000,
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
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
        } else {
          _unKnownError();
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
export function cancelVerify() {
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

  const _call = async () => {
    const url = cancelUrl;
    const token = Cookies.get("@pontrue-wizard/token");
    axios({
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      data: {}
    })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
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
        } else {
          _unKnownError();
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
export function getCompanies() {
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

  const _call = personalNumber => {
    const url = companiesUrl + "?personalNumber=" + personalNumber;
    axios
      .get(url)
      .then(response => {
        _onOk(response.data ? response.data.data : undefined);
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
              if (window.analytics)
                window.analytics.track("Failure", {
                  category: "Loan Application",
                  label: "/app/loan/wizard",
                  value: 0
                });
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        } else {
          _unKnownError();
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
export function submitLoan() {
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
  let _onInvalidRequestCallback;
  function _onInvalidRequest(result) {
    if (_onInvalidRequestCallback) {
      _onInvalidRequestCallback(result);
    }
  }
  const _call = (loan, isLogin) => {
    const url = submitUrl;
    const token = isLogin
      ? Cookies.get("@ponture-customer-portal/token")
      : Cookies.get("@pontrue-wizard/token");
    axios({
      method: "post",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json"
      },
      data: loan
    })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
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
            case 422:
              _onInvalidRequest();
              break;
            case 500:
              if (window.analytics)
                window.analytics.track("Failure", {
                  category: "Loan Application",
                  label: "/app/loan/wizard",
                  value: 0
                });
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        } else {
          _unKnownError();
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
    onInvalidRequest: function(callback) {
      _onInvalidRequestCallback = callback;
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

export function saveLoan(permission) {
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

  const _call = (loan, isLogin) => {
    const url = saveUrl;
    const token = isLogin
      ? Cookies.get("@ponture-customer-portal/token")
      : Cookies.get("@pontrue-wizard/token");
    const additionalHeaders =
      permission === "customer" || permission === "admin"
        ? { Authorization: `Bearer ${token}` }
        : {};
    axios({
      method: "post",
      url: url,
      headers: {
        ...additionalHeaders,
        Accept: "application/json"
      },
      data: loan
    })
      .then(response => {
        _onOk(response.data ? response.data : undefined);
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
              if (window.analytics)
                window.analytics.track("Failure", {
                  category: "Loan Application",
                  label: "/app/loan/wizard",
                  value: 0
                });
              _onServerError();
              break;
            default:
              _unKnownError();
              break;
          }
        } else {
          _unKnownError();
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
