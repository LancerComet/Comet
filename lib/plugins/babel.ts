// import { transform } from '@babel/core'
// import { CometPlugin } from '../types'
// import { readFileAsTextAsync } from '../utils/fs'
//
// const FILE_REGEXP = /\.(jsx?|tsx?)$/
//
// const transformAsync = (code: string) => {
//   return new Promise((resolve, reject) => {
//     transform(code, (error: Error, result: {
//       code: string
//       map: string
//       ast: unknown
//     }) => {
//       if (error) {
//         reject(error)
//       } else {
//         resolve(result)
//       }
//     })
//   })
// }
//
// const BabelPlugin = (): CometPlugin => {
//   return async context => {
//     const { filePath } = context
//     if (!FILE_REGEXP.test(filePath)) {
//       return null
//     }
//
//     // TODO: Get code
//   }
// }
