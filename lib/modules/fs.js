const { promises, exists } = require('fs')

const readFileAsync = filePath => promises.readFile(filePath, {
  encoding: 'utf-8'
})

const existAsync = filePath => new Promise(resolve => {
  exists(filePath, resolve)
})

module.exports = {
  readFileAsync,
  existAsync
}
