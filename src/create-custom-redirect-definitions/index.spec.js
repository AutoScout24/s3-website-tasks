/* global afterEach, describe, expect, it, */
describe('create-custom-redirect-definitions', () => {

  const mockFs = require('mock-fs');

  const createCustomRedirectDefinitions = require('./');

  afterEach(() => {
    mockFs.restore();
  });

  describe('given an url path prefix', () => {
    it('should return a definition with correct s3 key and redirect url given a single redirect', () => {
      mockFs({
        'redirects/de.csv': 'website/some-url/,website/some-redirected-url/'
      });
      return createCustomRedirectDefinitions({
        redirectsDirectory: 'redirects',
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['website']
      })
      .then(([redirectDefinition]) => {
        expect(redirectDefinition).to.deep.equal({
          s3Key: 'content/de/some-url/index.html',
          redirectUrl: 'https://www.autoscout24.de/website/some-redirected-url/'
        });
      });
    });

    it('should process all files correctly given multiple redirect files with multiple redirects', () => {
      mockFs({
        'redirects/be.csv': 'fr/website/d/,fr/website/d-redirect/',
        'redirects/de.csv': 'website/a/,website/a-redirect/',
        'redirects/it.csv': 'website/b/,website/b-redirect/\nwebsite/c/,website/c-redirect/'
      });
      return createCustomRedirectDefinitions({
        redirectsDirectory: 'redirects',
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['website']
      })
      .then(redirectDefinitions => {
        expect(redirectDefinitions).to.have.length(4);
        expect(redirectDefinitions[0]).to.deep.equal({
          s3Key: 'content/be/fr/d/index.html',
          redirectUrl: 'https://www.autoscout24.be/fr/website/d-redirect/'
        });
        expect(redirectDefinitions[1]).to.deep.equal({
          s3Key: 'content/de/a/index.html',
          redirectUrl: 'https://www.autoscout24.de/website/a-redirect/'
        });
        expect(redirectDefinitions[2]).to.deep.equal({
          s3Key: 'content/it/b/index.html',
          redirectUrl: 'https://www.autoscout24.it/website/b-redirect/'
        });
        expect(redirectDefinitions[3]).to.deep.equal({
          s3Key: 'content/it/c/index.html',
          redirectUrl: 'https://www.autoscout24.it/website/c-redirect/'
        });

      });
    });
  });

  describe('given no url path prefix', () => {
    it('should return a definition with correct s3 key and redirect url given a single redirect', () => {
      mockFs({
        'redirects/de.csv': 'path/some-url/,path/some-redirected-url/'
      });
      return createCustomRedirectDefinitions({
        redirectsDirectory: 'redirects',
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24'
      })
      .then(([redirectDefinition]) => {
        expect(redirectDefinition).to.deep.equal({
          s3Key: 'content/de/path/some-url/index.html',
          redirectUrl: 'https://www.autoscout24.de/path/some-redirected-url/'
        });
      });
    });

    it('should process all files correctly given multiple redirect files with multiple redirects', () => {
      mockFs({
        'redirects/be.csv': 'fr/path/d/,fr/path/d-redirect/',
        'redirects/de.csv': 'path/a/,path/a-redirect/',
        'redirects/it.csv': 'path/b/,path/b-redirect/\npath/c/,path/c-redirect/'
      });
      return createCustomRedirectDefinitions({
        redirectsDirectory: 'redirects',
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24'
      })
      .then(redirectDefinitions => {
        expect(redirectDefinitions).to.have.length(4);
        expect(redirectDefinitions[0]).to.deep.equal({
          s3Key: 'content/be/fr/path/d/index.html',
          redirectUrl: 'https://www.autoscout24.be/fr/path/d-redirect/'
        });
        expect(redirectDefinitions[1]).to.deep.equal({
          s3Key: 'content/de/path/a/index.html',
          redirectUrl: 'https://www.autoscout24.de/path/a-redirect/'
        });
        expect(redirectDefinitions[2]).to.deep.equal({
          s3Key: 'content/it/path/b/index.html',
          redirectUrl: 'https://www.autoscout24.it/path/b-redirect/'
        });
        expect(redirectDefinitions[3]).to.deep.equal({
          s3Key: 'content/it/path/c/index.html',
          redirectUrl: 'https://www.autoscout24.it/path/c-redirect/'
        });

      });
    });
  });

});
