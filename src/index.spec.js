/* global describe, expect, it, */
describe('s3-static-website-tasks', () => {

  const s3StaticWebsiteTasks = require('./');

  it('should expose all functions correctly', () => {
    const functionNames = Object.keys(s3StaticWebsiteTasks);
    expect(functionNames.length).to.be.above(0);
    functionNames.forEach(functionName => {
      expect(s3StaticWebsiteTasks[functionName]).to.be.a('function');
    });
  });

});
