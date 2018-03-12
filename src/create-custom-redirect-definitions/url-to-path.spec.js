/* global describe, expect, it */
describe('create-custom-redirect-definitions/url-to-path', () => {

  const urlToPath = require('./url-to-path');

  it('should not include any provided protocol', () => {
    const url = 'https://www.autoscout24.de/service/file.jpg';
    expect(urlToPath(url)).not.to.contain('https://');
  });

  it('should replace the first path component with "content"', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/^content\//);
  });

  it('should use the top level domain as subfolder after the service prefix', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/^[^/]+\/de/);
  });

  it('should append the rest of the path components after the host', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/\/path\/$/);
  });

  it('should correctly transform the url given a belgium path prefix', () => {
    const url = 'www.autoscout24.be/fr/service/path/';
    expect(urlToPath(url)).to.equal('content/be/fr/path/');
  });

});
