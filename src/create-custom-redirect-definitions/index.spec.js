/* global afterEach, describe, expect, it, */
describe('create-custom-redirect-definitions', () => {

  const mockFs = require('mock-fs');

  const createCustomRedirectDefinitions = require('./');

  afterEach(() => {
    mockFs.restore();
  });

  it('should return a definition with correct s3 key and redirect url given a single redirect in a single file', () => {
    mockFs({
      'redirects/www.autoscout24.de.csv': 'service/some-url/,service/some-redirected-url/'
    });
    return createCustomRedirectDefinitions('redirects')
    .then(([redirectDefinition]) => {
      expect(redirectDefinition).to.deep.equal({
        s3Key: 'service/www.autoscout24.de/some-url/index.html',
        redirectUrl: 'https://www.autoscout24.de/service/some-redirected-url/'
      });
    });
  });

  it('should process all files correctly given multiple redirect files with multiple redirects', () => {
    mockFs({
      'redirects/www.autoscout24.de.csv': 'service/a/,service/a-redirect/',
      'redirects/www.autoscout24.it.csv': 'service/b/,service/b-redirect/\nservice/c/,service/c-redirect/'
    });
    return createCustomRedirectDefinitions('redirects')
    .then(redirectDefinitions => {
      expect(redirectDefinitions).to.have.length(3);
      expect(redirectDefinitions[0]).to.deep.equal({
        s3Key: 'service/www.autoscout24.de/a/index.html',
        redirectUrl: 'https://www.autoscout24.de/service/a-redirect/'
      });
      expect(redirectDefinitions[1]).to.deep.equal({
        s3Key: 'service/www.autoscout24.it/b/index.html',
        redirectUrl: 'https://www.autoscout24.it/service/b-redirect/'
      });
      expect(redirectDefinitions[2]).to.deep.equal({
        s3Key: 'service/www.autoscout24.it/c/index.html',
        redirectUrl: 'https://www.autoscout24.it/service/c-redirect/'
      });
    });
  });


});
