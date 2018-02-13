/* global describe, expect, it */
describe('check-internal-dead-links/url-to-filename', () => {

  const urlToFilename = require('./url-to-filename');

  it('should not include any provided protocol', () => {
    const url = 'https://www.autoscout24.de/assets/service/file.jpg';
    expect(urlToFilename(url)).to.equal('assets/service/file.jpg');
  });

  it('should remove the host given an assets url', () => {
    const url = 'www.autoscout24.de/assets/service/file.jpg';
    expect(urlToFilename(url)).to.equal('assets/service/file.jpg');
  });

  describe('given a non assets url', () => {

    it('should add the service as first path component', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/^service\//);
    });

    it('should use the host as subfolder after the service prefix', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/^[^/]+\/www\.autoscout24\.de/);
    });

    it('should append the rest of the path components after the host', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/www\.autoscout24\.de\/path\//);
    });

    it('should append the index.html at the end', () => {
      const url = 'www.autoscout24.de/service/path/';
      expect(urlToFilename(url)).to.match(/\/path\/index\.html$/);
    });

  });


});
