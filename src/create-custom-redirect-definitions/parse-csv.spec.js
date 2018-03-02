/* global describe, expect, it */
describe('create-custom-redirect-definitions/parse-csv', () => {

  const parseCsv = require('./parse-csv');

  it('should correctly parse a csv', () => {
    const result = parseCsv('row1-col1,row1-col2\nrow2-col1,row2-col2');
    expect(result).to.deep.equal([['row1-col1', 'row1-col2'], ['row2-col1', 'row2-col2']]);
  });
});
