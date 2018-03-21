const fs = require('graceful-fs');

const promisify = require('util.promisify');

const readFileAsync = promisify(fs.readFile);

const File = require('./value-objects/file');

module.exports = filenames => Promise.all(filenames.map(
  filename => readFileAsync(filename).then(
    fileContent => new File(filename, fileContent.toString())
  )
));
