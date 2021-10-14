import path from 'path'
import { CometPlugin } from '../types'
import { isFileExistAsync, readFileAsTextAsync } from '../utils/fs'

const FILE_REGEXP = /\.(jsx?|tsx?)$/

const NodeModulesPlugin = (): CometPlugin => {
  return async context => {
    const { filePath } = context
    if (!FILE_REGEXP.test(filePath)) {
      return null
    }

    let fileContent = await readFileAsTextAsync(filePath)
    fileContent = transformImportPath(fileContent)

    return {
      content: fileContent
    }
  }
}

export {
  NodeModulesPlugin,
  transformImportPath
}

const ABSOLUTE_IMPORT_REG_EXP = /import [\w {,}]+ from ['"](\w|\d|@)[\w\d@/_\-.]+['"]/g
const ABSOLUTE_IMPORT_MATCHING_REG_EXP = /(?<=import [\w {,}]+ from )(['"](\w|\d|@)[\w\d@/_\-.]+['"])/g

function transformImportPath (code: string): string {
  const importMatches = code.match(ABSOLUTE_IMPORT_REG_EXP) ?? []
  for (const matchItem of importMatches) {
    const pathMatch = matchItem.match(ABSOLUTE_IMPORT_MATCHING_REG_EXP)?.[0]
    if (!pathMatch) {
      continue
    }

    const fullPath = '/node_modules/' + pathMatch.replace(/(^['"])|(['"]$)/g, '')
    const newImportExpression = matchItem.replace(pathMatch, `'${fullPath}'`)
    code = code.replace(matchItem, newImportExpression)
  }

  return code
}

// async function handleImport (code: string) {
//   const packageJsonPath = path.resolve('.' + fullPath, 'package.json')
//   if (!await isFileExistAsync(packageJsonPath)) {
//     continue
//   }
//
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-var-requires
//     const json = require(packageJsonPath)
//     if (json.module) {
//       const moduleFile = path.resolve('.' + fullPath, json.module)
//       console.log(moduleFile)
//     } else if (json.main) {
//       const jsonFilePath = path.join('.' + fullPath, json.main)
//       console.log(jsonFilePath)
//     }
//   } catch (error) {
//     continue
//   }
// }
