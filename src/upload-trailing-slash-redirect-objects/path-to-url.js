module.exports = (path) => path.replace(/^([^/]*)\/(.*?)\/(.*)/, 'https://$2/$1/$3');
