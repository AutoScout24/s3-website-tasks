/* global afterEach, describe, expect, it, */
describe('create-custom-redirect-definitions', () => {

  const mockFs = require('mock-fs');

  const createCustomRedirectDefinitions = require('./');

  afterEach(() => {
    mockFs.restore();
  });

  it('should return a definition with correct s3 key and redirect url given a single redirect in a single file', () => {
    mockFs({
      'redirects/de.csv': 'service/some-url/,service/some-redirected-url/'
    });
    return createCustomRedirectDefinitions({
      thirdLevelDomain: 'www', secondLevelDomain: 'autoscout24', redirectsFolder: 'redirects'
    })
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'content/de/some-url/index.html',
        redirectUrl: 'https://www.autoscout24.de/service/some-redirected-url/'
      });
    });
  });

  it('should process all files correctly given multiple redirect files with multiple redirects', () => {
    mockFs({
      'redirects/be.csv': 'fr/service/d/,fr/service/d-redirect/',
      'redirects/de.csv': 'service/a/,service/a-redirect/',
      'redirects/it.csv': 'service/b/,service/b-redirect/\nservice/c/,service/c-redirect/'
    });
    return createCustomRedirectDefinitions({
      thirdLevelDomain: 'www', secondLevelDomain: 'autoscout24', redirectsFolder: 'redirects'
    })
    .then(redirectDefinitions => {
      expect(redirectDefinitions).to.have.length(4);
      expect(redirectDefinitions[0]).to.deep.equal({
        s3Key: 'content/be/fr/d/index.html',
        redirectUrl: 'https://www.autoscout24.be/fr/service/d-redirect/'
      });
      expect(redirectDefinitions[1]).to.deep.equal({
        s3Key: 'content/de/a/index.html',
        redirectUrl: 'https://www.autoscout24.de/service/a-redirect/'
      });
      expect(redirectDefinitions[2]).to.deep.equal({
        s3Key: 'content/it/b/index.html',
        redirectUrl: 'https://www.autoscout24.it/service/b-redirect/'
      });
      expect(redirectDefinitions[3]).to.deep.equal({
        s3Key: 'content/it/c/index.html',
        redirectUrl: 'https://www.autoscout24.it/service/c-redirect/'
      });

    });
  });


});
