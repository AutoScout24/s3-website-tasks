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
      'public/content/de/some-folder': {}
    });
    return createTrailingSlashRedirectDefinitions(
      {fqdn: 'www.autoscout24.de', pathPrefix: 'service', rootFolder: 'public'}
    )
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-folder/'
      });
    });
  });

  it('should process all directories correctly given multiple ones', () => {
    mockFs({
      'public/content/de/some-folder': {},
      'public/content/de/some-other-folder': {},
      'public/content/es/another-one': {}
    });
    return createTrailingSlashRedirectDefinitions(
      {fqdn: 'www.autoscout24.de', pathPrefix: 'service', rootFolder: 'public'}
    )
    .then(([firstRedirectDefinition, secondRedirectDefinition]) => {
      expect(firstRedirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-folder/'
      });
      expect(secondRedirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-other-folder',
        redirectUrl: 'https://www.autoscout24.de/service/some-other-folder/'
      });
    });
  });

});
