module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/(www\.autoscout24\.[^/]+)\/(.*?)\/(.*)$/, '$2/$1/$3');
