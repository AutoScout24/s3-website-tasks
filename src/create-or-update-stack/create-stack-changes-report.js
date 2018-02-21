const statusesThatMarkFailures = ['CREATE_FAILED', 'UPDATE_FAILED'];

class StackChangesReport {
  constructor ({events, wasSuccessful}) {
    this.events = events;
    this.wasSuccessful = wasSuccessful;
  }
}

module.exports = (stackEvents, startOfStackChanges) => {
  const relevantEvents = stackEvents.filter(({Timestamp}) => Timestamp >= startOfStackChanges);
  const eventStatuses = relevantEvents.map(event => event.ResourceStatus);
  const wasSuccessful = !eventStatuses.some(status => statusesThatMarkFailures.includes(status));
  return new StackChangesReport({
    wasSuccessful: wasSuccessful,
    events: relevantEvents
  });
};
