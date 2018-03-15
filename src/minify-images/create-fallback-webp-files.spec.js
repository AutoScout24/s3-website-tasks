/* global afterEach, expect, describe, it, sandbox */
describe('create-fallback-webp-files', () => {

  const fs = require('fs');

  const mockFs = require('mock-fs');

  const createFallbackWebpFiles = require('./create-fallback-webp-files');

  afterEach(() => {
    mockFs.restore();
  });

  it('should not duplicate the jpeg as webp given there is already an according webp', () => {
    mockFs({
      'public': {
        'test.jpg': 'jpeg content',
        'test.webp': 'webp content'
      }
    });
    return createFallbackWebpFiles('public')
    .then(() => {
      expect(fs.readFileSync('public/test.webp').toString()).to.equal('webp content');
    });
  });

  // TODO: Find out why mock-fs is not able to copy the file and then simplify spec
  it('should duplicate the jpeg as webp given there is no according webp', () => {
    sandbox.stub(fs, 'copyFile').yields(null);
    delete require.cache[require.resolve('fs')];
    delete require.cache[require.resolve('./create-fallback-webp-files')];
    let createFallbackWebpFiles = require('./create-fallback-webp-files');
    mockFs({
      'public': {
        'test.jpg': 'jpeg content'
      }
    });
    return createFallbackWebpFiles('public')
    .then(() => {
      expect(fs.copyFile).to.have.been.calledWith('public/test.jpg', 'public/test.webp');
    });
  });

  // TODO: Find out why mock-fs is not able to copy the file and then simplify spec
  it('should preserve the directory structure when creating fallback webp files', () => {
    sandbox.stub(fs, 'copyFile').yields(null);
    delete require.cache[require.resolve('fs')];
    delete require.cache[require.resolve('./create-fallback-webp-files')];
    let createFallbackWebpFiles = require('./create-fallback-webp-files');
    mockFs({
      'public/nested/directory/test.jpg': 'jpeg content'
    });
    return createFallbackWebpFiles('public')
    .then(() => {
      expect(fs.copyFile).to.have.been.calledWith(
        'public/nested/directory/test.jpg', 'public/nested/directory/test.webp');
    });
  });

});
