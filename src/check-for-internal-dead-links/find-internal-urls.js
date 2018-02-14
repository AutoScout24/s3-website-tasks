const findAllMatches = (text, regex) => {
  const matchResults = [];
  let matchResult = regex.exec(text);
  while (matchResult) {
    matchResults.push(matchResult);
    matchResult = regex.exec(text);
  }
  return matchResults;
};

const attributes = ['href', 'srcset', 'src'];

module.exports = (
  {text, secondLevelDomain, pathPrefixes}
) => {
  const urlRegex = new RegExp(
    `(?:${attributes.join('|')})="(https?:\\/\\/www\\.${secondLevelDomain}\\.[^/]+?\\/(?:assets\\/)?(?:${pathPrefixes.join('|')})[^"]*?)"`
    , 'gi');
  const urls = findAllMatches(text, urlRegex).map(matchResult => matchResult[1]);
  const urlsWithoutWebp = urls.filter(url => (url.indexOf('.webp') == -1));
  return urlsWithoutWebp;
};
