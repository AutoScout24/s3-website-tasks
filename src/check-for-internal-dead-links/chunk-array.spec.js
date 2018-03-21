/* global describe, expect, it */
describe('check-for-internal-dead-links/chunk-array', () => {

  const chunkArray = require('./chunk-array');

  it('should correctly chunk an array given input data resulting in equal chunks', () => {
    const chunks = chunkArray([1, 2, 3, 4, 5, 6], 2);
    expect(chunks).to.deep.equal([[1, 2], [3, 4], [5, 6]]);
  });

  it('should correctly chunk an array given input data resulting in unequal chunks', () => {
    const chunks = chunkArray([1, 2, 3, 4, 5, 6, 7], 3);
    expect(chunks).to.deep.equal([[1, 2, 3], [4, 5, 6], [7]]);
  });

});
