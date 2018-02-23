/* global describe, expect, it, sandbox */
describe('minify-images', () => {

  const fs = require('fs');
  const {execSync} = require('child_process');

  const imageminWebp = require('imagemin-webp');
  const imageminMozjpeg = require('imagemin-mozjpeg');
  const promisify = require('util.promisify');

  const minifyImages = require('./');

  const readFileAsync = promisify(fs.readFile);
  const statAsync = promisify(fs.stat);

  execSync('rm -rf .tmp');

  const setupSandboxDirectory = (rootFolder) => {
    execSync(`rm -rf ${rootFolder}`);
    execSync(`mkdir -p ${rootFolder}`);
  };

  it('should create a webp for a jpeg given it can be optimized', () => {
    const destPath = '.tmp/' + Math.random().toString();
    setupSandboxDirectory(destPath);
    return minifyImages({
      srcPath: './src/minify-images/test-images', destPath, imageminPlugins: [imageminWebp, imageminMozjpeg]
    })
    .then(() => Promise.all([
      readFileAsync(`${destPath}/test.jpg`),
      readFileAsync(`${destPath}/test.webp`)
    ]))
    .then(([jpegBuffer, webpBuffer]) => {
      const jpegContent = jpegBuffer.toString();
      const webpContent = webpBuffer.toString();
      expect(jpegContent).not.to.equal(webpContent);
    });
  });

  it('should create a fallback webp for a jpeg given it cannot be optimized', () => {
    const destPath = '.tmp/' + Math.random().toString();
    setupSandboxDirectory(destPath);
    return minifyImages({
      srcPath: './src/minify-images/test-images', destPath, imageminPlugins: [imageminWebp, imageminMozjpeg]
    })
    .then(() => Promise.all([
      readFileAsync(`${destPath}/test-without-webp.jpg`),
      readFileAsync(`${destPath}/test-without-webp.webp`)
    ]))
    .then(([jpegBuffer, webpBuffer]) => {
      const jpegContent = jpegBuffer.toString();
      const webpContent = webpBuffer.toString();
      expect(jpegContent).to.equal(webpContent);
    });
  });

  it('should compress jpegs with mozjpeg given it can be compressed', () => {
    const destPath = '.tmp/' + Math.random().toString();
    setupSandboxDirectory(destPath);
    return minifyImages({
      srcPath: './src/minify-images/test-images', destPath, imageminPlugins: [imageminWebp, imageminMozjpeg]
    })
    .then(() => Promise.all([
      statAsync('./src/minify-images/test-images/test.jpg'),
      statAsync(`${destPath}/test.jpg`)
    ]))
    .then(([jpegStat, compressedJpegStat]) => {
      expect(compressedJpegStat.size).to.be.lessThan(jpegStat.size);
    });
  });


  it('should correctly process files within subfolders', () => {
    const destPath = '.tmp/' + Math.random().toString();
    setupSandboxDirectory(destPath);
    return minifyImages({
      srcPath: './src/minify-images/test-images', destPath, imageminPlugins: [imageminWebp, imageminMozjpeg]
    })
    .then(() => statAsync(`${destPath}/subfolder/subfolder-test.jpg`))
    .then(stat => expect(stat.size).to.be.greaterThan(0));
  });

  it('should call the provided reporting callback with descriptive information', () => {
    const imageminPlugins = [imageminWebp, imageminMozjpeg];
    const reportingCallback = sandbox.spy();
    const destPath = '.tmp/' + Math.random().toString();
    setupSandboxDirectory(destPath);
    return minifyImages({
      srcPath: './src/minify-images/test-images/', destPath, imageminPlugins, reportingCallback
    })
    .then(() => {
      expect(reportingCallback).to.have.been.calledWith('executing imagemin plugin no. 1');
      expect(reportingCallback).to.have.been.calledWith('processing ./src/minify-images/test-images/');
      expect(reportingCallback).to.have.been.calledWith('processing ./src/minify-images/test-images/subfolder/');
    });
  });


});
