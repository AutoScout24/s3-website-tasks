const fs = require('fs');

const glob = require('glob');
const promisify = require('util.promisify');

const globAsync = promisify(glob);

module.exports = (folder) => Promise.all([
  globAsync(folder + '/**/*.jpg'),
  globAsync(folder + '/**/*.webp')
])
.then(([jpegFiles, webpFiles]) => jpegFiles.filter(
  jpegFile => webpFiles.indexOf(jpegFile.replace('.jpg', '.webp')) == -1
))
.then(jpegFilesWithoutAccordingWebp => Promise.all(jpegFilesWithoutAccordingWebp.map(
  jpegFile => new Promise(
    (resolve, reject) => fs.copyFile(
      jpegFile, jpegFile.replace('.jpg', '.webp'), error => error ? reject(error) : resolve()
    )
  )
)));
