module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/www\.[^/]+\.[^/]+\/(assets\/.*?\/)/, '$1')
.replace(/(www\.[^/]+\.[^/]+)\/(.*?)\/(.*)$/, '$2/$1/$3index.html');
