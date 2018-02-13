const glob = require('glob');
const promisify = require('util.promisify');
const aws = require('aws-sdk');

const pathToUrl = require('./path-to-url');

const s3 = new aws.S3();

const globAsync = promisify(glob);
const putObjectAsync = promisify(s3.putObject.bind(s3));

module.exports = ({s3BucketName, rootFolder}) => globAsync(`${rootFolder}/!(assets)/*/**/*/`)
.then(directories => directories.map(directory => directory.replace('public/', '')))
.then(directories => Promise.all(
  directories.map(directory => putObjectAsync({
    Body: '',
    Bucket: s3BucketName,
    Key: directory.replace(/\/$/, ''),
    WebsiteRedirectLocation: pathToUrl(directory)
  }))
));
