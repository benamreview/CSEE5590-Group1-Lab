const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({username}).then(user => {
        if (!user || !user.validPassword(password)) {
            return done(null, false, {errors: {'email or password': 'is invalid'}});
        }

        return done(null, user);
    }).catch(done);
}));

module.exports = passport;
