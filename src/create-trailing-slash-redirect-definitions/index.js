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
  rootDirectory, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixMap = []
}) => globAsync(`${rootDirectory}/content/*/**/*/`)
.then(directories => directories.map(directory => directory.replace(`${rootDirectory}/`, '')))
.then(directories => directories.map(directory => new RedirectDefinition({
  s3Key: directory.replace(/\/$/, ''),
  redirectUrl: pathToUrl({thirdLevelDomain, secondLevelDomain, urlPathPrefixMap, path: directory})
})));
