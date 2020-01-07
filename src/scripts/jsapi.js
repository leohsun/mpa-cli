function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function onBridgeReady() {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest', {
    "appId": "wxea7000f0d4dfa822",     //公众号名称，由商户传入     
    "timeStamp": new Date().now() / 1000,         //时间戳，自1970年以来的秒数     
    "nonceStr": makeid(32), //随机串     
    "package": "prepay_id=u802345jgfjsdfgsdg888",
    "signType": "MD5",         //微信签名方式：     
    "paySign": "70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
  },
    function (res) {
      if (res.err_msg == "get_brand_wcpay_request:ok") {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
      }
    });
}
if (typeof WeixinJSBridge == "undefined") {
  if (document.addEventListener) {
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
  } else if (document.attachEvent) {
    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
  }
} else {
  onBridgeReady();
}
