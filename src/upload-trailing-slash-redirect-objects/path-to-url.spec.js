/* global describe, expect, it */
describe('upload-trailing-slash-redirect-objects/path-to-url', () => {

  const pathToUrl = require('./path-to-url');

  it('should correctly transform the path', () => {
    const path = 'service/www.autoscout24.de/subfolder/index.html';
    expect(pathToUrl(path)).to.equal('https://www.autoscout24.de/service/subfolder/index.html');
  });

});
