import * as swc from '@swc/core'
import { CometPlugin } from '../types'
import { readFileAsTextAsync } from '../utils/fs'

const FILE_REGEXP = /\.tsx?$/

const TypescriptPlugin = (swcConfig?: swc.Options): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const fileContent = await readFileAsTextAsync(filePath)
    const output = await swc.transform(fileContent, swcConfig)
    return {
      content: output.code
    }
  }
}

export {
  TypescriptPlugin
}
