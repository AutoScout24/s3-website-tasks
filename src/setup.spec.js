/* global afterEach, before, beforeEach */

before(() => {
  const chai = require('chai');
  const sinonChai = require('sinon-chai');
  chai.use(sinonChai);

  global.expect = chai.expect;
  global.sandbox = null;
});

beforeEach(() => {
  const sinon = require('sinon');
  global.sandbox = sinon.sandbox.create();
});

afterEach(() => {
  global.sandbox.restore();
});
