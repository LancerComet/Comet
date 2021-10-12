import { CometPlugin } from '../types'
import { readFileAsTextAsync } from '../utils/fs'

const FILE_REGEXP = /\.css?$/

const CssPlugin = (): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const css = await readFileAsTextAsync(filePath)
    const fileContent = `
      const css = ${JSON.stringify(css)}
      const style = document.createElement('style')
      style.innerHTML = css
      document.head.appendChild(style)
    `

    return {
      content: fileContent
    }
  }
}

export {
  CssPlugin
}
