module.exports = csv => csv.replace('\r')
.split('\n')
.filter(line => line != '')
.map(line => line.split(','));
