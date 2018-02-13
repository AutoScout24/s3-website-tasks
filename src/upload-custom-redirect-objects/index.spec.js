/* global afterEach, beforeEach, describe, expect, it, sandbox */
describe('upload-custom-redirect-objects', () => {

  const mockFs = require('mock-fs');
  const aws = require('aws-sdk');
  const sinon = require('sinon');

  let uploadCustomRedirectObjects;
  let putObjectStub;

  beforeEach(() => {
    delete require.cache[require.resolve('./')];
    putObjectStub = sandbox.stub().yields(null);
    sandbox.stub(aws, 'S3').returns({putObject: putObjectStub});
    uploadCustomRedirectObjects = require('./');
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('given a single redirects file', () => {
    beforeEach(() => {
      mockFs({
        'redirects/www.autoscout24.de.csv': 'service/some-url/,service/some-redirected-url/'
      });
      return uploadCustomRedirectObjects({
        s3BucketName: 'my-bucket',
        redirectsFolder: 'redirects'
      });
    });

    it('should put an empty object into an S3 bucket', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Body: ''
      }));
    });

    it('should put the object in the correct bucket', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Bucket: 'my-bucket'
      }));
    });

    it('should correctly translate the source url to an object key', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Key: 'service/www.autoscout24.de/some-url/',
      }));
    });

    it('should correctly combine the file name with the target path to a full url', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        WebsiteRedirectLocation: 'https://www.autoscout24.de/service/some-redirected-url/'
      }));
    });

  });

  it('should process all files correctly given multiple redirect files', () => {
    mockFs({
      'redirects/www.autoscout24.de.csv': 'service/some-url/,service/some-redirected-url/',
      'redirects/www.autoscout24.it.csv': 'service/some-url/,service/some-redirected-url/'
    });
    return uploadCustomRedirectObjects({
      s3BucketName: 'my-bucket',
      redirectsFolder: 'redirects'
    })
    .then(() => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        WebsiteRedirectLocation: 'https://www.autoscout24.de/service/some-redirected-url/'
      }));
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        WebsiteRedirectLocation: 'https://www.autoscout24.it/service/some-redirected-url/'
      }));
    });
  });


});
