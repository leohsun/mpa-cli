import axios from 'axios'
import { apiHost } from './config'
export function getQueryStringObject() {
  const str = decodeURIComponent(location.search.replace(/^\?/, ''))
  if (!str) return null
  const obj = str.split('&').reduce((s, n) => {
    const rawN = n.split('=')
    return Object.assign({}, s, { [rawN[0]]: rawN[1] })
  }, {})
  return obj
}

export function transfrom2Camel(str) {
  return str.replace(/(_(.))/g, (match, $1, $2) => {
    return $2.toUpperCase()
  })
}


class Http {
  defaultCfg = {
    url: '',
    method: 'GET',
    header: {
      'content-type': 'application/json',
    }
  }

  get(url, params, cfg) {
    const config = {
      ...this.defaultCfg, url: `${apiHost}${url}`, params, ...cfg
    }

    return axios(config)
  }

  post(url, data, cfg) {
    const config = {
      ...this.defaultCfg, url: `${apiHost}${url}`, data, method: 'POST', ...cfg
    }

    return axios(config)
  }

}

export const http = new Http()