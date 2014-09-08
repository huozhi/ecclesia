var zlib = require('zlib');

var gzip = zlib.createGzip();

var fs = require('fs');
var inp = fs.createReadStream('example.md');
var out = fs.createWriteStream('example.md.gz');

inp.pipe(gzip).pipe(out);