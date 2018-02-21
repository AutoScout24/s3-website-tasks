const statusesThatMarkCompletedProcessing = ['CREATE_COMPLETE', 'UPDATE_COMPLETE', 'CREATE_FAILED', 'UPDATE_FAILED'];

module.exports = (stackEvents, startOfStackChanges) => new Promise(resolve => {
  const relevantEvents = stackEvents.filter(({Timestamp}) => Timestamp >= startOfStackChanges);
  const eventStatuses = relevantEvents.map(event => event.ResourceStatus);
  const wereStackChangesApplied = eventStatuses.some(status => statusesThatMarkCompletedProcessing.includes(status));
  resolve(wereStackChangesApplied);
});
