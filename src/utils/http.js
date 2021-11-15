import axios from "axios"
import { apiHost } from "../config"
import { loader } from "@leohsun/tools"
const instance = axios.create({
  timeout: 10000,
  headers: { Authorization: sessionStorage.getItem("token") || -1 },
})

instance.interceptors.request.use(
  function (config) {
    loader.show()
    return config
  },
  function (error) {
    loader.hide()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    loader.hide()
    const { status, data } = response
    if (status == 200) {
      if (data.code == 0) {
        return data.result
      }
      return data
    }
    return response
  },
  function (error) {
    loader.hide()
    return Promise.reject(error)
  }
)

class Http {
  default_conf = {
    method: "GET",
  }

  get(url, data, config = {}) {
    const _url = url.indexOf("http") > -1 ? url : apiHost + url
    return instance({
      url: _url,
      method: "GET",
      params: data,
      ...config,
    })
  }

  post(url, data, config = {}) {
    const _url = url.indexOf("http") > -1 ? url : apiHost + url
    return instance({
      url: _url,
      method: "POST",
      data,
      ...config,
    })
  }

  put(url, data, config = {}) {
    const _url = url.indexOf("http") > -1 ? url : apiHost + url
    return instance({
      url: _url,
      method: "PUT",
      data,
      ...config,
    })
  }
}

export const http = new Http()
