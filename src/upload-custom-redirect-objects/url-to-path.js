module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/(www\.[^/]+\.[^/]+)\/(.*?)\/(.*)$/, '$2/$1/$3');
