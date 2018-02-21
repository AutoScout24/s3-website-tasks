const promisify = require('util.promisify');

const wereStackChangesProcessed = require('./were-stack-changes-processed');
const createStackChangesReport = require('./create-stack-changes-report');

module.exports = ({stackName, startOfStackChanges, cloudFormation}) => {

  const describeStacksAsync = promisify(cloudFormation.describeStacks.bind(cloudFormation));
  const describeStackEventsAsync = promisify(cloudFormation.describeStackEvents.bind(cloudFormation));

  const getStackId = stackName => describeStacksAsync({StackName: stackName}).then(({Stacks}) => Stacks[0].StackId);

  const waitForStackCompletion = (stackId, startOfStackChanges) => new Promise((resolve, reject) => {
    describeStackEventsAsync({StackName: stackId})
    .then(({StackEvents}) => wereStackChangesProcessed(StackEvents, startOfStackChanges)
    .then(wereStackChangesProcessed => {
      if (wereStackChangesProcessed) {
        resolve(createStackChangesReport(StackEvents, startOfStackChanges));
      }
      else setTimeout(() => {
        waitForStackCompletion(stackId, startOfStackChanges).then(resolve).catch(reject);
      }, 2500);
    })
    )
    .catch(reject);
  });

  getStackId(stackName).then(stackId => waitForStackCompletion(stackId, startOfStackChanges));
};
