/* global describe, expect, it */
describe('create-or-update-stack/check-if-stack-is-completed', () => {

  const checkIfStackIsCompleted = require('./check-if-stack-is-completed');

  it('should return false given no events', () => {
    return checkIfStackIsCompleted([], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return false given events, that do not mark completion', () => {
    const event1 = {Timestamp: new Date(1), ResourceStatus: 'CREATE_IN_PROGRESS'};
    const event2 = {Timestamp: new Date(2), ResourceStatus: 'UPDATE_IN_PROGRESS'};
    return checkIfStackIsCompleted([event1, event2], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return true given a create event that marks completion', () => {
    const event = {Timestamp: new Date(1), ResourceStatus: 'CREATE_COMPLETE'};
    return checkIfStackIsCompleted([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return true given a update event that marks completion', () => {
    const event = {Timestamp: new Date(2), ResourceStatus: 'UPDATE_COMPLETE'};
    return checkIfStackIsCompleted([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return false given an event that marks completion older than the start timestamp', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'CREATE_COMPLETE'};
    return checkIfStackIsCompleted([event], 1)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return true given an event that marks completion equal to the start timestamp', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'UPDATE_COMPLETE'};
    return checkIfStackIsCompleted([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

});
