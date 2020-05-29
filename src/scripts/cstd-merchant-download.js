import { message, getPlatform } from '../utils'
import '../stylus/cstd-merchant-download.styl'


const downloadBtn = document.querySelector('#js-download');

downloadBtn.onclick = function () {
    if (getPlatform().isIOS) {
        return message('ios 暂时未开发下载，敬请期待')
    }
    if (getPlatform().isAndroid) {
        window.open('https://express-zdxt.oss-cn-chengdu.aliyuncs.com/apk/cstd.merchant_stable.1.0.1.apk')
    }
    return message('请用手机浏览器打开')
}