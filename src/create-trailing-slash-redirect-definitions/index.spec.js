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

  it('should return a correct redirect definition given one directory and a generic url path prefix', () => {
    mockFs({
      'public/content/de/some-directory': {}
    });
    return createTrailingSlashRedirectDefinitions({
      thirdLevelDomain: 'www',
      secondLevelDomain: 'autoscout24',
      urlPathPrefixMap: [{key: '*', value: 'website'}],
      rootDirectory: 'public'
    })
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-directory',
        redirectUrl: 'https://www.autoscout24.de/website/some-directory/'
      });
    });
  });

  it('should return a correct redirect definition given one directory and no matching url path prefix', () => {
    mockFs({
      'public/content/de/some-directory': {}
    });
    return createTrailingSlashRedirectDefinitions({
      thirdLevelDomain: 'www',
      secondLevelDomain: 'autoscout24',
      rootDirectory: 'public'
    })
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-directory',
        redirectUrl: 'https://www.autoscout24.de/some-directory/'
      });
    });
  });

  it('should return correct redirect definitions given multiple directories and a url path prefix map', () => {
    mockFs({
      'public/content/de/some-directory': {},
      'public/content/de/some-other-directory': {},
      'public/content/be/fr/language-specific-one': {},
      'public/content/es/another-one': {}
    });
    return createTrailingSlashRedirectDefinitions({
      thirdLevelDomain: 'www',
      secondLevelDomain: 'autoscout24',
      urlPathPrefixMap: [
        {key: '*', value: 'auto'},
        {key: 'es', value: 'coches'},
        {key: 'be/fr', value: 'voiture'}
      ],
      rootDirectory: 'public'
    })
    .then(redirectDefinitions => {
      expect(redirectDefinitions).to.deep.include({
        s3Key: 'content/de/some-directory',
        redirectUrl: 'https://www.autoscout24.de/auto/some-directory/'
      });
      expect(redirectDefinitions).to.deep.include({
        s3Key: 'content/de/some-other-directory',
        redirectUrl: 'https://www.autoscout24.de/auto/some-other-directory/'
      });
      expect(redirectDefinitions).to.deep.include({
        s3Key: 'content/be/fr/language-specific-one',
        redirectUrl: 'https://www.autoscout24.be/fr/voiture/language-specific-one/'
      });
      expect(redirectDefinitions).to.deep.include({
        s3Key: 'content/es/another-one',
        redirectUrl: 'https://www.autoscout24.es/coches/another-one/'
      });
    });
  });

});
