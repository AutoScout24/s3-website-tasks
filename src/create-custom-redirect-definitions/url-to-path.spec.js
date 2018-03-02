/* global describe, expect, it */
describe('create-custom-redirect-definitions/url-to-path', () => {

  const urlToPath = require('./url-to-path');

  it('should not include any provided protocol', () => {
    const url = 'https://www.autoscout24.de/service/file.jpg';
    expect(urlToPath(url)).to.equal('service/www.autoscout24.de/file.jpg');
  });

  it('should add the service as first path component', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/^service\//);
  });

  it('should use the domain as subfolder after the service prefix', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/^[^/]+\/www\.autoscout24\.de/);
  });

  it('should append the rest of the path components after the host', () => {
    const url = 'www.autoscout24.de/service/path/';
    expect(urlToPath(url)).to.match(/www\.autoscout24\.de\/path\//);
  });

  it('should correctly transform the url given a belgium path prefix', () => {
    const url = 'www.autoscout24.be/fr/service/path/';
    expect(urlToPath(url)).to.equal('service/www.autoscout24.be/fr/path/');
  });

});
