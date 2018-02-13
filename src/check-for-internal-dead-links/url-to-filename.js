module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/www\.autoscout24\.[^/]+\/(assets\/.*?\/)/, '$1')
.replace(/(www\.autoscout24\.[^/]+)\/(.*?)\/(.*)$/, '$2/$1/$3index.html');
