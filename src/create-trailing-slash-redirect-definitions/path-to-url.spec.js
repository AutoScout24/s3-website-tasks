/* global describe, expect, it */
describe('create-trailing-slash-redirect-definitions/path-to-url', () => {

  const pathToUrl = require('./path-to-url');

  it('should correctly transform the path', () => {
    const path = 'service/www.autoscout24.de/subfolder/index.html';
    expect(pathToUrl(path)).to.equal('https://www.autoscout24.de/service/subfolder/index.html');
  });

  it('should correctly transform the path given a belgium language path prefix', () => {
    const path = 'service/www.autoscout24.be/nl/subfolder/index.html';
    expect(pathToUrl(path)).to.equal('https://www.autoscout24.be/nl/service/subfolder/index.html');
  });

});
