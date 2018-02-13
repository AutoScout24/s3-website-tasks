module.exports = (deadLinksByFiles) => {
  if (deadLinksByFiles.length == 0) return '';

  const allUrls = deadLinksByFiles.map(deadLinksByFile => deadLinksByFile.deadLinks)
  .reduce(((sum, element) => sum.concat(element)), []);
  const deadlinksCountMessage = `found ${allUrls.length} dead internal link(s)`;

  const urlsGroupedByFilenames = deadLinksByFiles.map(
    deadLinksByFile => deadLinksByFile.deadLinks.map(url => `"${deadLinksByFile.filename}","${url}"`)
  );

  const singleUrlsByFilename = urlsGroupedByFilenames.reduce(
    ((sum, urlsGroupedByFilename) => sum.concat(urlsGroupedByFilename)), []
  );

  const report = [deadlinksCountMessage].concat(singleUrlsByFilename).join('\n');

  return report;
};
