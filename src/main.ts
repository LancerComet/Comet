import './index.css'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import img from './assets/image.jpg'
import { makeDoge } from './modules/doge'

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
