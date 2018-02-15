const fs = require('fs');
const path = require('path');

const glob = require('glob');
const promisify = require('util.promisify');
const aws = require('aws-sdk');

const urlToPath = require('./url-to-path');

const RedirectsByDomain = require('./redirects-by-domain');
const parseCsv = require('./parse-csv');

const s3 = new aws.S3();

const globAsync = promisify(glob);
const putObjectAsync = promisify(s3.putObject.bind(s3));
const readFileAsync = promisify(fs.readFile);

const basenameWithoutExtension = filename => path.basename(filename).replace(/\.[^.]*$/, '');

module.exports = ({s3BucketName, redirectsFolder}) => globAsync(redirectsFolder + '/*.csv')
.then(csvFilenames => Promise.all(csvFilenames.map(
  csvFilename => readFileAsync(csvFilename).then(
    content => new RedirectsByDomain(
      basenameWithoutExtension(csvFilename),
      parseCsv(content.toString())
    )
  )
)))
.then(redirectsByHosts => Promise.all(
  redirectsByHosts.map(
    ({domain, redirects}) => Promise.all(
      redirects.map(([urlPath, redirectPath]) => putObjectAsync({
        Body: '',
        Bucket: s3BucketName,
        Key: urlToPath(`https://${domain}/${urlPath}`) + 'index.html',
        WebsiteRedirectLocation: `https://${domain}/${redirectPath}`
      }))
    )
  )
));
