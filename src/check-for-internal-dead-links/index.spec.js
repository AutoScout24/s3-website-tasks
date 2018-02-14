/* global afterEach, describe, expect, it */
describe('check-for-internal-dead-links', () => {

  const mockFs = require('mock-fs');

  const checkForInternalDeadLinks = require('./');

  afterEach(() => {
    mockFs.restore();
  });

  it('should report dead links given internal links inside supported attributes', () => {
    mockFs({
      'public/moto/www.autoscout24.de': {
        'bmw': {
          'index.html': '<a href="https://www.autoscout24.de/moto/dead-link-1/"><img src="https://www.autoscout24.de/moto/dead-link-2/">'
        },
        'ktm': {
          'index.html': '<img srcset="https://www.autoscout24.de/moto/dead-link-3/">'
        }
      }
    });
    return checkForInternalDeadLinks({
      rootFolder: 'public',
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['moto']
    }).then(deadLinksByFiles => {
      expect(deadLinksByFiles.length).to.equal(2);
      expect(deadLinksByFiles[0].filename).to.equal('public/moto/www.autoscout24.de/bmw/index.html');
      expect(deadLinksByFiles[0].deadLinks).to.deep.equal([
        'https://www.autoscout24.de/moto/dead-link-1/',
        'https://www.autoscout24.de/moto/dead-link-2/'
      ]);
      expect(deadLinksByFiles[1].filename).to.equal('public/moto/www.autoscout24.de/ktm/index.html');
      expect(deadLinksByFiles[1].deadLinks).to.deep.equal([
        'https://www.autoscout24.de/moto/dead-link-3/'
      ]);
    });
  });

  it('should not report dead links given internal links inside unsupported attributes', () => {
    mockFs({
      'public/moto/www.autoscout24.de': {
        'index.html': '<a some-attr="https://www.autoscout24.de/moto/foobar/">'
      }
    });
    return checkForInternalDeadLinks({
      rootFolder: 'public',
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['moto']
    }).then(deadLinksByFiles => {
      expect(deadLinksByFiles).to.have.length(0);
    });
  });

  it('should not report dead links given valid internal links', () => {
    mockFs({
      'public/moto/www.autoscout24.de': {
        'index.html': '<a href="https://www.autoscout24.de/moto/bmw/">',
        'bmw': {
          'index.html': 'Some content'
        }
      }
    });
    return checkForInternalDeadLinks({
      rootFolder: 'public',
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['moto']
    }).then(deadLinksByFiles => {
      expect(deadLinksByFiles).to.have.length(0);
    });
  });

  it('should respect top level domains when searching internal dead links', () => {
    mockFs({
      'public/moto/www.autoscout24.de/index.html': '<a href="https://www.autoscout24.de/moto/bmw/">',
      'public/moto/www.autoscout24.it/bmw/index.html': 'Some content'
    });
    return checkForInternalDeadLinks({
      rootFolder: 'public',
      secondLevelDomain: 'autoscout24',
      pathPrefixes: ['moto']
    }).then(deadLinksByFiles => {
      expect(deadLinksByFiles).to.have.length(1);
    });
  });

});
