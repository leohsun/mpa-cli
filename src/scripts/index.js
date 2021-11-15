import {
  getQueryStringObject,
  fixH5ViewHeightChangeWhenInputFocusOnAdroid,
  message,
} from "@leohsun/tools"

import { http } from "../utils"

import "../components/entry.js"

import "../stylus/index.styl"

fixH5ViewHeightChangeWhenInputFocusOnAdroid()

const submitEl = document.querySelector("#js-submit")

const usernameInput = document.querySelector("#username")
const idInput = document.querySelector("#id")

function validateForm() {
  const username = usernameInput.value
  const id = idInput.value
  if (!username) {
    message("請輸入姓名")
    return false
  }
  if (!id) {
    message("身份證號碼")
    return false
  }
  return true
}

submitEl.onclick = function () {
  const valid = validateForm()
  if (!valid) return
  const name = usernameInput.value
  const idCard = idInput.value
  postData({ name, idCard })
}

async function postData(param) {
  try {
    const {
      accessToken,
      idCard,
      patientName,
      code,
      message: msg,
    } = await http.post("api/auth/login", param)

    if (code == 999) return message(msg)

    sessionStorage.setItem("token", accessToken)
    sessionStorage.setItem("idCard", idCard)
    sessionStorage.setItem("patientName", patientName)

    const { from } = getQueryStringObject()
    const toPath = from || "/booking.html"
    window.location.replace(toPath)
  } catch (err) {
    console.warn("__ERR__", err)
  }
}
