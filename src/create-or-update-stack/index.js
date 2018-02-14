const aws = require('aws-sdk');
const promisify = require('util.promisify');

const waitForStackCompletion = require('./wait-for-stack-completion');

module.exports = ({stackName, cloudFormationTemplate, region = 'eu-west-1'}) => {
  const cloudFormation = new aws.CloudFormation({region});

  const describeStacksAsync = promisify(cloudFormation.describeStacks.bind(cloudFormation));
  const createStackAsync = promisify(cloudFormation.createStack.bind(cloudFormation));
  const updateStackAsync = promisify(cloudFormation.updateStack.bind(cloudFormation));

  const determineStackOperation = stackName => describeStacksAsync({StackName: stackName})
  .then(() => updateStackAsync)
  .catch(() => createStackAsync);

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
