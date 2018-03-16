const glob = require('glob');
const promisify = require('util.promisify');

const imagemin = require('imagemin');

const globAsync = promisify(glob);

const executeImagemin = (inputDirectory, outputDirectory, plugins) => imagemin(
  [`${inputDirectory}/*.jpg`], outputDirectory, {plugins}
);

const executeInSequence = (list, asyncOperation) => list.reduce(
  (previousOperation, listItem, index) => (previousOperation.then(asyncOperation.bind(null, listItem, index))),
  Promise.resolve()
);

const getAllSubdirectories = srcPath => globAsync(srcPath + '/**/*/')
.then(subdirectories => subdirectories.concat([srcPath]));

module.exports = ({
  srcPath, subdirectories, destPath, quality = 70, imageminPlugins, reportingCallback = () => {}
}) => Promise.resolve(subdirectories || getAllSubdirectories(srcPath))
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
