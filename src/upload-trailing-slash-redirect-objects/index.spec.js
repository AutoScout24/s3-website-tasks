/* global afterEach, beforeEach, describe, expect, it, sandbox */
describe('upload-trailing-slash-redirect-objects', () => {

  const mockFs = require('mock-fs');
  const aws = require('aws-sdk');
  const sinon = require('sinon');

  let uploadTrailingSlashRedirectObjects;
  let putObjectStub;

  beforeEach(() => {
    delete require.cache[require.resolve('./')];
    putObjectStub = sandbox.stub().yields(null);
    sandbox.stub(aws, 'S3').returns({putObject: putObjectStub});
    uploadTrailingSlashRedirectObjects = require('./');
  });

  afterEach(() => {
    mockFs.restore();
  });

  describe('given a single subdirectory', () => {
    beforeEach(() => {
      mockFs({
        'public/service/www.autoscout24.de/some-folder': {}
      });
      return uploadTrailingSlashRedirectObjects({
        s3BucketName: 'my-bucket',
        rootFolder: 'public'
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

    it('should use the same key as the directory without slash', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Key: 'service/www.autoscout24.de/some-folder',
      }));
    });

    it('should use a correct redirect url with slash', () => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        WebsiteRedirectLocation: 'https://www.autoscout24.de/service/some-folder/'
      }));
    });

  });

  it('should process all directories correctly given multiple', () => {
    mockFs({
      'public/service/www.autoscout24.de/some-folder': {},
      'public/service/www.autoscout24.de/some-other-folder': {}
    });
    return uploadTrailingSlashRedirectObjects({
      s3BucketName: 'my-bucket',
      rootFolder: 'public'
    })
    .then(() => {
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Key: 'service/www.autoscout24.de/some-folder',
        WebsiteRedirectLocation: 'https://www.autoscout24.de/service/some-folder/'
      }));
      expect(putObjectStub).to.have.been.calledWith(sinon.match({
        Key: 'service/www.autoscout24.de/some-other-folder',
        WebsiteRedirectLocation: 'https://www.autoscout24.de/service/some-other-folder/'
      }));
    });
  });

});
