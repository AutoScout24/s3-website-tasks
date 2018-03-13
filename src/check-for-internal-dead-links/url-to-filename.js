module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/www\.[^/]+\.[^/]+\/assets\/[^/]+/, 'assets')
.replace(/www\.[^/]+\.([^/]+)\/[^/]+\/(.*)$/, 'content/$1/$2index.html');
