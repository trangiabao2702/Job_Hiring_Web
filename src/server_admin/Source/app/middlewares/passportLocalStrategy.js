const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const adminModel = require('../models/admin.m');

module.exports = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    passport.deserializeUser(async function (user, done) {
        try {
            //const user = await userModel.getByUserName(username);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    },
        async (email, password, done) => {
            try {
                const user = await adminModel.getAmdinbyUsername(email);
                if (!user) { return done(null, false); }
                const cmp = user.password === password ? 1 : 0;
                if (!cmp) {
                    return done(null, false,  { messageDanger: 'Password entered is incorrect.' });
                }
                return done(null, user);
            } catch (error) {
                done(error);
            }
        }
    ));

}
