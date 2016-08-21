const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

module.exports = function(passport) {
  const auth = (req, account, password, done) => {
    User.findOne({account}).exec()
    .then(user => {
      if (!user || !user.validPassword(password)) {
        return done(null, false)
      }
      req.session.user = user
      return done(null, user)
    })
    .catch(err => {
      console.error(err.stack)
      done(err)
    })
  }

  passport.use(new LocalStrategy({
    usernameField: 'account',
    passwordField: 'password',
    passReqToCallback: true,
  }, auth))

  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
