const fs = require('graceful-fs');

const glob = require('glob');
const promisify = require('util.promisify');

const UrlsByFile = require('./value-objects/urls-by-file');
const DeadLinksByFile = require('./value-objects/dead-links-by-file');

const urlToFilename = require('../url-to-filename');

const findInternalUrls = require('./find-internal-urls');
const chunkArray = require('./chunk-array');
const readFiles = require('./read-files');

const globAsync = promisify(glob);
const statAsync = promisify(fs.stat);

const FILES_CHUNK_SIZE = 1000;

module.exports = (
  {rootDirectory, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixes, filesChunkSize = FILES_CHUNK_SIZE}
) => globAsync(`${rootDirectory}/content/**/*.html`)
.then(async (filenames) => {
  const filenameChunks = chunkArray(filenames, filesChunkSize);
  const deadLinksByFilesChunks = [];
  for (let i = 0; i < filenameChunks.length; i++) {
    deadLinksByFilesChunks.push(await checkFilesForDeadLinks({
      filenames: filenameChunks[i],
      rootDirectory,
      thirdLevelDomain,
      secondLevelDomain,
      urlPathPrefixes
    }));
  }
  const deadLinksByFiles = deadLinksByFilesChunks.reduce((sum, element) => sum.concat(element), []);
  return deadLinksByFiles;
});

const checkFilesForDeadLinks = (
  {filenames, rootDirectory, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixes}
) => readFiles(filenames)
.then(files => getUrlsByFiles({files, thirdLevelDomain, secondLevelDomain, urlPathPrefixes}))
.then(urlsByFiles => getDeadLinksByFiles({urlsByFiles, rootDirectory, urlPathPrefixes}))
.then(deadLinksByFiles => deadLinksByFiles.filter(deadLinksByFile => deadLinksByFile.deadLinks.length > 0));

const getUrlsByFiles = ({files, thirdLevelDomain, secondLevelDomain, urlPathPrefixes}) => Promise.all(
  files.map(file => {
    const urls = findInternalUrls({text: file.fileContent, thirdLevelDomain, secondLevelDomain, urlPathPrefixes});
    let tld = file.filename.split('/')[2];
    if (tld == 'ua') { tld='com.ua'; }
    if (tld == 'tr') { tld='com.tr'; }
    const fqdn = `${thirdLevelDomain}.${secondLevelDomain}.${tld}`;
    const absoluteUrls = urls.map(url => url.includes(fqdn) ? url : `https://${fqdn}${url}`);
    return new UrlsByFile(file.filename, absoluteUrls);
  })
);

const getDeadLinksByFiles = ({urlsByFiles, rootDirectory, urlPathPrefixes}) => Promise.all(
  urlsByFiles.map(urlsByFile => {
    let deadLinks = [];
    return Promise.all(
      urlsByFile.urls.map(
        url => statAsync(
          `${rootDirectory}/${urlToFilename({url, urlPathPrefixes})}`
        ).catch(() => deadLinks.push(url))
      )
    )
    .then(() => new DeadLinksByFile(urlsByFile.filename, deadLinks));
  })
);
