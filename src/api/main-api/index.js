import Cookies from "js-cookie";

const axios = require("axios");
const config = process.env;
const baseUrl = config.REACT_APP_BASE_URL;
const loginUrl = baseUrl + config.REACT_APP_CUSTOMER_LOGIN;
const myAppsUrl = baseUrl + config.REACT_APP_MY_APPS;
const cancelAppUrl = baseUrl + config.REACT_APP_CANCEL_APP;
const offersUrl = baseUrl + config.REACT_APP_REQUEST_OFFERS;
const latestOffersUrl = baseUrl + "/apply/offersOfLatestOpp";
const rejectOfferUrl = baseUrl + config.REACT_APP_REJECT_OFFER;
const acceptOfferUrl = baseUrl + config.REACT_APP_ACCEPT_OFFER;

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

  const _call = (data) => {
    const url = loginUrl;
    axios({
      method: "post",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((response) => {
        const data = response.data ? response.data : {};
        const { userInfo, access_token } = data;
        Cookies.set("@ponture-customer-portal/token", access_token);
        _onOk(userInfo);
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
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

  const _call = (customerId) => {
    const url = myAppsUrl + `?customerId=${customerId}`;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
export function getLatestOffers() {
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

  const _call = (personalNum) => {
    const url = latestOffersUrl + `?personalNum=${personalNum}`;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
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

  const _call = (appId) => {
    const url = offersUrl.replace("_id", appId);
    const token = Cookies.get("@ponture-customer-portal/token");
    axios
      .get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
        // return _onOk();
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
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
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
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

  const _call = (offerId, phoneNumber, email) => {
    const url =
      acceptOfferUrl +
      "?offerId=" +
      offerId +
      "&email=" +
      email +
      "&phoneNumber=" +
      phoneNumber;
    const token = Cookies.get("@ponture-customer-portal/token");
    axios({
      method: "put",
      url: url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        _onOk(
          response.data
            ? response.data.data
              ? response.data.data
              : undefined
            : undefined
        );
      })
      .catch((error) => {
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
    onOk: function (callback) {
      _onOkCallBack = callback;
      return this;
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback;
      return this;
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback;
      return this;
    },
    notFound: function (callback) {
      _notFoundCallBack = callback;
      return this;
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback;
      return this;
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback;
      return this;
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback;
      return this;
    },
  };
}
