import { getQueryStringObject, http, transfrom2Camel, loader } from '../utils'
import '../stylus/farmer-helper.styl'

const videoMaskEl = document.querySelector('#js-video')
const videoCloseBtn = document.querySelector('#js-close-btn')
const bodyEl = document.querySelector('#js-body')
const playerEl = document.querySelector('#js-palyer')

bodyEl.onclick = function (e) {
  const tar = e.target
  const isPlayBtn = tar.className == 'farmer-helper__play-btn' || tar.classList.contains('farmer-helper__video-title-container')
  const isTutorCard = tar.className == 'farmer-helper__tutor-card'
  if (isPlayBtn) playVideo(tar)
  // if (isTutorCard) viewTutor(tar)
}

function playVideo(tar) {
  const videoSrc = tar.getAttribute("data-src")
  if (!videoSrc) return
  playerEl.src = videoSrc
  videoMaskEl.classList.add('farmer-helper__video-palyer--show')
  playerEl.play()
}

// function viewTutor(tar) {
//   const id = tar.getAttribute("data-id")
//   if (!id) return
//   window.location.href = './tutor.html?id=' + id
// }

videoCloseBtn.onclick = function (e) {
  playerEl.pause()
  videoMaskEl.classList.remove('farmer-helper__video-palyer--show')
}