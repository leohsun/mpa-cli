// export const apiHost = 'https://api.jiaozi/pay.com.cn/'
// let apiHost = 'https://dev.topdiantop.top/test/'
let apiHost = "http://47.92.75.215:8100/"

if (process.env.NODE_ENV === "production") apiHost = "http://34.80.28.51/"

export { apiHost }
export const browserAgentReg = {
  wechat: /micromessenger/i,
  alipay: /alipayclient/i,
}

export const orderStatusMap = {
  11: "支付中",
  1: "未支付",
  2: "支付成功",
  3: "支付失败",
  4: "退款成功",
  5: "冻结中",
  6: "退款中",
  7: "退款失败",
  8: "订单关闭",
  9: "订单撤销",
  10: "订单撤销失败",
  12: "已取消",
}

export const payChannelMap = {
  2: "微信",
  3: "支付宝",
  4: "众维码",
}

export const getAuthUrl =
  "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxea7000f0d4dfa822&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect "
