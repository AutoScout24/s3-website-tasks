module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/.*?([^/.]+)\/(fr\/|nl\/)?(?:[^/]*)\/(.*)$/, 'content/$1/$2$3');
