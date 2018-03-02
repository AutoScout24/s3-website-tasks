/* global afterEach, beforeEach, describe, expect, it */
describe('create-trailing-slash-redirect-definitions', () => {

  const mockFs = require('mock-fs');

  const createTrailingSlashRedirectDefinitions = require('./');

  beforeEach(() => {
    delete require.cache[require.resolve('./')];
  });

  afterEach(() => {
    mockFs.restore();
  });

  it('should return a definition with an s3 key without trailing slash and a correct redirect url given one directory', () => {
    mockFs({
      'public/service/www.autoscout24.de/some-folder': {}
    });
    return createTrailingSlashRedirectDefinitions('public')
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'service/www.autoscout24.de/some-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-folder/'
      });
    });
  });

  it('should process all directories correctly given multiple ones', () => {
    mockFs({
      'public/service/www.autoscout24.de/some-folder': {},
      'public/service/www.autoscout24.de/some-other-folder': {},
      'public/service/www.autoscout24.es/another-one': {}
    });
    return createTrailingSlashRedirectDefinitions('public')
    .then(([firstRedirectDefinition, secondRedirectDefinition, thirdRedirectDefinition]) => {
      expect(firstRedirectDefinition).to.deep.equal({
        s3Key: 'service/www.autoscout24.de/some-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-folder/'
      });
      expect(secondRedirectDefinition).to.deep.equal({
        s3Key: 'service/www.autoscout24.de/some-other-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-other-folder/'
      });
      expect(thirdRedirectDefinition).to.deep.equal({
        s3Key: 'service/www.autoscout24.es/another-one',
        redirectUrl: 'https://www.autoscout24.es/service/another-one/'
      });
    });
  });

});
