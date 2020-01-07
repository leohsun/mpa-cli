import { apiHost, browserAgentReg } from '../scripts/config'
import axios from 'axios'

const agent = navigator.userAgent.toLowerCase()
if (!browserAgentReg.wechat.test(agent) && !browserAgentReg.alipay.test(agent)) {
  href = './tip.html?msg=' + encodeURIComponent('请用支付宝或微信客户端扫码')
  window.location.replace(href)
}

const qStr = window.location.search.slice(1)

const params = qStr.split('&').reduce((s, n) => {
  const rawN = n.split('=')
  return Object.assign({}, s, { [rawN[0]]: rawN[1] })
}, {})


if (params.qrCodeNo) {
  axios.get(apiHost + 'merchanism/api/qrcode/query/v1', {
    params: {
      qrCodeNo: params.qrCodeNo
    }
  })
    .then(function (response) {
      const code = response.data.code
      const message = response.data.message
      let href = ''
      if (code !== 200) {
        href = './tip.html?msg=' + encodeURIComponent(message)
      } else {
        const totalFree = response.data.data.status == 2
          ? response.data.data.money
            ? response.data.data.money
            : '0'
          : '0'
        href = './input.html?qrNo=' + params.qrCodeNo + '&totalFree=' + totalFree + '&storeName=' + response.data.data.storeName
      }
      window.location.replace(href)
    })
    .catch(function (error) {
      alert(error)
    })
}

if (params.orderNo) {
  let orderNo = decodeURIComponent(params.orderNo)
  const questionMardIdx = orderNo.indexOf('?')
  if (questionMardIdx > -1) {
    orderNo = orderNo.slice(0, questionMardIdx)
  }
  axios.get(apiHost + 'service/api/aggregate/open/queryOrder/' + orderNo + '/v1', {
    params: {
      orderNo
    }
  })
    .then(function (response) {
      const code = response.data.code
      const message = response.data.message
      let href = ''
      if (code !== 200) {
        href = './tip.html?msg=' + encodeURIComponent(message)
      } else {
        const data = response.data.data
        if (data.oderStatus = 2) {
          href = './success.html?orderNo=' + data.oderNo + '&totalFree=' + data.totalFree + '&payTime=' + data.payTime + '&payChannel=' + payChannelMap[data.payType]

        } else {
          href = './tip.html?msg=' + encodeURIComponent(orderStatusMap[data.oderStatus])
        }

      }
      window.location.replace(href)
    })
    .catch(function (error) {
      alert(error)
    })

}