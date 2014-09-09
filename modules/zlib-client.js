var zlib = require('zlib');

// var gzip = zlib.createGzip();

// var fs = require('fs');
// var inp = fs.createReadStream('example.md');
// var out = fs.createWriteStream('example.md.gz');

// inp.pipe(gzip).pipe(out);

var input = "...,,,....";
zlib.deflate(input, function(err, buffer){
  if(!err){
    //console.log(err);
    console.log(buffer.toString('base64'));
    //console.log(buffer);
    myUnzip (buffer);

  }
});
function myUnzip (buffer){
  zlib.inflate(buffer, function(err, buffer){
    if(!err){
      console.log(buffer.toString());
    }
  })
}



// var zlib = require('zlib');
// var http = require('http');
// var fs = require('fs');
// var request = http.get({
//     host: 'localhost',
//     path: '/',
//     port: 3000,
//     headers: {
//       'accept-encoding' : 'gzip, deflate'
//     }
//   },
//   function (response){
//     var output = fs.createWriteStream('got.html');

//     switch (response.headers['content-encoding']) {
//       // or, just use zlib.createUnzip() to handle both cases
//       case 'gzip':
//         response.pipe(zlib.createGunzip()).pipe(output);
//         break;
//       case 'deflate':
//         response.pipe(zlib.createInflate()).pipe(output);
//         break;
//       default:
//         response.pipe(output);
//         break;
//     }
//   }
// ).on('error', function(e){
//     console.log(e.message);
// });
