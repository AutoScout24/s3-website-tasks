const glob = require('glob');
const promisify = require('util.promisify');
const rimraf = require('rimraf');

const imagemin = require('imagemin');

const globAsync = promisify(glob);
const rimrafAsync = promisify(rimraf);

const executeImagemin = (inputDirectory, outputDirectory, plugins) => imagemin(
  [`${inputDirectory}/*.jpg`], outputDirectory, {plugins}
);

const executeInSequence = (list, asyncOperation) => list.reduce(
  (previousOperation, listItem) => (previousOperation.then(asyncOperation.bind(null, listItem))),
  Promise.resolve()
);

const createFallbackWebpFiles = require('./create-fallback-webp-files');

module.exports = ({srcPath, destPath, quality = 70, imageminMozjpeg, imageminWebp}) => rimrafAsync(destPath)
.then(() => globAsync(srcPath + '/**/*/'))
.then(subdirectories => subdirectories.concat([srcPath]))
.then(subdirectories => executeInSequence(
  subdirectories,
  subdirectory => executeImagemin(subdirectory, subdirectory.replace(srcPath, destPath), [imageminMozjpeg(quality)])
).then(() => subdirectories))
.then(subdirectories => executeInSequence(
  subdirectories,
  subdirectory => executeImagemin(subdirectory, subdirectory.replace(srcPath, destPath), [imageminWebp(quality)])
))
.then(createFallbackWebpFiles.bind(null, destPath));
