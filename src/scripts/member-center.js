import '../stylus/member-center.styl'
import { getQueryStringObject, http, transfrom2Camel, loader } from '../utils'

import NP from 'number-precision'

async function getUserMemberInfo() {
  try {
    const searchData = getQueryStringObject()
    if (!searchData) return
    const data = {}
    for (let key in searchData) {
      if (searchData.hasOwnProperty(key)) {
        if (key === 'openid') data.openId = searchData.openid
        else data[transfrom2Camel(key)] = searchData[key]
      }
    }
    const resp = await http.post('member/api/intercept/wx/member/user/info/v1', data)
    return resp.data.data

  } catch (err) {
    console.log('checkUserStatus ERR: ', err)
    return Promise.reject(err)
  }
}

function setHtml(id, html) {
  const tar = document.getElementById(id)
  if (tar) tar.innerHTML = html || '默认'
}


async function initData() {
  loader.show()
  const data = await getUserMemberInfo()
  loader.hide()
  if (!data) return
  const { brandName, title, bonus, balance, logoUrl, backgroundPicUrl, cardVolumes } = data
  const data2set = { brandName, title, bonus, balance, levelName }
  document.querySelector('#js-card').style.backgroundImage = `url(${backgroundPicUrl})`
  for (let key in data2set) {
    if (data2set.hasOwnProperty(key)) {
      setHtml(key, data[key])
      document.querySelector('#logo').src = logoUrl
    }
  }
  if (cardVolumes) {
    generateCouponDom(cardVolumes)
  }
}


function generateCouponDom(data = []) {
  const pDom = document.querySelector('#js-coupon')

  let html = ''
  data.forEach(item => {
    html += `
    <div class="m-c__coupon-container">
    <div class="m-c__coupon-money"><text>${NP.divide(item.reduceCost, 100)}元</text><text>满${NP.divide(item.leastCost, 100)}元可用</text>
    </div>
    <div class="m-c__coupon-title">${item.title}</div>
  </div>
  `
  })
  pDom.innerHTML = html

}


initData()