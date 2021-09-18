import chokidar from 'chokidar'

function watchFile (filePath: string, callback: () => void) {
  chokidar.watch(filePath)
    .on('change', () => {
      console.log('File updated:', filePath)
      callback()
    })
}

export {
  watchFile
}
