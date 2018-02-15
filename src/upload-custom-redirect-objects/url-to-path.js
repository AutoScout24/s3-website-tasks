module.exports = (url) => url
.replace(/https?:\/\//, '')
.replace(/([^/]+)\/(fr\/|nl\/)?([^/]*)\/(.*)$/, '$3/$1/$2$4');
