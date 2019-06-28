const config = process.env
const baseUrl = config.REACT_APP_BUSINESS_LOAN_BASE_URL
const needsListUrl = baseUrl + config.REACT_APP_BUSINESS_LOAN_NEEDS_LIST
export function getToken () {
  let _onOkCallBack
  function _onOk (result) {
    if (_onOkCallBack) {
      _onOkCallBack(result)
    }
  }
  let _onServerErrorCallBack
  function _onServerError (result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result)
    }
  }
  let _onBadRequestCallBack
  function _onBadRequest (result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result)
    }
  }
  let _unAuthorizedCallBack
  function _unAuthorized (result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result)
    }
  }
  let _notFoundCallBack
  function _notFound (result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result)
    }
  }
  let _onRequestErrorCallBack
  function _onRequestError (result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result)
    }
  }
  let _unKnownErrorCallBack
  function _unKnownError (result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result)
    }
  }

  const _call = async () => {
    try {
      // const url =
      //    'https://test.salesforce.com/services/oauth2/token'
      //   //'https://crmdev-ponture-crmdev.cs84.force.com/services/oauth2/token'

      // let formData = new FormData()
      // formData.append('grant_type', 'password')
      // formData.append(
      //   'client_id',
      //   '3MVG96mGXeuuwTZgBI_DSQZsUSfr_l2y2KTzMuV7RBWYGqMf3gVjVjU_jKumhbFQx7qLZ2TVa7rDr0ATVXRZJ'
      // )
      // formData.append(
      //   'client_secret',
      //   '87C7F37D3430525C138A6E424BCE6D61187273CB69F00067E7DF2299326D812C'
      // )
      // formData.append('username', 'hamed-3eph@force.com.crmdev')
      // formData.append('password', 'ponZXC123!')

      // var rawResponse = await fetch(url, {
      //   method: 'POST',
      //   // mode: 'no-cors',
      //   // type:"cors",
      //   // crossOrigin: true,
      //   // headers: {
      //   //   // 'content-type': 'multipart/form-data;',
      //   //    Accept: 'application/json',
      //   //   'Access-Control-Allow-Origin': '*'
      //   // },
      //   body: formData
      // })
      // const status = rawResponse.status
      // const result = await rawResponse.json()
      const status = 200
      const result = {
        access_token:
          '00D5E000000DGic!ARkAQH0IOQBT0xV76.LoX6rwiCT69IyswwZgJNE6EW.3MCZ1UBYSXMzP7gq4ztYdt8tXDuXdP96hBeLY07tkIQxfb3IgOIk7',
        instance_url: 'https://dev-sb-ponture--crmdev.my.salesforce.com',
        id:
          'https://test.salesforce.com/id/00D5E000000DGicUAG/0051t000002PsClAAK',
        token_type: 'Bearer',
        issued_at: '1561097784827',
        signature: 'q+5O1fPwYZx/Lw1mc/Df6CpJNubH2CDlpPu+fgQAETI='
      }

      switch (status) {
        case 200:
          _onOk(result)
          break
        case 400:
          _onBadRequest()
          break
        case 401:
          _unAuthorized()
          break
        case 404:
          _notFound()
          break
        case 500:
          _onServerError()
          break
        default:
          _unKnownError()
          break
      }
    } catch (error) {
      _onRequestError(error)
    }
  }

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback
      return this
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback
      return this
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback
      return this
    },
    notFound: function (callback) {
      _notFoundCallBack = callback
      return this
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback
      return this
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback
      return this
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback
      return this
    }
  }
}

export function verifyPersonalNumber () {
  let _onOkCallBack
  function _onOk (result) {
    if (_onOkCallBack) {
      _onOkCallBack(result)
    }
  }
  let _onServerErrorCallBack
  function _onServerError (result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result)
    }
  }
  let _onBadRequestCallBack
  function _onBadRequest (result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result)
    }
  }
  let _unAuthorizedCallBack
  function _unAuthorized (result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result)
    }
  }
  let _notFoundCallBack
  function _notFound (result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result)
    }
  }
  let _onRequestErrorCallBack
  function _onRequestError (result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result)
    }
  }
  let _unKnownErrorCallBack
  function _unKnownError (result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result)
    }
  }

  const _call = async personalNumber => {
    try {
      const url =
        'https://crmdev-ponture-crmdev.cs84.force.com/oauth/services/apexrest/verify?pId=' +
        personalNumber
      var rawResponse = await fetch(url, {
        method: 'GET',
        crossOrigin: true,
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      })
      const status = rawResponse.status
      const result = await rawResponse.json()
      switch (status) {
        case 200:
          _onOk(result)
          break
        case 400:
          _onBadRequest()
          break
        case 401:
          _unAuthorized()
          break
        case 404:
          _notFound()
          break
        case 500:
          _onServerError(result)
          break
        default:
          _unKnownError()
          break
      }
    } catch (error) {
      _onRequestError(error.message)
    }
  }

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback
      return this
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback
      return this
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback
      return this
    },
    notFound: function (callback) {
      _notFoundCallBack = callback
      return this
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback
      return this
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback
      return this
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback
      return this
    }
  }
}

