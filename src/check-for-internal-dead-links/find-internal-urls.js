const findAllMatches = (text, regex) => {
  const matchResults = [];
  let matchResult = regex.exec(text);
  while (matchResult) {
    matchResults.push(matchResult);
    matchResult = regex.exec(text);
  }
  return matchResults;
};

const attributeNames = ['href', 'srcset', 'src'];
const attributeNamesString = attributeNames.join('|');

module.exports = (
  {text, thirdLevelDomain = 'www', secondLevelDomain, urlPathPrefixes}
) => {
  const invalidQuotationMarksRegex = new RegExp(`(${attributeNamesString})=[“|'](.*)[“|']`, 'gi');
  if(invalidQuotationMarksRegex.test(text)) {
    text = text.match(invalidQuotationMarksRegex);
    throw new Error(`${text[0]} includes invalid quotation marks`);
  }
  const protocol = 'https?:\\/\\/';
  const fqdn = `${thirdLevelDomain}\\.${secondLevelDomain}\\.[^/]+?`;
  const urlPathPrefxes = urlPathPrefixes ? `(?:${urlPathPrefixes.join('|')})` : '';
  const assetsAndLanguagePrefixes = '(?:(?:assets|fr|nl)\\/)?';
  const urlRegex = new RegExp(
    `(?:${attributeNamesString})="((?:${protocol}${fqdn})?\\/${assetsAndLanguagePrefixes}${urlPathPrefxes}[^"]*?)"`, 'gi'
  );

  const urls = findAllMatches(text, urlRegex).map(matchResult => matchResult[1]);
  const urlsWithoutWebp = urls.filter(url => (url.indexOf('.webp') == -1));
  const urlsWithoutPdf = urlsWithoutWebp.filter(url => (url.indexOf('.pdf') == -1));
  return urlsWithoutPdf;
};
