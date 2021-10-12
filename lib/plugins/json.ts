import { CometPlugin } from '../types'
import { readFileAsTextAsync } from '../utils/fs'

const FILE_REGEXP = /\.json$/

const JsonPlugin = (): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    const jsonString = await readFileAsTextAsync(filePath)
    return {
      content: `export default ${jsonString}`
    }
  }
}

export {
  JsonPlugin
}
