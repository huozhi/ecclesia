/*
 * configs
 */

var path = require('path');

var config = {
    /* web server config */
    debug: true,

    
    host: 'localhost',
    port: 3000,


    db: 'mongodb://localhost/ecclesia',
    db_name: 'ecclesia',

    session_secret: 'ecclesia_session_secret',
    auth_cookie_name: 'ecclesia',
    
    cookieSecret: 'ecclesiadatabase',
    mail_opts: {
        // host: '',
        // port: ,
        // auth: {
            // user: '',
            // pwd:  ''
        // }
    },

    upload: {
        path: path.join(__dirname, 'public/upload/'),
        url: '/public/upload/'
    },

    /* signal server config */
    

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

};


module.exports = config;
