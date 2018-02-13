/* global describe, expect, it */
describe('minify-images', () => {

  const fs = require('fs');
  const {execSync} = require('child_process');

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
    return minifyImages({srcPath: './src/minify-images/test-images', destPath})
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
    return minifyImages({srcPath: './src/minify-images/test-images', destPath})
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
    return minifyImages({srcPath: './src/minify-images/test-images', destPath})
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
    return minifyImages({srcPath: './src/minify-images/test-images', destPath})
    .then(() => statAsync(`${destPath}/subfolder/subfolder-test.jpg`))
    .then(stat => expect(stat.size).to.be.greaterThan(0));
  });


});