export function getNeedsList () {
  let _onOkCallBack
  function _onOk (result) {
    if (_onOkCallBack) {
      _onOkCallBack(result)
    }
  }
  let _onServerErrorCallBack
  function _onServerError (result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result)
    }
  }
  let _onBadRequestCallBack
  function _onBadRequest (result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result)
    }
  }
  let _unAuthorizedCallBack
  function _unAuthorized (result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result)
    }
  }
  let _notFoundCallBack
  function _notFound (result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result)
    }
  }
  let _onRequestErrorCallBack
  function _onRequestError (result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result)
    }
  }
  let _unKnownErrorCallBack
  function _unKnownError (result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result)
    }
  }

  const _call = async (lang = 'sv') => {
    try {
      const url = needsListUrl + '?lang=' + lang
      var rawResponse = await fetch(url, {
        method: 'GET'
      })

      const status = rawResponse.status
      const result = await rawResponse.json()
      // const status = 500
      // const result = ''

      switch (status) {
        case 200:
          _onOk(result)
          break
        case 400:
          _onBadRequest(result)
          break
        case 401:
          _unAuthorized(result)
          break
        case 404:
          _notFound(result)
          break
        case 500:
          _onServerError(result)
          break
        default:
          _unKnownError(result)
          break
      }
    } catch (error) {
      _onRequestError(error)
    }
  }

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback
      return this
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback
      return this
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback
      return this
    },
    notFound: function (callback) {
      _notFoundCallBack = callback
      return this
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback
      return this
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback
      return this
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback
      return this
    }
  }
}
export function getCompanies () {
  let _onOkCallBack
  function _onOk (result) {
    if (_onOkCallBack) {
      _onOkCallBack(result)
    }
  }
  let _onServerErrorCallBack
  function _onServerError (result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result)
    }
  }
  let _onBadRequestCallBack
  function _onBadRequest (result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result)
    }
  }
  let _unAuthorizedCallBack
  function _unAuthorized (result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result)
    }
  }
  let _notFoundCallBack
  function _notFound (result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result)
    }
  }
  let _onRequestErrorCallBack
  function _onRequestError (result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result)
    }
  }
  let _unKnownErrorCallBack
  function _unKnownError (result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result)
    }
  }

  const _call = async (token, sessionId, personalNumber) => {
    try {
      const url =
        'https://crmdev-ponture-crmdev.cs84.force.com/services/apexrest/roaringRest/getCmpOfPid?pId=' +
        personalNumber
      var rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          sessionid: sessionId
        }
      })

      const status = rawResponse.status
      const result = await rawResponse.json()
      switch (status) {
        case 200:
          _onOk(result)
          break
        case 400:
          _onBadRequest()
          break
        case 401:
          _unAuthorized()
          break
        case 404:
          _notFound()
          break
        case 500:
          _onServerError()
          break
        default:
          _unKnownError()
          break
      }
    } catch (error) {
      _onRequestError(error)
    }
  }

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback
      return this
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback
      return this
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback
      return this
    },
    notFound: function (callback) {
      _notFoundCallBack = callback
      return this
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback
      return this
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback
      return this
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback
      return this
    }
  }
}
export function submitLoan () {
  let _onOkCallBack
  function _onOk (result) {
    if (_onOkCallBack) {
      _onOkCallBack(result)
    }
  }
  let _onServerErrorCallBack
  function _onServerError (result) {
    if (_onServerErrorCallBack) {
      _onServerErrorCallBack(result)
    }
  }
  let _onBadRequestCallBack
  function _onBadRequest (result) {
    if (_onBadRequestCallBack) {
      _onBadRequestCallBack(result)
    }
  }
  let _unAuthorizedCallBack
  function _unAuthorized (result) {
    if (_unAuthorizedCallBack) {
      _unAuthorizedCallBack(result)
    }
  }
  let _notFoundCallBack
  function _notFound (result) {
    if (_notFoundCallBack) {
      _notFoundCallBack(result)
    }
  }
  let _onRequestErrorCallBack
  function _onRequestError (result) {
    if (_onRequestErrorCallBack) {
      _onRequestErrorCallBack(result)
    }
  }
  let _unKnownErrorCallBack
  function _unKnownError (result) {
    if (_unKnownErrorCallBack) {
      _unKnownErrorCallBack(result)
    }
  }

  const _call = async (token, sessionId, loan) => {
    try {
      const url =
        'https://crmdev-ponture-crmdev.cs84.force.com/services/apexrest/submit'

      var rawResponse = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          sessionid: sessionId
        },
        body: JSON.stringify(loan)
      })

      const status = rawResponse.status
      const result = await rawResponse.json()

      switch (status) {
        case 200:
        case 201:
          _onOk(result)
          break
        case 400:
          _onBadRequest()
          break
        case 401:
          _unAuthorized()
          break
        case 404:
          _notFound()
          break
        case 500:
          console.log('status 500', result)
          _onServerError(result)
          break
        default:
          _unKnownError()
          break
      }
    } catch (error) {
      console.log('request error', error)
      _onRequestError(error.message)
    }
  }

  return {
    call: _call,
    onOk: function (callback) {
      _onOkCallBack = callback
      return this
    },
    onServerError: function (callback) {
      _onServerErrorCallBack = callback
      return this
    },
    onBadRequest: function (callback) {
      _onBadRequestCallBack = callback
      return this
    },
    notFound: function (callback) {
      _notFoundCallBack = callback
      return this
    },
    unAuthorized: function (callback) {
      _unAuthorizedCallBack = callback
      return this
    },
    onRequestError: function (callback) {
      _onRequestErrorCallBack = callback
      return this
    },
    unKnownError: function (callback) {
      _unKnownErrorCallBack = callback
      return this
    }
  }
}
