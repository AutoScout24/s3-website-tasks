const glob = require('glob');
const promisify = require('util.promisify');
const rimraf = require('rimraf');

const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminWebp = require('imagemin-webp');

const globAsync = promisify(glob);
const rimrafAsync = promisify(rimraf);

const executeImagemin = (inputDirectory, outputDirectory, plugins) => imagemin(
  [`${inputDirectory}/*.jpg`], outputDirectory, {plugins}
);

const createFallbackWebpFiles = require('./create-fallback-webp-files');

module.exports = ({srcPath, destPath, quality = 70}) => rimrafAsync(destPath)
.then(() => globAsync(srcPath + '/**/*/'))
.then(subdirectories => subdirectories.concat([srcPath]))
.then(subdirectories => {
  return Promise.all(subdirectories.map(
    subdirectory => executeImagemin(subdirectory, subdirectory.replace(srcPath, destPath), [imageminWebp(quality)])
  ))
  .then(() => Promise.all(subdirectories.map(
    subdirectory => executeImagemin(subdirectory, subdirectory.replace(srcPath, destPath), [imageminMozjpeg(quality)])
  )));
})
.then(createFallbackWebpFiles.bind(null, destPath));
