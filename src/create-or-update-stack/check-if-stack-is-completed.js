const statusesThatMarkCompletion = ['CREATE_COMPLETE', 'UPDATE_COMPLETE'];

module.exports = (stackEvents, startOfStackChanges) => new Promise(resolve => {
  const relevantEvents = stackEvents.filter(({Timestamp}) => Timestamp >= startOfStackChanges);
  const eventsThatMarkCompletion =
    relevantEvents.filter(({ResourceStatus}) => statusesThatMarkCompletion.indexOf(ResourceStatus) > -1);
  resolve(eventsThatMarkCompletion.length > 0);
});
