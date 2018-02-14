/* global describe, expect, it */
describe('check-for-internal-dead-links/find-internal-urls', () => {

  const findInternalUrls = require('./find-internal-urls');

  describe('given an url which starts with a valid service prefix', () => {

    const pageUrl = 'https://www.autoscout24.de/my-service/foobar';
    const pathPrefix = 'my-service';

    it('should return the url given it is inside a "src" attribute', () => {
      const internalUrls = findInternalUrls({
        text: `<img src="${pageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).to.include(pageUrl);
    });

    it('should return the url given it is inside a "srcset" attribute', () => {
      const internalUrls = findInternalUrls({
        text: `<img srcset="${pageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).to.include(pageUrl);
    });

    it('should return the url given it is inside a "href" attribute', () => {
      const internalUrls = findInternalUrls({
        text: `<a href="${pageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).to.include(pageUrl);
    });

    it('should not return the url given it is inside another attribute', () => {
      const internalUrls = findInternalUrls({
        text: `<a some-attribute="${pageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).not.to.include(pageUrl);
    });

    it('should return the url given it contains the assets prefix', () => {
      const imageUrl = 'https://www.autoscout24.de/assets/my-service/foobar.jpg';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).to.include(imageUrl);
    });

    it('should not return the url given it is a webp file', () => {
      const imageUrl = 'https://www.autoscout24.de/assets/my-service/foobar.webp';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: [pathPrefix]
      });
      expect(internalUrls).not.to.include(imageUrl);
    });
  });

  describe('given an url which does not start with a provided service prefix', () => {

    it('should not return the url even it is within a valid attribute', () => {
      const url = 'https://www.autoscout24.de/another-service/foobar';
      const internalUrls = findInternalUrls({
        text: `<a href="${url}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(url);
    });

  });

  it('should return the url given it matches one of the prefixes given multiple prefixes', () => {
    const url = 'https://www.autoscout24.de/my-service-1/foobar';
    const internalUrls = findInternalUrls({
      text: `<a href="${url}">`,
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['my-service-2', 'my-service-1']
    });
    expect(internalUrls).to.include(url);
  });

});
