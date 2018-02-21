const aws = require('aws-sdk');
const promisify = require('util.promisify');

const waitForStackCompletion = require('./wait-for-stack-completion');
const createStackChangesReport = require('./create-stack-changes-report');

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
  .then(() => waitForStackCompletion({stackName, startOfStackChanges, cloudFormation}))
  .catch(error => {
    if (error.message.includes('No updates are to be performed')) {
      return createStackChangesReport([], Date.now());
    }
    else {
      throw error;
    }
  });
};
