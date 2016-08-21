const fs = require('fs')
const path = require('path')

const config = {
  /* web server config */
  debug: true,

  host: '0.0.0.0',
  port: 3000,

  db: 'mongodb://localhost/ecclesia',
  db_name: 'ecclesia',

  session_secret: 'ecclesia_session_secret',
  auth_cookie_name: 'ecclesia',

  cookieSecret: 'ecclesiadatabase',

  upload: {
    path: path.join(__dirname, 'static/upload/'),
    url: '/static/upload/'
  },

  /* signal server config */
  signal: {
    port: 8888,
    opts: {
      key: fs.readFileSync('sslcert/key.pem').toString(),
      cert: fs.readFileSync('sslcert/cert.pem').toString(),
      passphrase: null,
    },
  },

  stunservers: [
    { url: "stun:stun.l.google.com:19302" }
  ],

  turnservers: [
    /*
    { "url": "turn:localhost",
      "secret": "turnserversharedsecret",
      "expiry": 86400 }
    */
  ],

}


module.exports = config
