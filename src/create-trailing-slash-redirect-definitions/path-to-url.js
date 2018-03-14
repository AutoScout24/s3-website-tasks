const getUrlPathPrefix = (urlPathPrefixMap, targetKey) => {
  const matchingEntry = urlPathPrefixMap.find(({key}) => key == targetKey);
  if (matchingEntry) return matchingEntry.value;
  if (!matchingEntry && targetKey == '*') return null;
  return getUrlPathPrefix(urlPathPrefixMap, '*');
};

module.exports = ({thirdLevelDomain, secondLevelDomain, urlPathPrefixMap, path}) => {
  const [tld, language, contentUrlPath] = path.match(/^content\/([^/]+)\/(?:(nl|fr)\/)?(.*)$/).slice(1);
  const key = language ? `${tld}/${language}` : tld;
  const fqdn = `${thirdLevelDomain}.${secondLevelDomain}.${tld}`;
  const urlPathPrefix = getUrlPathPrefix(urlPathPrefixMap, key);
  const urlPathComponents = [language, urlPathPrefix, contentUrlPath];
  const urlPath = urlPathComponents.filter(component => component != null).join('/');
  return `https://${fqdn}/${urlPath}`;
};
