module.exports = {
  checkForInternalDeadLinks: require('./check-for-internal-dead-links'),
  createDeadLinksReport: require('./check-for-internal-dead-links/create-report'),
  createOrUpdateStack: require('./create-or-update-stack'),
  deleteStack: require('./delete-stack'),
  minifyImages: require('./minify-images'),
  createCustomRedirectDefinitions: require('./create-custom-redirect-definitions'),
  createTrailingSlashRedirectDefinitions: require('./create-trailing-slash-redirect-definitions')
};
