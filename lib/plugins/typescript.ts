import * as swc from '@swc/core'
import { CometPlugin } from '../types'

const FILE_REGEXP = /\.tsx?$/

const TypescriptPlugin = (swcConfig?: swc.Options): CometPlugin => {
  return async context => {
    const { fileContent, filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const output = await swc.transform(fileContent, swcConfig)
    return {
      contentType: 'text/javascript',
      content: output.code
    }
  }
}

export {
  TypescriptPlugin
}
