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
  (previousOperation, listItem, index) => (previousOperation.then(asyncOperation.bind(null, listItem, index))),
  Promise.resolve()
);

module.exports = ({
  srcPath, subdirectories, destPath, quality = 70, imageminPlugins, reportingCallback = () => {}
}) => rimrafAsync(destPath)
.then(() => subdirectories || globAsync(srcPath + '/**/*/'))
.then(subdirectories => subdirectories.concat([srcPath]))
.then(subdirectories => executeInSequence(imageminPlugins, (imageminPlugin, index) => {
  reportingCallback('executing imagemin plugin no. ' + (index + 1));
  return executeInSequence(
    subdirectories,
    subdirectory => {
      reportingCallback('processing ' + subdirectory);
      return executeImagemin(
        subdirectory, subdirectory.replace(srcPath, destPath), [imageminPlugin(quality)]
      );
    }
  );
}));
