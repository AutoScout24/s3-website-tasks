/* global describe, expect, it, */
describe('s3-website-tasks', () => {

  const s3WebsiteTasks = require('./');

  it('should expose all functions correctly', () => {
    const functionNames = Object.keys(s3WebsiteTasks);
    expect(functionNames.length).to.be.above(0);
    functionNames.forEach(functionName => {
      expect(s3WebsiteTasks[functionName]).to.be.a('function');
    });
  });

});
