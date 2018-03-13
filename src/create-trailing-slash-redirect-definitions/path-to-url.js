const getUrlPathPrefix = (urlPathPrefixMap, targetKey) => {
  const matchingEntry = urlPathPrefixMap.find(({key}) => key == targetKey);
  if (matchingEntry) return matchingEntry.value;
  if (!matchingEntry && targetKey == '*') throw new Error('no suitable url path prefix found');
  return getUrlPathPrefix(urlPathPrefixMap, '*');
};

module.exports = ({thirdLevelDomain, secondLevelDomain, urlPathPrefixMap, path}) => {
  const [tld, language, urlPath] = path.match(/^content\/([^/]+)\/(?:(nl|fr)\/)?(.*)$/).slice(1);
  const key = language ? `${tld}/${language}` : tld;
  const fqdn = `${thirdLevelDomain}.${secondLevelDomain}.${tld}`;
  const urlPathPrefix = getUrlPathPrefix(urlPathPrefixMap, key);
  if (language) return `https://${fqdn}/${language}/${urlPathPrefix}/${urlPath}`;
  else return `https://${fqdn}/${urlPathPrefix}/${urlPath}`;
};
