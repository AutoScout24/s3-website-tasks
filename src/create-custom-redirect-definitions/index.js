const fs = require('fs');
const path = require('path');

const glob = require('glob');
const promisify = require('util.promisify');

const urlToPath = require('./url-to-path');

const parseCsv = require('./parse-csv');

const globAsync = promisify(glob);
const readFileAsync = promisify(fs.readFile);

const basenameWithoutExtension = filename => path.basename(filename).replace(/\.[^.]*$/, '');

class RedirectMapByDomain {
  constructor({domain, urlMap}) {
    Object.assign(this, {domain, urlMap});
  }
}

class RedirectDefinition {
  constructor({s3Key, redirectUrl}) {
    Object.assign(this, {s3Key, redirectUrl});
  }
}

module.exports = (redirectsFolder) => globAsync(redirectsFolder + '/*.csv')
.then(csvFilenames => Promise.all(csvFilenames.map(
  csvFilename => readFileAsync(csvFilename).then(
    content => new RedirectMapByDomain({
      domain: basenameWithoutExtension(csvFilename),
      urlMap: parseCsv(content.toString())
    })
  )
)))
.then(redirectsByHosts => Promise.all(
  redirectsByHosts.map(
    ({domain, urlMap}) => urlMap.map(([fromUrl, toUrl]) => new RedirectDefinition({
      s3Key: urlToPath(`https://${domain}/${fromUrl}`) + 'index.html',
      redirectUrl: `https://${domain}/${toUrl}`
    }))
  )
  .reduce((sum, element) => (sum.concat(element)), [])
));
