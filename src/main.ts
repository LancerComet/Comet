import dayjs from 'dayjs'

import './index.css'

import img from './assets/image.jpg'
import json from './index.json'
import { makeDoge } from './modules/doge'

console.log(dayjs())
console.log(json)
main()

function main () {
  makeDoge()
  makeImage()
}

function makeImage () {
  const image = new Image()
  image.src = img
  image.width = 700
  document.body.appendChild(image)
}
