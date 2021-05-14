import axios from 'axios'
// import swal from 'sweetalert2'
import AlerService from './AlertService'
import { AuthenticateService } from './AuthenticateService';
var config = require("../../../../config");
var initheaders = {
  Authorization: 'Bearer ' + AuthenticateService.getAuthenticate()
}

axios.defaults.baseURL = `http://localhost:4001/api/v1`;

export const HTTPService = {
  sendRequest: (method, url, body, headers = initheaders) => {
    if (!method.match(/get|head/)) {
      body = body || {}
    } else {
      body = null
    }
    headers = headers || {}
    const request = {
      url: url,
      method: method,
      data: body,
      headers: headers
    }

    if (method === 'delete') {
      delete request.data
      request.params = body
    }
    return new Promise((resolve, reject) => {
      axios.request(request).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          resolve({ isError: false, ...res.data })
        } else {
          AlerService.swal.close()
          resolve({ isError: true, ...res.data })
        }
      }).catch((err) => {
        AlerService.swal.close()
        resolve({
          isError: true,
          message: err.response
        })
      })
    })
  }
}
