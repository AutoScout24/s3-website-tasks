module.exports = (path) => path.replace(/^([^/]*)\/([^/]*)\/(nl\/|fr\/)?(.*)/, 'https://$2/$3$1/$4');
