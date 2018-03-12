module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/www\.[^/]+\.[^/]+\/(assets\/.*?\/)/, '$1')
.replace(/www\.[^/]+\.([^/]+)\/[^/]+\/(.*)$/, 'content/$1/$2index.html');
