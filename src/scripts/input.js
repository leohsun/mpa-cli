import axios from 'axios'
import message from '../scripts/layer'
import '../stylus/input.styl'

const submitButn = document.querySelector('.input__submit')
const channelInput = document.querySelector('form')
const agent = navigator.userAgent.toLowerCase()
const input = document.querySelector('.input__input')
const loading = document.querySelector('.loading')
const storeEl = document.querySelector('.input__store-name')

const qStr = window.location.search.slice(1)
const params = qStr.split('&').reduce((s, n) => {
  const rawN = n.split('=')
  return Object.assign({}, s, { [rawN[0]]: rawN[1] })
}, {})

if (Number(params.totalFree) > 0) {
  input.value = params.totalFree
  input.disabled = true
} else {
  input.focus()
}

if (params.storeName) {
  storeEl.innerHTML = decodeURIComponent(params.storeName)
}

let channel = ''
if (browserAgentReg.wechat.test(agent)) {
  channel = 'wx'
  const node = document.querySelector('.ali_inp')
  node.disabled = true
  node.parentNode.classList.add('input__channel-label--disable')
  channelInput.elements.channel.value = 'wx'
} else if (browserAgentReg.alipay.test(agent)) {
  channel = 'ali'
  const node = document.querySelector('.wx_inp')
  node.disabled = true
  node.parentNode.classList.add('input__channel-label--disable')
  channelInput.elements.channel.value = 'ali'
}

if (!channel) {
  href = './tip.html?msg=' + encodeURIComponent('非法操作')
  window.location.replace(href)
}


submitButn.onclick = function () {
  let totalFree = input.value.indexOf('.') === 0 ? '0' + input.value : input.value
  totalFree = Number(totalFree)
  channel = channelInput.elements.channel.value
  if (!totalFree) {
    // return alert('请输入金额')
    return message('请输入合法的金额')
  }
  loading.style.display = 'block'
  axios.post(apiHost + 'service/api/aggregate/open/create/order/v1', {
    terminalType: 5,
    totalFree: totalFree,
    terminalNo: params.qrNo
  })
    .then(function (response) {
      const code = response.data.code
      const message = response.data.message
      if (code !== 200) {
        href = './tip.html?msg=' + encodeURIComponent(message)
        window.location.replace(href)

      } else {
        const orderNo = response.data.data.orderNo
        payAction(orderNo, channel)
      }
    })
    .catch(function (error) {
      console.log(error);
    })
    .finally(function () {
      loading.style.display = 'none'
    });
}

function payAction(orderNo, payChannel) {
  axios.post(apiHost + 'service/api/aggregate/open/micropay/v1', {
    orderNo,
    payChannel
  })
    .then(function (response) {
      const code = response.data.code
      const message = response.data.message
      if (code !== 200) {
        href = './tip.html?msg=' + encodeURIComponent(message)
        window.location.replace(href)

      } else {
        const codeUrl = response.data.data.codeUrl
        window.location.href = codeUrl
        // localStorage.setItem('order_no', orderNo)
      }
    })
    .catch(function (error) {
      alert(error)
    })
    .finally(function () {
      loading.style.display = 'none'
    })
}

const _orderNo = localStorage.getItem('order_no')
if (_orderNo) {
  loading.style.display = 'block'
  queryResult(_orderNo)
  localStorage.removeItem('order_no')
}

function queryResult(orderNo) {
  axios.post(apiHost + 'service/api/aggregate/open/queryOrder/' + orderNo + '/v1', {
    params: {
      orderNo: orderNo
    }
  })
    .then(function (response) {
      const code = response.data.code
      const message = response.data.message
      let href = ''
      if (code !== 200) {
        href = './tip.html?msg=' + encodeURIComponent(message)
      } else {
        const fakeResp = {
          "code": 200,
          "message": "执行成功",
          "data": {
            "id": "1343",
            "createTime": "2019-10-14 14:40:38",
            "updateTime": "2019-10-14 14:40:38",
            "operatorsNo": "YYS000ppD00012",
            "operatorsName": "xgyys",
            "channelNo": "QDS000hLo00011",
            "channelName": "xgqds",
            "merchantNo": "SH000xHW0008",
            "merchantName": "xgsh",
            "storeNo": "c25f5b18fb844c31bb876a5f25c77606",
            "storeName": "xgsh",
            "cashierNo": "279c0dc11137407d9c45fe1d02819e53",
            "oderNo": "15710352382513587334185",
            "transactionId": "2019101415025121127451",
            "oderStatus": 2,
            "terminalType": 5,
            "deviceInfo": "NO.9999999999",
            "payType": 1,
            "sonPayType": "ZW",
            "payChannel": 3,
            "payTime": "2019-10-14 15:04:25",
            "totalFree": 0.01,
            "merchantsPaidIn": 0.01,
            "clientActuallyPaid": 0.01,
            "orderDescribe": "账单实付实收测试",
            "transactionDescribe": "订单支付成功",
            "refundTotalFree": 0,
            "settleStatus": 1,
            "buyerLogonId": null,
            "subjectCode": "LARGE",
            "merchantCreateUserNo": null,
            "partnerNo": null
          }
        }
        const data = response.data.data
        if (data.oderStatus = 2) {
          href = './success.html?orderNo=' + data.oderNo + '&totalFree=' + data.totalFree + '&payTime' + data.payTime + '&payChannel=' + payChannelMap[data.payChannel]

        } else {
          href = './tip.html?msg=' + encodeURIComponent(orderStatusMap[data.oderStatus])
        }

      }
      window.location.replace(href)
    })
    .catch(function (error) {
      console.warn(err)
    })
    .finally(function () {
      loading.style.display = 'none'
    })
}

const el = document.querySelector('.input__card-title')

input.oninput = function (e) {
  const shouldBeSlice = this.value == '00' || /^\.\d*\./.test(this.value + e.data) || /\.\d{3}$/.test(this.value)
  if (shouldBeSlice) {
    this.value = this.value.slice(0, this.value.length - 1)
  }
}