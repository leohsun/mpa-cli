import axios from 'axios'
import { apiHost } from '../config'

class Http {
  default_conf = {
    method: 'GET',
  }

  get(url, data, config) {
    return axios({
      url: apiHost + url,
      method: 'GET',
      params: data
    })
  }

  post(url, data) {
    return axios({
      url: apiHost + url,
      method: 'POST',
      data
    })
  }
}

export const http = new Http()