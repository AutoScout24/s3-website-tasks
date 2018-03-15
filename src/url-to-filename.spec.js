/* global describe, expect, it */
describe('url-to-filename', () => {

  const urlToFilename = require('./url-to-filename');

  it('should not include any provided protocol', () => {
    const url = 'https://www.autoscout24.de/assets/service/file.jpg';
    expect(urlToFilename({url})).not.to.match(/^https/);
  });

  describe('given an assets url', () => {

    it('should use "assets" as first file path component', () => {
      const url = 'www.autoscout24.de/assets/service/directory/subdirectory/file.jpg';
      expect(urlToFilename({url})).to.match(/^assets\//);
    });

    it('should append the url path without the url path prefix as file path given one matching url path prefix', () => {
      const url = 'www.autoscout24.de/assets/website/directory/subdirectory/file.jpg';
      expect(urlToFilename({url, urlPathPrefixes: ['website']})).to.match(/^[^/]+\/directory\/subdirectory\/file\.jpg/);
    });

    it('should append the complete url path as file path given one not matching url path prefix', () => {
      const url = 'www.autoscout24.de/assets/directory/subdirectory/file.jpg';
      expect(urlToFilename({url, urlPathPrefixes: ['website']})).to.match(/^[^/]+\/directory\/subdirectory\/file\.jpg/);
    });

    it('should append the complete url path as file path given no url path prefixes', () => {
      const url = 'www.autoscout24.de/assets/directory/subdirectory/file.jpg';
      expect(urlToFilename({url})).to.match(/^[^/]+\/directory\/subdirectory\/file\.jpg/);
    });

  });

  describe('given a content url', () => {

    it('should add the term "content" as first path component', () => {
      const url = 'www.autoscout24.de/wesbite/path/';
      expect(urlToFilename({url})).to.match(/^content\//);
    });

    it('should use the top level domain as second path component', () => {
      const url = 'www.autoscout24.de/wesbite/path/';
      expect(urlToFilename({url})).to.match(/^[^/]+\/de/);
    });

    it('should append the url path without the url path prefix as file path given one matching url path prefix', () => {
      const url = 'www.autoscout24.de/website/path/';
      expect(urlToFilename({url, urlPathPrefixes: ['website']})).to.match(/^[^/]+\/[^/]+\/path\//);
    });

    it('should append the complete url path as file path given one not matching url path prefix', () => {
      const url = 'www.autoscout24.de/directory/subdirectory/';
      expect(urlToFilename({url, urlPathPrefixes: ['website']})).to.match(/^[^/]+\/[^/]+\/directory\/subdirectory\//);
    });

    it('should append the complete url path as file path given no url path prefixes', () => {
      const url = 'www.autoscout24.de/directory/subdirectory/';
      expect(urlToFilename({url})).to.match(/^[^/]+\/[^/]+\/directory\/subdirectory\//);
    });

    it('should append the index.html at the end', () => {
      const url = 'www.autoscout24.de/website/path/';
      expect(urlToFilename({url})).to.match(/\/path\/index\.html$/);
    });

    it('should correctly handle belgium urls with a language path prefix given a url path prefix', () => {
      const url = 'www.autoscout24.be/nl/website/path/';
      expect(urlToFilename({url, urlPathPrefixes: ['website']})).to.equal('content/be/nl/path/index.html');
    });

    it('should correctly handle belgium urls with a language path prefix given no url path prefix', () => {
      const url = 'www.autoscout24.be/nl/path/';
      expect(urlToFilename({url})).to.equal('content/be/nl/path/index.html');
    });

  });

});
