/* global describe, expect, it */
describe('check-for-internal-dead-links/find-internal-urls', () => {

  const findInternalUrls = require('./find-internal-urls');

  describe('given an absolute url which starts with a valid service prefix', () => {

    it('should include the url given it is inside a "src" attribute', () => {
      const contentUrl = 'https://www.autoscout24.de/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<img src="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should include the url given it is inside a "srcset" attribute', () => {
      const contentUrl = 'https://www.autoscout24.de/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<img srcset="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should include the url given it is inside a "href" attribute', () => {
      const contentUrl = 'https://www.autoscout24.de/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should not include the url given it is inside another attribute', () => {
      const contentUrl = 'https://www.autoscout24.de/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a some-attribute="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(contentUrl);
    });

    it('should include the url given it contains the assets prefix', () => {
      const imageUrl = 'https://www.autoscout24.de/assets/my-service/foobar.jpg';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(imageUrl);
    });

    it('should not include the url given it is a webp file', () => {
      const imageUrl = 'https://www.autoscout24.de/assets/my-service/foobar.webp';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(imageUrl);
    });

  });

  describe('given a relative url which starts with a valid service prefix', () => {

    it('should include the url given it is inside a "src" attribute', () => {
      const contentUrl = '/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<img src="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should include the url given it is inside a "srcset" attribute', () => {
      const contentUrl = '/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<img srcset="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should include the url given it is inside a "href" attribute', () => {
      const contentUrl = '/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(contentUrl);
    });

    it('should not include the url given it is inside another attribute', () => {
      const contentUrl = '/my-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a some-attribute="${contentUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(contentUrl);
    });

    it('should include the url given it contains the assets prefix', () => {
      const imageUrl = '/assets/my-service/foobar.jpg';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).to.include(imageUrl);
    });

    it('should not include the url given it is a webp file', () => {
      const imageUrl = '/assets/my-service/foobar.webp';
      const internalUrls = findInternalUrls({
        text: `<img src="${imageUrl}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(imageUrl);
    });

  });

  describe('given the url is within a valid attribute but does not start with a valid service prefix', () => {

    it('should not include it given it is an absolute url', () => {
      const url = 'https://www.autoscout24.de/another-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${url}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(url);
    });

    it('should not include it given it is a relative url', () => {
      const url = '/another-service/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${url}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service']
      });
      expect(internalUrls).not.to.include(url);
    });

  });

  describe('given the url matches one of the prefixes given multiple prefixes', () => {

    it('should include it given it is an absolute url', () => {
      const url = 'https://www.autoscout24.de/my-service-1/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${url}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service-2', 'my-service-1']
      });
      expect(internalUrls).to.include(url);
    });

    it('should include it given it is a relative url', () => {
      const url = '/my-service-1/foobar/';
      const internalUrls = findInternalUrls({
        text: `<a href="${url}">`,
        secondLevelDomain: 'autoscout24',
        pathPrefixes: ['my-service-2', 'my-service-1']
      });
      expect(internalUrls).to.include(url);
    });
  });

  it('should not include the url given it contains another second level domain', () => {
    const url = 'https://www.immobilienscout24.de/my-service/foobar/';
    const internalUrls = findInternalUrls({
      text: `<a href="${url}">`,
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['my-service']
    });
    expect(internalUrls).not.to.include(url);
  });

  it('should not include the url given it contains another second third domain than provided', () => {
    const url = 'https://www.autoscout24.de/my-service/foobar/';
    const internalUrls = findInternalUrls({
      text: `<a href="${url}">`,
      secondLevelDomain: 'autoscout24',
      thirdLevelDomain: 'ww2',
      pathPrefixes: ['my-service']
    });
    expect(internalUrls).not.to.include(url);
  });

});
