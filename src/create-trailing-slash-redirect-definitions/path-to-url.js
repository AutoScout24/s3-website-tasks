module.exports = ({fqdn, pathPrefix, path}) => path.replace(
  /^content\/[^/]+\/(nl\/|fr\/)?(.*)/, `https://${fqdn}/$1${pathPrefix}/$2`);
