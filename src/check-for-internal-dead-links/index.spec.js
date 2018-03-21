/* global afterEach, describe, expect, it */
describe('check-for-internal-dead-links', () => {

  const mockFs = require('mock-fs');

  const checkForInternalDeadLinks = require('./');

  afterEach(() => {
    mockFs.restore();
  });

  describe('given url path prefixes', () => {

    it('should report dead links given internal links inside supported attributes', () => {
      mockFs({
        'public/content/de': {
          'bmw': {
            'index.html': `
              <a href="https://www.autoscout24.de/moto/dead-link-1/">
              <img src="https://www.autoscout24.de/moto/dead-link-2/">
              <a href="/moto/dead-link-3/">
              <img src="/moto/dead-link-4/">
            `
          },
          'ktm': {
            'index.html': `
              <img srcset="https://www.autoscout24.de/moto/dead-link-5/">
              <img srcset="/moto/dead-link-6/">
            `
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['moto']
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles.length).to.equal(2);
        expect(deadLinksByFiles[0].filename).to.equal('public/content/de/bmw/index.html');
        expect(deadLinksByFiles[0].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/moto/dead-link-1/',
          'https://www.autoscout24.de/moto/dead-link-2/',
          'https://www.autoscout24.de/moto/dead-link-3/',
          'https://www.autoscout24.de/moto/dead-link-4/'
        ]);
        expect(deadLinksByFiles[1].filename).to.equal('public/content/de/ktm/index.html');
        expect(deadLinksByFiles[1].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/moto/dead-link-5/',
          'https://www.autoscout24.de/moto/dead-link-6/'
        ]);
      });
    });

    it('should report dead links given internal asset links inside supported attributes', () => {
      mockFs({
        'public/content/de': {
          'bmw': {
            'index.html': `
              <a href="https://www.autoscout24.de/assets/moto/dead-link-1.jpg">
              <img src="https://www.autoscout24.de/assets/moto/dead-link-2.jpg">
              <a href="/assets/moto/dead-link-3.jpg">
              <img src="/assets/moto/dead-link-4.jpg">
            `
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['moto']
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles.length).to.equal(1);
        expect(deadLinksByFiles[0].filename).to.equal('public/content/de/bmw/index.html');
        expect(deadLinksByFiles[0].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/assets/moto/dead-link-1.jpg',
          'https://www.autoscout24.de/assets/moto/dead-link-2.jpg',
          'https://www.autoscout24.de/assets/moto/dead-link-3.jpg',
          'https://www.autoscout24.de/assets/moto/dead-link-4.jpg'
        ]);
      });
    });

    it('should not report dead links given internal links inside unsupported attributes', () => {
      mockFs({
        'public/content/de': {
          'index.html': '<a some-attr="https://www.autoscout24.de/moto/foobar/">'
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['moto']
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(0);
      });
    });

    it('should not report dead links given valid internal links', () => {
      mockFs({
        'public/assets': {
          'image.jpg': 'image'
        },
        'public/content/de': {
          'index.html': `
            <a href="https://www.autoscout24.de/moto/bmw/">
            <a href="/moto/bmw/">
            <img src="https://www.autoscout24.de/assets/moto/image.jpg">
          `,
          'bmw': {
            'index.html': 'Some content'
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['moto']
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(0);
      });
    });

    it('should respect top level domains when searching internal dead links', () => {
      mockFs({
        'public/content/de/index.html': `
          <a href="https://www.autoscout24.de/moto/bmw/">
          <a href="/moto/bmw/">
        `,
        'public/content/it/bmw/index.html': 'Some content'
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24',
        urlPathPrefixes: ['moto']
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(1);
        expect(deadLinksByFiles[0].deadLinks).to.have.length(2);
      });
    });

  });

  describe('given no url path prefixes', () => {

    it('should report dead links given internal links inside supported attributes', () => {
      mockFs({
        'public/content/de': {
          'bmw': {
            'index.html': `
              <a href="https://www.autoscout24.de/dead-link-1/">
              <img src="https://www.autoscout24.de/dead-link-2/">
              <a href="/dead-link-3/">
              <img src="/dead-link-4/">
            `
          },
          'ktm': {
            'index.html': `
              <img srcset="https://www.autoscout24.de/dead-link-5/">
              <img srcset="/dead-link-6/">
            `
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24'
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles.length).to.equal(2);
        expect(deadLinksByFiles[0].filename).to.equal('public/content/de/bmw/index.html');
        expect(deadLinksByFiles[0].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/dead-link-1/',
          'https://www.autoscout24.de/dead-link-2/',
          'https://www.autoscout24.de/dead-link-3/',
          'https://www.autoscout24.de/dead-link-4/'
        ]);
        expect(deadLinksByFiles[1].filename).to.equal('public/content/de/ktm/index.html');
        expect(deadLinksByFiles[1].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/dead-link-5/',
          'https://www.autoscout24.de/dead-link-6/'
        ]);
      });
    });

    it('should report dead links given internal asset links inside supported attributes', () => {
      mockFs({
        'public/content/de': {
          'bmw': {
            'index.html': `
              <a href="https://www.autoscout24.de/assets/dead-link-1.jpg">
              <img src="https://www.autoscout24.de/assets/dead-link-2.jpg">
              <a href="/assets/dead-link-3.jpg">
              <img src="/assets/dead-link-4.jpg">
            `
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24'
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles.length).to.equal(1);
        expect(deadLinksByFiles[0].filename).to.equal('public/content/de/bmw/index.html');
        expect(deadLinksByFiles[0].deadLinks).to.deep.equal([
          'https://www.autoscout24.de/assets/dead-link-1.jpg',
          'https://www.autoscout24.de/assets/dead-link-2.jpg',
          'https://www.autoscout24.de/assets/dead-link-3.jpg',
          'https://www.autoscout24.de/assets/dead-link-4.jpg'
        ]);
      });
    });

    it('should not report dead links given internal links inside unsupported attributes', () => {
      mockFs({
        'public/content/de': {
          'index.html': '<a some-attr="https://www.autoscout24.de/foobar/">'
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24'
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(0);
      });
    });

    it('should not report dead links given valid internal links', () => {
      mockFs({
        'public/assets': {
          'image.jpg': 'image'
        },
        'public/content/de': {
          'index.html': `
            <a href="https://www.autoscout24.de/bmw/">
            <a href="/bmw/">
            <img src="https://www.autoscout24.de/assets/image.jpg">
          `,
          'bmw': {
            'index.html': 'Some content'
          }
        }
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24'
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(0);
      });
    });

    it('should respect top level domains when searching internal dead links', () => {
      mockFs({
        'public/content/de/index.html': `
          <a href="https://www.autoscout24.de/bmw/">
          <a href="/bmw/">
        `,
        'public/content/it/bmw/index.html': 'Some content'
      });
      return checkForInternalDeadLinks({
        rootDirectory: 'public',
        secondLevelDomain: 'autoscout24'
      }).then(deadLinksByFiles => {
        expect(deadLinksByFiles).to.have.length(1);
        expect(deadLinksByFiles[0].deadLinks).to.have.length(2);
      });
    });

  });

  it('should correctly process all files given a custom files chunk size smaller than the file count', () => {
    mockFs({
      'public/content/de': {
        'bmw': {
          'index.html': '<a href="https://www.autoscout24.de/moto/dead-link-1/">'
        },
        'ktm': {
          'index.html': '<a href="https://www.autoscout24.de/moto/dead-link-2/">'
        }
      }
    });
    return checkForInternalDeadLinks({
      rootDirectory: 'public',
      secondLevelDomain: 'autoscout24',
      urlPathPrefixes: ['moto'],
      filesChunkSize: 1
    }).then(deadLinksByFiles => {
      expect(deadLinksByFiles.length).to.equal(2);
    });
  });

});
