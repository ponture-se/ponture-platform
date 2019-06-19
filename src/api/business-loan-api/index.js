const config = process.env

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

  const _call = async (token, personalNumber) => {
    try {
      const url = 'https://test.salesforce.com/services/oauth2/token'
      let formData = new FormData()
      formData.append('grant_type', 'password')
      formData.append(
        'client_id',
        '3MVG96mGXeuuwTZgBI_DSQZsUSfr_l2y2KTzMuV7RBWYGqMf3gVjVjU_jKumhbFQx7qLZ2TVa7rDr0ATVXRZJ'
      )
      formData.append(
        'client_secret',
        '87C7F37D3430525C138A6E424BCE6D61187273CB69F00067E7DF2299326D812C'
      )
      formData.append('username', 'hamed-3eph@force.com.crmdev')
      formData.append('password', 'ponZXC123!')

      var rawResponse = await fetch(url, {
        method: 'POST',
        body: formData
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

  const _call = async token => {
    try {
      const url =
        'https://crmdev-ponture-crmdev.cs84.force.com/services/apexrest/roaringRest/getCmpOfPid'
      var rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: {
          grant_type: 'password',
          client_id:
            '3MVG96mGXeuuwTZgBI_DSQZsUSYBgs1HuOl2aTNL.uPtL776wOC0x4nB9Ny9krpojn_vlcxMM3uwJe7izMZZ7',
          client_secret:
            '99CBA02A0A1E6E1D746454EDC741367BD682BF847FCA10E19670E6A75FEACB5D',
          username: 'hamed-3eph@force.com.crmdev',
          password: 'ponZXC123!'
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
