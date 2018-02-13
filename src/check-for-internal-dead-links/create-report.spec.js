/* global describe, expect, it */
describe('check-for-internal-dead-links/create-report', () => {

  const createReport = require('./create-report');
  const DeadLinksByFile = require('./value-objects/dead-links-by-file');

  it('should return an empty string given no dead links', () => {
    expect(createReport([])).to.equal('');
  });

  describe('given dead links by file objects', () => {

    const deadLinksByFiles = [
      new DeadLinksByFile('file1', ['dead-link-1', 'dead-link-2']),
      new DeadLinksByFile('file2', ['dead-link-3',])
    ];

    it('should report a correct total count of dead links', () => {
      const report = createReport(deadLinksByFiles);
      expect(report).to.contain('found 3 dead internal link(s)');
    });

    it('should report the individual dead links by file', () => {
      const report = createReport(deadLinksByFiles);
      expect(report).to.contain('"file1","dead-link-1"');
      expect(report).to.contain('"file1","dead-link-2"');
      expect(report).to.contain('"file2","dead-link-3"');
    });

  });

});
