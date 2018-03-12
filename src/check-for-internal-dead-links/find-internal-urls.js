const findAllMatches = (text, regex) => {
  const matchResults = [];
  let matchResult = regex.exec(text);
  while (matchResult) {
    matchResults.push(matchResult);
    matchResult = regex.exec(text);
  }
  return matchResults;
};

const htmlAttributeNames = ['href', 'srcset', 'src'];
const htmlAttributeNamesString = htmlAttributeNames.join('|');

module.exports = (
  {text, thirdLevelDomain = 'www', secondLevelDomain, pathPrefixes}
) => {

  const pathPrefxesString = pathPrefixes.join('|');
  const fqdnString = `${thirdLevelDomain}\\.${secondLevelDomain}\\.[^/]+?`;

  const urlRegex = new RegExp(
    `(?:${htmlAttributeNamesString})="((?:https?:\\/\\/${fqdnString})?\\/(?:assets\\/)?(?:${pathPrefxesString})[^"]*?)"`
    , 'gi');

  const urls = findAllMatches(text, urlRegex).map(matchResult => matchResult[1]);
  const urlsWithoutWebp = urls.filter(url => (url.indexOf('.webp') == -1));
  return urlsWithoutWebp;
};
