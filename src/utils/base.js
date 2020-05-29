export function getQueryStringObject() {
  const qStr = decodeURIComponent(window.location.search.slice(1))
  const params = qStr.split('&').reduce((s, n) => {
    const rawN = n.split('=')
    return Object.assign({}, s, { [rawN[0]]: rawN[1] })
  }, {})
  return params
}

export function transfrom2Camel(str) {
  return str.replace(/_(.)/g, (m, $1) => $1.toUpperCase())
}

export function getPlatform() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const payload = {
    isIOS: false,
    isAndroid: false
  }

  if (/android/i.test(userAgent)) {
    return {
      isIOS: false,
      isAndroid: true
    }
  }

  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return {
      isIOS: true,
      isAndroid: false
    }
  }

  return {
    isIOS: false,
    isAndroid: false
  }
}