/* global describe, expect, it */
describe('create-or-update-stack/were-stack-changes-processed', () => {

  const wereStackChangesProcessed = require('./were-stack-changes-processed');

  it('should return false given no events', () => {
    return wereStackChangesProcessed([], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return false given only events that do not mark a completed processing', () => {
    const event1 = {Timestamp: new Date(1), ResourceStatus: 'CREATE_IN_PROGRESS'};
    const event2 = {Timestamp: new Date(2), ResourceStatus: 'UPDATE_IN_PROGRESS'};
    return wereStackChangesProcessed([event1, event2], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return true given a create event that marks a completed processing', () => {
    const event = {Timestamp: new Date(1), ResourceStatus: 'CREATE_COMPLETE'};
    return wereStackChangesProcessed([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return true given an update event that marks a completed processing', () => {
    const event = {Timestamp: new Date(2), ResourceStatus: 'UPDATE_COMPLETE'};
    return wereStackChangesProcessed([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return true given a create failed event that marks a completed processing', () => {
    const event = {Timestamp: new Date(2), ResourceStatus: 'CREATE_FAILED'};
    return wereStackChangesProcessed([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return true given an update failed event that marks a completed processing', () => {
    const event = {Timestamp: new Date(2), ResourceStatus: 'UPDATE_FAILED'};
    return wereStackChangesProcessed([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

  it('should return false given an event that marks an application older than the start timestamp', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'CREATE_COMPLETE'};
    return wereStackChangesProcessed([event], 1)
    .then(isStackCompleted => expect(isStackCompleted).to.be.false);
  });

  it('should return true given an event that marks an application equal to the start timestamp', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'UPDATE_COMPLETE'};
    return wereStackChangesProcessed([event], 0)
    .then(isStackCompleted => expect(isStackCompleted).to.be.true);
  });

});
