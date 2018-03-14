const glob = require('glob');
const promisify = require('util.promisify');

const pathToUrl = require('./path-to-url');

const globAsync = promisify(glob);

class RedirectDefinition {
  constructor({s3Key, redirectUrl}) {
    Object.assign(this, {s3Key, redirectUrl});
  }
}

module.exports = ({
  rootFolder, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixMap = []
}) => globAsync(`${rootFolder}/content/*/**/*/`)
.then(directories => directories.map(directory => directory.replace(`${rootFolder}/`, '')))
.then(directories => directories.map(directory => new RedirectDefinition({
  s3Key: directory.replace(/\/$/, ''),
  redirectUrl: pathToUrl({thirdLevelDomain, secondLevelDomain, urlPathPrefixMap, path: directory})
})));
