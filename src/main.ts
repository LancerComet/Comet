/* eslint-disable */
import './index.css'

// @ts-ignore
import img from './assets/image.jpg'
// @ts-ignore
import json from './index.json'

import { makeDoge } from './modules/doge'

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
