/* global describe, expect, it */
describe('create-trailing-slash-redirect-definitions/path-to-url', () => {

  const pathToUrl = require('./path-to-url');

  it('should prepend the https protocol', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.match(/^https:\/\//);
  });

  it('should use the provided third level domain', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www2',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.contain('ww2.');
  });

  it('should use the provided second level domain', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.contain('.autoscout24.');
  });

  it('should use the detected top level domain from the content subdirectory', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.contain('.de/');
  });

  it('should append the content specific path as url path', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.match(/subdirectory\/$/);
  });

  it('should prepend the detected language from the directory as url path', () => {
    const path = 'content/be/fr/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.match(/fr\/[^/]+\/subdirectory\/$/);
  });

  it('should use the correct url path prefix given a tld specific one', () => {
    const path = 'content/de/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: 'de', value: 'prefix'}],
        path
      })
    ).to.match(/\.de\/prefix\//);
  });

  it('should use the correct url path prefix given a language specific one', () => {
    const path = 'content/be/fr/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: 'be/fr', value: 'prefix'}],
        path
      })
    ).to.match(/\.be\/fr\/prefix\//);
  });

  it('should use the correct url path prefix given a generic one', () => {
    const path = 'content/it/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: '*', value: 'prefix'}],
        path
      })
    ).to.match(/\.it\/prefix\//);
  });

  it('should use no url path prefix given none is matching', () => {
    const path = 'content/it/subdirectory/';
    expect(
      pathToUrl({
        thirdLevelDomain: 'www',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixMap: [{key: 'de', value: 'prefix'}],
        path
      })
    ).to.equal('https://www.autoscout24.it/subdirectory/');
  });

});
