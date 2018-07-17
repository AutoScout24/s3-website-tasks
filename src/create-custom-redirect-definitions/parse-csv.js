module.exports = csv => csv.replace(/\r/g, '')
.replace(/\x0d/g, '')
.split('\n')
.filter(line => line != '')
.map(line => line.split(','));
