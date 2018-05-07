const aws = require('aws-sdk');
const promisify = require('util.promisify');

module.exports = ({stackName, region = 'eu-west-1'}) => {
  const cloudFormation = new aws.CloudFormation({region});
  const deleteStacksAsync = promisify(cloudFormation.deleteStack.bind(cloudFormation));
  const deleteStack = stackName => deleteStacksAsync({StackName: stackName});
  return deleteStack(stackName);
};
