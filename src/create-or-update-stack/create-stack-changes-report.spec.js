/* global describe, expect, it */
describe('create-or-update-stack/create-stack-changes-report', () => {

  const createStackChangesReport = require('./create-stack-changes-report');

  it('should only include events equal or greater than the start timestamp', () => {
    const event1 = {Timestamp: new Date(1), ResourceStatus: 'CREATE_IN_PROGRESS'};
    const event2 = {Timestamp: new Date(2), ResourceStatus: 'CREATE_IN_PROGRESS'};
    const event3 = {Timestamp: new Date(3), ResourceStatus: 'CREATE_COMPLETED'};
    const report = createStackChangesReport([event1, event2, event3], 2);
    expect(report.events).to.deep.equal([event2, event3]);
  });

  it('should report that the operation was successful given there are no failed events', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'CREATE_COMPLETED'};
    const report = createStackChangesReport([event], 0);
    expect(report.wasSuccessful).to.be.true;
  });

  it('should report that the operation was unsuccessful given there are failed events', () => {
    const event = {Timestamp: new Date(0), ResourceStatus: 'UPDATE_FAILED'};
    const report = createStackChangesReport([event], 0);
    expect(report.wasSuccessful).to.be.false;
  });

});
