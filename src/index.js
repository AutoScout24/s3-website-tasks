module.exports = {
  checkForInternalDeadLinks: require('./check-for-internal-dead-links'),
  createDeadLinksReport: require('./check-for-internal-dead-links/create-report'),
  createOrUpdateStack: require('./create-or-update-stack'),
  minifyImages: require('./minify-images'),
  uploadCustomRedirectObjects: require('./upload-custom-redirect-objects'),
  uploadTrailingSlashRedirectObjects: require('./upload-trailing-slash-redirect-objects')
};
