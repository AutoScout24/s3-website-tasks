const aws = require('aws-sdk');
const promisify = require('util.promisify');

const cloudFormation = new aws.CloudFormation();

const describeStacksAsync = promisify(cloudFormation.describeStacks.bind(cloudFormation));
const createStackAsync = promisify(cloudFormation.createStack.bind(cloudFormation));
const updateStackAsync = promisify(cloudFormation.updateStack.bind(cloudFormation));

const waitForStackCompletion = require('./wait-for-stack-completion');

const determineStackOperation = stackName => describeStacksAsync({StackName: stackName})
.then(() => updateStackAsync)
.catch(() => createStackAsync);

module.exports = ({stackName, cloudFormationTemplate}) => {
  const startOfStackChanges = Date.now();
  return determineStackOperation(stackName)
  .then(createOrUpdateStackAsync => createOrUpdateStackAsync({
    StackName: stackName, TemplateBody: cloudFormationTemplate
  }))
  .then(result => {
    return waitForStackCompletion(stackName, startOfStackChanges)
    .catch(error => {
      if (error.message.indexOf('No updates are to be performed') == -1) {
        throw error;
      }
    })
    .then(result);
  });
};
