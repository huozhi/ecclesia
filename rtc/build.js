var bundle = require('browserify')(),
    fs = require('fs');
    // request = require('request');
    // uglify = require('uglify-js');

bundle.add('./simplewebrtc');
bundle.bundle({standalone: 'SimpleWebRTC'}, function (err, source) {
    if (err) console.error(err);
    var version = '0.9.16';
    var sock = fs.readFileSync('./socket.io-' + version + '.js').toString();
    fs.writeFileSync('simplewebrtc.bundle.js', source + sock);
});
