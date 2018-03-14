module.exports = ({url, urlPathPrefixes = []}) => {
  const urlWithoutProtocol = url.replace(/https?:\/\//, '');
  const isAssetsUrl = /^[^/]+\/assets\//.test(urlWithoutProtocol);
  const urlPathPrefixesGroup = `(?:(?:${urlPathPrefixes.join('|')})\\/)?`;
  if (isAssetsUrl) {
    const assetsUrlRegex = new RegExp(`^[^/]+\\/assets\\/${urlPathPrefixesGroup}(.*)$`);
    return urlWithoutProtocol.replace(assetsUrlRegex, 'assets/$1');
  }
  else {
    const belgiumPathPrefix = '(nl\\/|fr\\/)?';
    const contentUrlRegex = new RegExp(`^[^.]+\\.[^.]+\\.([^/]+)\\/${belgiumPathPrefix}${urlPathPrefixesGroup}(.*)$`);
    return urlWithoutProtocol.replace(contentUrlRegex, 'content/$1/$2$3index.html');
  }
};
