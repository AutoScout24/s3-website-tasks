/* global describe, expect, it */
describe('check-internal-dead-links/url-to-filename', () => {

  const urlToFilename = require('./url-to-filename');

  it('should not include any provided protocol', () => {
    const url = 'https://www.autoscout24.de/assets/service/file.jpg';
    expect(urlToFilename(url)).not.to.match(/^https/);
  });

  describe('given an assets url', () => {

    it('should remove the host', () => {
      const url = 'www.autoscout24.de/assets/service/folder/subfolder/file.jpg';
      expect(urlToFilename(url)).to.match(/^assets\//);
    });

    it('should remove the first path component after the assets prefix', () => {
      const url = 'www.autoscout24.de/assets/service/folder/subfolder/file.jpg';
      expect(urlToFilename(url)).to.equal('assets/folder/subfolder/file.jpg');
    });

  });

  describe('given a content url', () => {

    it('should add the term "content" as first path component', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/^content\//);
    });

    it('should use the top level domain as subfolder after the url path prefix', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/^[^/]+\/de/);
    });

    it('should append the rest of the path components after the host', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/de\/path\//);
    });

    it('should append the index.html at the end', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/\/path\/index\.html$/);
    });

  });

});
