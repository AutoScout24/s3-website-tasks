module.exports = class UrlsByFile {
  constructor(filename, urls, invalidUrls = []) {
    this.filename = filename;
    this.urls = urls;
    this.invalidUrls = invalidUrls;
  }
};
