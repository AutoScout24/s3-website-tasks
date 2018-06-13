module.exports = ({url, urlPathPrefixes = []}) => {
  let urlWithoutProtocol = url.replace(/https?:\/\//, '');
  const isAssetsUrl = /^[^/]+\/assets\//.test(urlWithoutProtocol);
  const urlPathPrefixesGroup = `(?:(?:${urlPathPrefixes.join('|')})\\/)?`;
  if (isAssetsUrl) {
    const assetsUrlRegex = new RegExp(`^[^/]+\\/assets\\/${urlPathPrefixesGroup}(.*)$`);
    return urlWithoutProtocol.replace(assetsUrlRegex, 'assets/$1');
  }
  else {
    const belgiumPathPrefix = '(nl\\/|fr\\/)?';
    let contentUrlRegex = new RegExp(`^[^.]+\\.[^.]+\\.([^/]+)\\/${belgiumPathPrefix}${urlPathPrefixesGroup}(.*)$`);
    urlWithoutProtocol = (/\/$/.test(urlWithoutProtocol)) ? urlWithoutProtocol : `${urlWithoutProtocol}/`;
    let result = urlWithoutProtocol.replace(contentUrlRegex, 'content/$1/$2$3index.html').replace('com.ua','ua').replace('com.tr','tr');
    console.log("urlWithoutProtocol " + urlWithoutProtocol);
    console.log("result " + result);
    return result;
  }
};
