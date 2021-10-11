import { CometPlugin } from '../types'

const FILE_REGEXP = /\.css?$/

const CssPlugin = (): CometPlugin => {
  return async context => {
    const { fileContent: css, filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const fileContent = `
      const css = ${JSON.stringify(css)}
      const style = document.createElement('style')
      style.innerHTML = css
      document.head.appendChild(style)
    `.trim()

    return {
      contentType: 'application/javascript',
      content: fileContent
    }
  }
}

export {
  CssPlugin
}
