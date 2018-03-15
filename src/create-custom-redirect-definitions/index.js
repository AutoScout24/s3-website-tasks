const fs = require('fs');
const path = require('path');

const glob = require('glob');
const promisify = require('util.promisify');

const urlToFilename = require('../url-to-filename');

const parseCsv = require('./parse-csv');

const globAsync = promisify(glob);
const readFileAsync = promisify(fs.readFile);

const basenameWithoutExtension = filename => path.basename(filename).replace(/\.[^.]*$/, '');

class RedirectMapByDomain {
  constructor({fqdn, urlMap}) {
    Object.assign(this, {fqdn, urlMap});
  }
}

class RedirectDefinition {
  constructor({s3Key, redirectUrl}) {
    Object.assign(this, {s3Key, redirectUrl});
  }
}

module.exports = (
  {redirectsDirectory, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixes = []}
) => globAsync(redirectsDirectory + '/*.csv')
.then(csvFilenames => Promise.all(csvFilenames.map(
  csvFilename => readFileAsync(csvFilename).then(
    content => new RedirectMapByDomain({
      fqdn: `${thirdLevelDomain}.${secondLevelDomain}.${basenameWithoutExtension(csvFilename)}`,
      urlMap: parseCsv(content.toString())
    })
  )
)))
.then(redirectsByHosts => Promise.all(
  redirectsByHosts.map(
    ({fqdn, urlMap}) => urlMap.map(([fromUrl, toUrl]) => new RedirectDefinition({
      s3Key: urlToFilename({url: `https://${fqdn}/${fromUrl}`, urlPathPrefixes}),
      redirectUrl: `https://${fqdn}/${toUrl}`
    }))
  )
  .reduce((sum, element) => (sum.concat(element)), [])
));
