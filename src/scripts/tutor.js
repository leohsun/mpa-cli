import { getQueryStringObject } from '../utils'
import '../stylus/tutor.styl'
import datas from '../utils/tutor-data'

const { id } = getQueryStringObject()

const data = datas[id]
let domString = ''


data.forEach(element => {
  if (element.hasOwnProperty('htmlTitle')) {
    document.title = '旅游攻略'
    domString += `<h1>${element.htmlTitle}</h1>`
  }

  if (element.hasOwnProperty('img')) {
    domString += `<img src="${element.img}">`
  }

  if (element.hasOwnProperty('text')) {
    domString += `<p>${element.text}</p>`
  }

  if (element.hasOwnProperty('contentTitle')) {
    domString += `<h2>${element.contentTitle}</h2>`
  }

  if (element.hasOwnProperty('leaderTitle')) {
    domString += `<strong>${element.leaderTitle}</strong>`
  }
});

document.body.innerHTML = domString