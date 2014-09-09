var zlib = require('zlib');
var http = require('http');
var fs = require('fs');

http.createServer(function(req,res){
  var raw = fs.createReadStream('timeWrong.html');
  var acceptEncoding = req.headers['accept-encoding'];
  if(!acceptEncoding){
    acceptEncoding = '';
  }

   if (acceptEncoding.match(/\bdeflate\b/)) {
    res.writeHead(200, { 'content-encoding': 'deflate' });
    raw.pipe(zlib.createDeflate()).pipe(res);
  } else if (acceptEncoding.match(/\bgzip\b/)) {
    res.writeHead(200, { 'content-encoding': 'gzip' });
    raw.pipe(zlib.createGzip()).pipe(res);
  } else {
    res.writeHead(200, {}); 
    raw.pipe(res);
  }
}).listen(3000);