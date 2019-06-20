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
      // const url = 'https://test.salesforce.com/services/oauth2/token'
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
      //   body: formData
      // })
      // const status = rawResponse.status
      // const result = await rawResponse.json()
      const status = 200
      const result = {
        access_token:
          '00D5E000000DGic!ARkAQLP7hHlBTEgoG71gAXsOJ3qlcKDNbqn0w90n1hVO47fGC4HoVjUktxWNj.sOBNWyb6NF8.E4Rif1vIFo62LJo4DtWz73',
        instance_url: 'https://dev-sb-ponture--crmdev.my.salesforce.com',
        id:
          'https://test.salesforce.com/id/00D5E000000DGicUAG/0051t000002PsClAAK',
        token_type: 'Bearer',
        issued_at: '1560925987932',
        signature: 'V6P1oY/Hkr+Ueq9xy6Jvays1L78YNxxWwcF40JWayd0='
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
        'https://crmdev-ponture-crmdev.cs84.force.com/services/apexrest/verifyBankID?pId=' +
        personalNumber

      var rawResponse = await fetch(url, {
        method: 'GET',
        crossOrigin: true,
        headers: {
          // 'Content-Type': 'application/json',
          Authorization:
            'Bearer 00D5E000000DGic!ARkAQIiTQJzJ4RxDadcnwQ.DFmkACziYYkmgy0KUjHTkjTpjrveA21n.0g_tB3W4YCS.sg.LV8BYN89NJd7rEh0_X_lK2Wo.',
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
          _onServerError()
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

  const _call = async (token, personalNumber) => {
    try {
      const url =
        'https://crmdev-ponture-crmdev.cs84.force.com/services/apexrest/roaringRest/getCmpOfPid?pId=' +
        personalNumber
      var rawResponse = await fetch(url, {
        method: 'GET',
        headers: {
          authorization: 'Bearer ' + token,
          'Content-Type': 'application/json'
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
