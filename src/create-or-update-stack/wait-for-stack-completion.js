const aws = require('aws-sdk');
const promisify = require('util.promisify');

const cloudFormation = new aws.CloudFormation();

const checkIfStackIsCompleted = require('./check-if-stack-is-completed');

const describeStacksAsync = promisify(cloudFormation.describeStacks.bind(cloudFormation));
const describeStackEventsAsync = promisify(cloudFormation.describeStackEvents.bind(cloudFormation));

const getStackId = stackName => describeStacksAsync({StackName: stackName}).then(({Stacks}) => Stacks[0].StackId);

const waitForStackCompletion = (stackId, startOfStackChanges) => new Promise((resolve, reject) => {
  describeStackEventsAsync({StackName: stackId})
  .then(({StackEvents}) => checkIfStackIsCompleted(StackEvents, startOfStackChanges))
  .then(isStackCompleted => {
    if (isStackCompleted) resolve();
    else setTimeout(() => {
      waitForStackCompletion(stackId, startOfStackChanges).then(resolve).catch(reject);
    }, 2500);
  })
  .catch(reject);
});

module.exports = (stackName, startOfStackChanges) => getStackId(stackName)
.then(stackId => waitForStackCompletion(stackId, startOfStackChanges));
