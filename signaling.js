/*global console*/
var uuid = require('node-uuid');
var crypto = require('crypto');
// var config = require('getconfig'),
// var port = parseInt(process.env.PORT || config.signalserver.port, 10);
// var fs = require('fs');
// var privateKey = fs.readFileSync('sslcert/privatekey.pem').toString(),
//     certificate = fs.readFileSync('sslcert/certificate.pem').toString(),
//     cacert = fs.readFileSync('sslcert/cacert.pem').toString();
    // port = 8888,
// var io = require('socket.io').listen(port, { key:privateKey,cert:certificate,ca:cacert });

module.exports = function (io) {
    // console.log('pass io to socket.io');
    var config = require('./config');
    process.env.NODE_ENV = 'development'; // set env

    // if (config.logLevel) {
    //     // https://github.com/Automattic/socket.io/wiki/Configuring-Socket.IO
    //     io.set('log level', config.logLevel);
    // }

    function describeRoom(name) {
        var clients = io.sockets.clients(name);
        console.log('clients', clients);
        var result = {
            clients: {}
        };
        clients.forEach(function (client) {
            result.clients[client.id] = client.resources;
        });
        return result;
    }

    function safeCb(cb) {
        if (typeof cb === 'function') {
            return cb;
        } else {
            return function () {};
        }
    }

    io.sockets.on('connection', function (client) {
        // test case
        
        console.log('connection');
        // console.log('rooms', io.sockets.adapter.rooms);
         
        client.resources = {
            screen: false,
            video: true,
            audio: false
        };

        // pass a message to another id
        client.on('message', function (details) {
            if (!details) return;

            var otherClient = io.sockets.sockets[details.to];
            if (!otherClient) return;

            details.from = client.id;
            console.log('details.username',details.username);
            otherClient.emit('message', details);
        });

        client.on('shareScreen', function () {
            client.resources.screen = true;
        });

        client.on('unshareScreen', function (type) {
            client.resources.screen = false;
            removeFeed('screen');
        });

        client.on('join', join);

        function removeFeed(type) {
            if (client.room) {
                io.sockets.in(client.room).emit('remove', {
                    id: client.id,
                    type: type
                });
                if (!type) {
                    client.leave(client.room);
                    client.room = undefined;
                }
            }
        }

        function join(name, cb) {
            // sanity check
            if (typeof name !== 'string') return;
            // leave any existing rooms
            removeFeed();
            safeCb(cb)(null, describeRoom(name));
            client.join(name);
            client.room = name;
        }

        // we don't want to pass "leave" directly because the
        // event type string of "socket end" gets passed too.
        client.on('disconnect', function () {
            removeFeed();
        });
        client.on('leave', function () {
            removeFeed();
        });

        client.on('create', function (name, cb) {
            if (arguments.length == 2) {
                cb = (typeof cb == 'function') ? cb : function () {};
                name = name || uuid();
            } else {
                cb = name;
                name = uuid();
            }
            // check if exists
            if (io.sockets.clients(name).length) {
                safeCb(cb)('taken');
            } else {
                join(name);
                safeCb(cb)(null, name);
            }
        });

        /* =================== new events ======================== */
        /* deal with sketch point data */
        client.on('sendStroke', function (point) {
            client.broadcast.to(client.roomId).emit('syncStroke', point);
        });

        client.on('signalSyncChart', function (chartData) {
            console.log('client.on signalSyncChart');
            client.broadcast.to(client.roomId).emit('syncChart', chartData);
        });

        client.on('signalSyncPreview', function (previewData) {
            console.log('server get signalSyncPreview');
            client.broadcast.to(client.roomId).emit('syncPreview', previewData);
        });

        client.on('signalSyncImpress', function (impressData) {
            console.log('server got your daibi impress');
            client.broadcast.to(client.roomId).emit('syncImpress', impressData);
        });

        client.on('sendOutlineText', function (outlineText) {
            client.broadcast.to(client.roomId).emit('syncOutlineText', sendOutlineText);
        })

        /* ========================== end new events ======================= */


        // tell client about stun and turn servers and generate nonces
        client.emit('stunservers', config.stunservers || []);

        // create shared secret nonces for TURN authentication
        // the process is described in draft-uberti-behave-turn-rest
        var credentials = [];
        config.turnservers.forEach(function (server) {
            var hmac = crypto.createHmac('sha1', server.secret);
            // default to 86400 seconds timeout unless specified
            var username = Math.floor(new Date().getTime() / 1000) + (server.expiry || 86400) + "";
            hmac.update(username);
            credentials.push({
                username: username,
                credential: hmac.digest('base64'),
                url: server.url
            });
        });
        client.emit('turnservers', credentials);
    });

    if (config.uid) process.setuid(config.uid);
    // console.log(yetify.logo() + ' -- signal master is running at: http://localhost:' + port);
};

